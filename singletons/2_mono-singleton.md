---
sidebar_position: 2
title: "Mono Singleton"
---

## Introduction
A **MonoSingleton** is a `MonoBehaviour` singleton meant to be **instantiated at runtime**. You never place it in a scene by hand — the system creates the `GameObject` for you the first time it is needed.

Inherit from `MonoSingleton<T>`:

```csharp
using Helteix.Singletons.MonoSingletons;
using UnityEngine;

public class AudioManager : MonoSingleton<AudioManager>
{
    public void Play() => Debug.Log("Playing a sound");
}
```

Access it like any other singleton:

```csharp
AudioManager.Instance.Play();
```

The first access creates a new `GameObject` named `"AudioManager Instance"` and adds the component to it.

:::warning
Do **not** add a `MonoSingleton` to a scene from the editor. If you try, it logs a warning reminding you that Mono Singletons are meant to be created dynamically at runtime. If you need a component that already lives in your scene, use [Scene Services](./3_scene-services.md) instead.
:::

## Lifecycle hooks
Because `Awake`, `OnDestroy` and `Reset` are used internally, you get dedicated `virtual` methods to override instead:

| Method | When it runs |
| --- | --- |
| `protected virtual void OnAwake()` | Called during `Awake`, after the instance is registered. Use it in place of `Awake`. |
| `protected virtual void OnExistingInstanceFound(T existingInstance)` | Called when a second instance wakes up while one already exists. |
| `protected virtual void OnDestroy()` | Override to clean up; call `base.OnDestroy()` to keep the singleton bookkeeping. |

When a duplicate instance is detected on `Awake`, the extra holder is disposed and `OnExistingInstanceFound` is invoked so you can decide what to do (for example, destroy the duplicate `GameObject`).

## Attributes
Two attributes let you control how and when the singleton is created. Put them on your class.

### `[CreateOnLoad]`
Forces the singleton to be created automatically after the first scene has loaded, without you having to access `Instance` first.

```csharp
[CreateOnLoad]
public class AudioManager : MonoSingleton<AudioManager> { }
```

### `[DontDestroyOnLoad]`
Moves the singleton's `GameObject` to the `DontDestroyOnLoad` scene so it survives scene changes.

```csharp
[DontDestroyOnLoad]
public class AudioManager : MonoSingleton<AudioManager> { }
```

Both can be combined to get a persistent manager that exists from the very start of the game:

```csharp
[CreateOnLoad]
[DontDestroyOnLoad]
public class AudioManager : MonoSingleton<AudioManager> { }
```

:::info
Attributes are collected once, right after assemblies are loaded, using `[RuntimeInitializeOnLoadMethod]`. `[CreateOnLoad]` types then get their `EnsureSingleton()` called after the first scene load.
:::

## Creating from a prefab
By default a bare `GameObject` is created. If you want the singleton to come from a prefab (so it can carry references, child objects, or a configured component), register a **prefab reference** in the Singleton settings.

When a prefab is registered for the type, the factory instantiates that prefab instead of creating an empty `GameObject`. See [Settings](./4_settings.md) for how to register prefab references.

## Useful members

| Member | Description |
| --- | --- |
| `static T Instance` | Returns the instance, creating the `GameObject` if needed. Logs an error and returns `null` in edit mode. |
| `static bool HasInstance` | `true` if an instance already exists. |
| `bool IsInstance` | `true` if this component is the active instance. |
| `static void EnsureSingleton()` | Creates the singleton now if it doesn't exist yet. |

## Sample
The **Mono Singletons** sample shows the pattern end to end. A setup component waits for a key press, then accesses the instance for the first time — which triggers its creation:

```csharp
public class SampleMonoSingleton : MonoSingleton<SampleMonoSingleton>
{
    public void Log() => Debug.Log("Logging from the instance");
}

public class SampleMonoSingletonSetup : MonoBehaviour
{
    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            enabled = false;
            SampleMonoSingleton.Instance.Log(); // creates the instance on first access
        }
    }
}
```
