---
sidebar_position: 1
title: "Creating Nodes"
---

## Introduction
The recommended way to define a node is **declaratively**: write a `partial` class that inherits from `Node`, and describe its data and ports with attributes. A **source generator** takes care of the wiring so you never write port plumbing by hand.

```csharp
using System;
using Helteix.Graphs;
using UnityEngine;

[Serializable]
public partial class SampleNode : Node
{
    [field: NodeProperty, SerializeField]
    public float Float { get; private set; }

    [field: NodeProperty, SerializeField]
    public ScriptableObject ScriptableObject { get; private set; }

    [OutputPort]
    public float GetFloat() => 1f;

    [InputPort]
    public partial float GetInputPartial();

    [InputPort]
    public partial Vector3 GetDirection();
}
```

:::warning
The class **must be `partial`** and marked `[Serializable]`. The source generator emits the other half of the class (the input port method bodies and port registration). Without `partial`, the node won't compile.
:::

## `[NodeProperty]` — serialized data
Put `[NodeProperty]` on a serialized field or auto-property to expose it as editable data on the node. It integrates with Unity's serialization and the graph editor.

```csharp
[field: NodeProperty, SerializeField]
public float Speed { get; private set; }
```

You can rename how the property appears with the optional `nameOverride`:

```csharp
[field: NodeProperty("Movement Speed"), SerializeField]
public float Speed { get; private set; }
```

## `[OutputPort]` — producing a value
Mark a **regular method** that returns a value with `[OutputPort]`. The method body *is* the output: whatever it returns is what flows out of the port.

```csharp
[OutputPort]
public float GetFloat() => 1f;

[OutputPort(name: "Result", description: "The computed result")]
public Vector3 GetResult() => transformResult;
```

## `[InputPort]` — consuming a value
Mark a **`partial` method** with `[InputPort]`. You declare its signature; the source generator fills in the body so that calling it pulls the value(s) from whatever is connected to the port.

```csharp
[InputPort]
public partial float GetInputPartial();

[InputPort(defaultValue: Vector3.zero, name: "Direction")]
public partial Vector3 GetDirection();
```

Inside your node logic you simply call the method to read the current input value:

```csharp
protected override void Initialize(GraphContext context)
{
    float incoming = GetInputPartial();   // reads the connected output(s)
    Vector3 dir = GetDirection();
}
```

The `[InputPort]` attribute accepts an optional `defaultValue`, `name`, and `description`.

## Node lifecycle
`Node` gives you two hooks you can override:

| Method | When it runs |
| --- | --- |
| `protected virtual void Initialize(GraphContext context)` | When the node joins an initialized graph (or when the graph is initialized). |
| `protected virtual void Release(GraphContext context)` | When the node is removed, or the graph is disposed. |

The node also exposes `ID` (a `GraphGuid`), its `Graph`, and its `Ports`, plus helpers like `HasPort(name)` and `TryGetPort(name, out port)`.
