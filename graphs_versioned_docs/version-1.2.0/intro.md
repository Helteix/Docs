---
sidebar_position: 0
---

# Installation & Concepts

## Installation
`com.helteix.graphs` is a free package. Install it from the Unity Asset Store or from the [Helteix GitHub page](https://github.com/Helteix).

:::info[Dependency]
Graphs depends on **`com.helteix.tools`**, which is resolved automatically through the Package Manager.
:::

## What is a graph?
A **graph** is a set of **nodes** connected by **edges**. Each node exposes **ports**: outputs that produce values and inputs that consume them. Connecting an output to a compatible input creates an edge, and values flow along those edges.

| Concept | Type | Role |
| --- | --- | --- |
| Node | `Node` | A unit of the graph. Holds properties and ports. |
| Port | `Port` (`InputPort` / `OutputPort`) | A typed connection point on a node. |
| Edge | `Edge` | A connection between an output port and an input port. |
| Graph | `Graph<TNode>` | The container of nodes and edges. |

## Two ways to build a graph
You can author graphs at two levels:

- **Declaratively**, by writing node classes with attributes (`[NodeProperty]`, `[OutputPort]`, `[InputPort]`). A **source generator** produces the boilerplate, and the nodes can be edited visually in the editor. See [Creating nodes](./1_creating-nodes.md).
- **Programmatically**, by adding ports and connecting them at runtime through extension methods (`AddOutput`, `AddInput`, `Connect`). See [Ports & values](./2_ports-and-values.md).

## Typing and compatibility
Ports are strongly typed. An output of type `T` can only connect to an input whose type is assignable from `T`. The system checks direction (an input only connects to an output), duplicates, and connectivity before allowing an edge.

## Runtime vs. asset
A graph lives as a plain C# object at runtime (`Graph<TNode>`), but you can serialize one as a `ScriptableObject` using `GraphRuntimeAsset<TGraph, TNode>` and rebuild it on demand. See [Graphs & assets](./3_graphs-and-assets.md).
