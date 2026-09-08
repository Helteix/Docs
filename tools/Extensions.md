---
sidebar_position: 7
title: "Extensions"
---

## Introduction
Tools ships a set of extension methods on common Unity types. Most are simple quality-of-life shortcuts, but a few solve a real pain point: **behaving correctly both at runtime and inside the editor** (edit mode, custom tooling, `EditorWindow`s). They live in the `Helteix.Tools` namespace.

## `InstantiatePrefab` — instantiate that works in the editor
Unity's `Object.Instantiate` at edit time produces a **disconnected copy**: the new object loses its link to the source prefab, so later edits to the prefab don't propagate. That's fine at runtime but wrong for editor tooling. `InstantiatePrefab<T>` fixes this:

```csharp
using Helteix.Tools;

// Works the same call site in play mode and in the editor
var instance = myPrefab.InstantiatePrefab(parent);
```

- **At runtime** (or in a build): it's a plain `Object.Instantiate` — fast, no editor code.
- **In the editor, in edit mode**: when `obj` is the **root of a prefab** (a prefab asset root, or a scene prefab-instance root), it uses `PrefabUtility.InstantiatePrefab`, so the new instance **keeps its prefab connection** and reflects later edits to the source. For a nested object or a plain scene object, it falls back to a plain copy of exactly that object.

It's generic over `Object`, so it works whether you pass a `GameObject` or a `Component` — when you pass a component, you get the matching component on the new instance back.

```csharp
// From an editor tool: spawn a configured prefab that stays linked to its source
MySpawner spawner = spawnerPrefab.InstantiatePrefab(root);
```

:::info[Why it matters]
This lets the **same code path** build prefab instances in your runtime systems *and* in your editor tools (level generators, preview scenes, setup wizards) without branching on `Application.isPlaying` yourself.
:::

## `Destroy` — destruction that works in the editor
Calling `Object.Destroy` in edit mode does nothing useful, and `DestroyImmediate` is unsafe to call at the wrong time (e.g. during serialization or `OnValidate`). `Destroy<T>` handles both:

```csharp
someObject.Destroy();
```

- **At runtime**: plain `Object.Destroy`.
- **In edit mode**: the object is queued and destroyed on the next editor update (safely, via `DestroyImmediate`), and sub-assets are skipped.

Related shortcut:

```csharp
myComponent.DestroyGameObject(); // destroys the component's whole GameObject (editor-safe)
```

## `ClearChildren` — empty a Transform
Destroys all children of a `Transform`, in edit mode or at runtime, and returns how many were removed:

```csharp
int removed = container.ClearChildren();

// keep some children, don't detach first
container.ClearChildren(detachChildren: false, keepThis, andThis);
```

| Parameter | Description |
| --- | --- |
| `detachChildren` (default `true`) | Detach each child before destroying it (avoids stale references during layout). |
| `ignore` (params) | Transforms to keep. |

## GameObject shortcuts
```csharp
gameObject.Activate();     // SetActive(true)
gameObject.Deactivate();   // SetActive(false)
```

## Rendering layer masks
Convenience helpers on `Renderer` for working with `RenderingLayerMask` (URP/HDRP rendering layers), by mask or by layer index:

```csharp
using Helteix.Tools;

renderer.EnableRenderingLayer(mask);        // or an int layerIndex
renderer.DisableRenderingLayer(2);
renderer.ToggleRenderingLayer(mask);

if (renderer.HasRenderingLayer(2)) { /* ... */ }

renderer.SetRenderingLayers(0, 2, 5);       // set the mask to exactly these layers
```

| Method | Description |
| --- | --- |
| `EnableRenderingLayer(mask / index)` | Adds a rendering layer. |
| `DisableRenderingLayer(mask / index)` | Removes a rendering layer. |
| `ToggleRenderingLayer(mask / index)` | Flips a rendering layer. |
| `HasRenderingLayer(mask / index)` | Whether the layer is set. |
| `SetRenderingLayers(params int[])` | Replaces the mask with exactly the given layers. |
