---
sidebar_position: 5
title: "Dynamic Buffers"
---

## Introduction
`DynamicBuffer<T>` is a lightweight, **serializable** wrapper around an array. It's designed for the common pattern of *"iterate over a snapshot of a list while the underlying list may change"* — safely, and without allocating a new array every frame.

Because it's a `struct` backed by a plain array, it plays nicely with Unity serialization, the Job System and Burst-friendly code, unlike a `List<T>`.

## Usage
Create a buffer with a base capacity, then copy a list into it whenever you need a stable snapshot to iterate:

```csharp
using Helteix.Tools;
using System.Collections.Generic;

public class Spawner : MonoBehaviour
{
    private DynamicBuffer<Enemy> buffer = new DynamicBuffer<Enemy>(16);
    private List<Enemy> enemies = new List<Enemy>();

    private void Update()
    {
        // take a snapshot of the current enemies
        buffer.CopyFrom(enemies);

        // iterate the snapshot — safe even if 'enemies' is modified during the loop
        for (int i = 0; i < buffer.Length; i++)
        {
            Enemy enemy = buffer[i];
            enemy.Tick(); // may add/remove from 'enemies' without breaking iteration
        }
    }
}
```

## Members

| Member | Description |
| --- | --- |
| `DynamicBuffer(int baseCapacity)` | Creates a buffer with an initial backing array size. |
| `int Length` | The number of valid elements copied in (not the backing capacity). |
| `T this[int i]` | Reads the element at index `i`. |
| `CopyFrom(List<T> list)` | Copies a list's contents into the buffer, growing the backing array (to the next power of two) if needed. |
| `Clear()` | Resets the backing array to default values. |
| implicit `T[]` | Implicitly converts to the underlying array. |

:::info
`CopyFrom` reuses the existing backing array when it's large enough, so repeated calls with similarly-sized lists don't allocate. The array only grows — to the next power of two — when a larger list comes in.
:::
