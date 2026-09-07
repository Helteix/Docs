---
sidebar_position: 2
title: "Ports & Values"
---

## Introduction
Ports are the typed connection points of a node. There are two kinds: `OutputPort` (produces a value) and `InputPort` (consumes values from the outputs it's connected to). This page covers how values flow and how to work with ports directly from code.

## Adding ports programmatically
Besides the attribute-based approach, you can add ports at runtime with extension methods. This is handy for nodes whose ports depend on data known only at runtime.

```csharp
using Helteix.Graphs;
using Helteix.Graphs.Ports;

// An output that returns a computed value
node.AddOutput(new PortCreationInfos { name = "Health" }, () => currentHealth);

// An input that averages/combines the values coming in
node.AddInput<float>(new PortCreationInfos { name = "Damage" });
```

`PortCreationInfos` carries the port's `name`, an optional `description`, and an optional custom behaviour.

## Reading a value
Both port types expose `GetValue<T>()`:

```csharp
float value = outputPort.GetValue<float>();
float incoming = inputPort.GetValue<float>();
```

An `OutputPort` returns the value its source produces. An `InputPort` gathers the values from **every connected output** and combines them through its **input strategy**.

:::warning
A port can only return a value once it is **initialized** (i.e. its node belongs to a graph that has been initialized). Reading before that logs an error and returns `default`.
:::

## Input strategies
When several outputs feed a single input, the input needs to know how to combine them. That's the role of `IInputStrategy<T>`.

If you don't provide one, a **default** strategy is used:

- for numeric types (`float`, `double`, `int`, `long`, `decimal`): the **average** of the connected values;
- for any other type: the **first** connected value.

To customize the combination, pass a delegate:

```csharp
// Sum all incoming float values instead of averaging them
node.AddInput<float>(
    new PortCreationInfos { name = "TotalDamage" },
    values => values.Sum());
```

## Connecting and disconnecting
Ports are connected through edges. The `Connect` extension handles direction and validation for you:

```csharp
Edge edge = outputPort.Connect(inputPort);

outputPort.Disconnect(inputPort);
port.DisconnectAll();
```

A connection is only created if it is valid — the system checks that:

- the two ports have **opposite directions** (an output to an input),
- they are **type-compatible** (the input type is assignable from the output type),
- neither is already connected in a way that its **connectivity** forbids,
- the edge doesn't already exist.

### Connectivity
Each port has a `PortConnectivity`:

| Value | Meaning |
| --- | --- |
| `One` | The port accepts a single connection. |
| `Multiple` | The port accepts any number of connections. |

## Querying connections
Useful extension methods on a `Port`:

| Method | Description |
| --- | --- |
| `bool IsConnected()` | Whether the port has at least one edge. |
| `IEnumerable<Edge> GetConnectedEdges()` | All edges touching the port. |
| `IEnumerable<Port> GetConnectedPorts()` | The ports on the other side of those edges. |
| `IEnumerable<Node> GetConnectedNodes()` | The distinct nodes connected to this port. |
| `bool CanAddConnection()` | Whether another connection is allowed given its connectivity. |

And on the graph itself: `graph.CanConnect(a, b)`, `graph.HasEdgeBetween(a, b)`, `graph.TryGetEdgeBetween(a, b, out edge)`.
