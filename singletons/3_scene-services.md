---
sidebar_position: 2
title: "Scene Services"
---

## Introduction
Sometimes you don't want a global singleton — you want **one unique instance per scene**, or simply to access an object that already lives in a loaded scene. That's what a **Scene Service** is for.

A `SceneService` is **never** moved to `DontDestroyOnLoad` — it belongs to its scene and lives and dies with it. This makes it ideal for additive scene setups where each scene has its own manager, camera rig, spawn system, etc.

Inherit from `SceneService<T>`:

```csharp
using Helteix.Singletons.SceneServices;
using UnityEngine;

public class LevelService : SceneService<LevelService>
{
    public Transform spawnPoint;
}
```

## Accessing a service
A service registers itself automatically when enabled and unregisters when disabled. You can then look it up in several ways.

```csharp
// For a specific scene
LevelService service = SceneService<LevelService>.GetFor(myScene);

// For the scene a GameObject or Component belongs to
LevelService service = SceneService<LevelService>.GetFor(gameObject);
LevelService service = SceneService<LevelService>.GetFor(this);

// For the active scene
LevelService service = SceneService<LevelService>.GetForActiveScene();

// The first registered service, regardless of scene
LevelService service = SceneService<LevelService>.GetFirst();
```

Every `GetX` method has a safe `TryGetX(out T service)` counterpart that returns a `bool`:

```csharp
if (SceneService<LevelService>.TryGetForActiveScene(out var service))
    Instantiate(player, service.spawnPoint.position, Quaternion.identity);
```

### Extension methods
For convenience, extension methods let you query a service directly from a `Scene`, `GameObject` or `Component`:

```csharp
LevelService service = gameObject.GetService<LevelService>();

if (myScene.TryGetService<LevelService>(out var s))
    // ...
```

## The `Instance` shortcut
`SceneService<T>.Instance` returns a service according to the **Service Instance Behaviour** configured in the [Singleton settings](./4_settings.md):

- **Pick Active Scene Instance** — returns the service of the currently active scene.
- **Pick First Instance** — returns the first registered service.

```csharp
LevelService service = SceneService<LevelService>.Instance;
```

## Creating a service when missing
If no service exists for a requested scene, the lookup can instantiate one from a **prefab reference** registered in the settings (see [Settings](./4_settings.md)). If no prefab is registered, the lookup returns `null` / `false` instead of creating a bare object.

## Activation hooks
Override these `virtual` methods to react to the service's lifecycle:

| Method | When it runs |
| --- | --- |
| `protected virtual void Activate()` | When the service is registered (on `OnEnable`). |
| `protected virtual void Deactivate()` | When the service is unregistered (on `OnDisable`). |

The registry automatically cleans up destroyed services whenever a scene is loaded or unloaded, so you never keep stale references.

## Sample
The **Scene Services** sample creates several scenes at runtime, each with its own `SampleSceneService` carrying a random color:

```csharp
public class SampleSceneService : SceneService<SampleSceneService>
{
    public static event Action<Color> SetBackgroundColor;
    public Color color;

    private void Awake()
    {
        color = Random.ColorHSV();
        color.a = 1;
    }

    public void Trigger() => SetBackgroundColor?.Invoke(color);
}
```

Each UI button then reads the service of its own scene through the extension method:

```csharp
public void Sync() => image.color = associatedScene.GetService<SampleSceneService>().color;
public void Trigger() => associatedScene.GetService<SampleSceneService>().Trigger();
```
