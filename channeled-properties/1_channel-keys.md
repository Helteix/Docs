---
sidebar_position: 1
title: "Channel Keys"
---

## Introduction
A `ChannelKey` uniquely identifies a channel inside a channeled property. It is the handle a writer keeps in order to update or remove **its own** contribution later, without affecting anyone else's.

## Creating a key
The simplest way is to generate a fresh unique key:

```csharp
ChannelKey key = ChannelKey.GetUniqueChannelKey();
```

You can attach a **tag** (useful for debugging) or a **source object**:

```csharp
ChannelKey key = ChannelKey.GetUniqueChannelKey("PauseMenu");
ChannelKey key = ChannelKey.GetUniqueChannelKey(this); // tagged with the type name, source = this
```

## Using a Unity Object as a key
Any Unity `Object` implicitly converts to a `ChannelKey`. This is the most convenient pattern: a component can simply pass itself wherever a key is expected.

```csharp
public class SlowMotion : MonoBehaviour
{
    private void Enable(Priority<float> timeScale)
    {
        // 'this' is implicitly converted to a ChannelKey
        timeScale.AddPriority(this, PriorityTags.High, 0.2f);
    }

    private void Disable(Priority<float> timeScale)
    {
        timeScale.RemovePriority(this);
    }
}
```

The first time an object is used as a key, a unique key is created and cached for it, so the **same object always maps to the same channel**. This is what makes the "use `this` as a key" pattern reliable.

:::info
The `Object → ChannelKey` cache is initialized before the first scene loads and is automatically cleaned when scenes load or unload, so destroyed objects don't leak their keys.
:::

## Key members

| Member | Description |
| --- | --- |
| `Guid Guid` | The unique identifier behind the key. |
| `Object Source` | The Unity object this key was derived from, if any. |
| `string PointerTag` | An optional tag, set when the key was created. |

:::tip
Store the key you get back from `GetUniqueChannelKey()` if the writer isn't a Unity object. If the writer *is* a component, you usually don't need to store anything — just pass `this` each time.
:::
