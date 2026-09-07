---
sidebar_position: 4
title: "Editor & Settings"
---

## Visual editing
Graphs can be edited visually in the Unity Editor. A node's `[NodeProperty]` fields appear as editable inputs, its `[OutputPort]` and `[InputPort]` methods appear as ports, and you connect them by dragging edges between compatible ports. The graph you build is serialized into your [`GraphRuntimeAsset`](./3_graphs-and-assets.md) and rebuilt at runtime with `Build()`.

## Project scanning & code generation
The declarative node workflow relies on generated code. The package scans your project's node and graph scripts and generates the supporting assets/classes.

## Settings
Graph settings live under **Project Settings → Helteix → Graphs**.

| Setting | Description |
| --- | --- |
| **Editor Scripts Generation Path** | The folder where generated graph editor scripts and assets are written. Defaults to `Assets/Settings`. |

:::tip
Point the generation path at a dedicated folder (for example `Assets/Settings/Generated Graph`) so generated files stay isolated from your own scripts and are easy to exclude from source control if you wish.
:::
