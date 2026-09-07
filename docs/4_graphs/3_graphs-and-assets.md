---
sidebar_position: 3
title: "Graphs & Assets"
---

## The graph container
A graph is represented by `Graph<TNode>`, where `TNode` is your node base type. It holds the nodes and edges and manages their lifecycle.

```csharp
using Helteix.Graphs;

public class DialogueGraph : Graph<DialogueNode> { }
```

### Building a graph from code
```csharp
var graph = new DialogueGraph();

var start = new DialogueNode();
var choice = new DialogueNode();

graph.AddNode(start);
graph.AddNode(choice);

// connect ports (see "Ports & Values")
start.TryGetPort("Next", out var outPort);
choice.TryGetPort("In", out var inPort);
outPort.Connect(inPort);

graph.Initialize();
```

### Graph members

| Member | Description |
| --- | --- |
| `AddNode(node)` / `RemoveNode(node)` | Add or remove a node. Removing a node also removes its edges. |
| `AddEdge(edge)` / `RemoveEdge(edge)` | Add or remove an edge directly. |
| `TryGetNode(GraphGuid guid, out node)` | Find a node by its id. |
| `GetNodes()` / `GetEdges()` | Enumerate the graph's contents. |
| `Initialize()` | Initializes every node (calls their `Initialize`). Idempotent. |
| `bool IsInitialized` | Whether the graph has been initialized. |

:::info
Adding a node to an **already-initialized** graph initializes that node immediately. Removing a node from an initialized graph releases it. This keeps the graph consistent whether you build it up front or modify it at runtime.
:::

## Serializing a graph as an asset
To author and store a graph as a Unity asset, inherit from `GraphRuntimeAsset<TGraph, TNode>`. It is a `ScriptableObject` that holds the serialized nodes and edges and can rebuild the runtime graph on demand.

```csharp
using Helteix.Graphs;
using Helteix.Graphs.Edition;
using UnityEngine;

[CreateAssetMenu(menuName = "Dialogue/Graph")]
public class DialogueGraphAsset : GraphRuntimeAsset<DialogueGraph, DialogueNode> { }
```

Rebuild the runtime graph from the asset with a single call:

```csharp
public class DialogueRunner : MonoBehaviour
{
    [SerializeField] private DialogueGraphAsset asset;

    private DialogueGraph graph;

    private void Awake()
    {
        graph = asset.Build();          // builds and initializes the graph
        // graph = asset.Build(initialize: false); // build without initializing yet
    }
}
```

`Build()` instantiates a new `TGraph`, adds every serialized (non-null) node and every valid edge, and — unless you pass `initialize: false` — initializes it.

## Auto-generating the asset class
If you don't want to write the `GraphRuntimeAsset` subclass yourself, mark your graph with `[GenerateGraphAsset]` and the source generator creates the matching asset type for you.

```csharp
using Helteix.Graphs;
using Helteix.Graphs.Edition;

[GenerateGraphAsset]
public class DialogueGraph : Graph<DialogueNode> { }
```
