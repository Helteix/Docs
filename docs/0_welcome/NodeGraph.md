---
sidebar_position: 4
title: "🧩 Node Graph"
---

### 🧩 **Node Graph**

The **Graphs** package lets you build node-based graphs and *flow-graphs* — where every node can represent a value, a state, or a step in a process. Graphs can be authored **visually in the editor** or entirely **from code**.

The design goal is to stay lightweight and fully typed:

1. **Nodes**: Declare a node as a simple `partial` class. Expose serialized data with `[NodeProperty]`, outputs with `[OutputPort]`, and inputs with `[InputPort]`. A source generator wires everything up for you.
2. **Ports & Edges**: Connect a typed output to a compatible input. Input ports pull values from every output they're connected to and combine them through a customizable strategy.
3. **Runtime assets**: Serialize a graph as a `ScriptableObject` and rebuild it at runtime with a single `Build()` call — or construct the whole graph procedurally.

Whether you need a dialogue tree, an ability graph, a skill tree, or a small data-flow network, Graphs gives you the building blocks without imposing a runtime.

**Price: Free**
