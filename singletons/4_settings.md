---
sidebar_position: 5
title: "Settings"
---

## Introduction
The Singletons package ships with a `SingletonSettings` asset built on top of the **GameSettings** system from `com.helteix.tools`. It is auto-generated (thanks to `[AutoGenerateGameSettings]`) and appears under the *Helteix* section of the project settings.

It centralizes two things: how Scene Services resolve their `Instance`, and which prefabs to use when a Mono Singleton or Scene Service needs to be created.

## Settings reference

| Setting | Description |
| --- | --- |
| **Window Refresh Rate** | How many times per second the Singletons editor window refreshes (1–20). |
| **Service Instance Behaviour** | How `SceneService<T>.Instance` picks a service: *Pick Active Scene Instance* or *Pick First Instance*. |
| **Prefab References** | The list of prefab mappings used to create Mono Singletons and Scene Services from prefabs. |

## Service Instance Behaviour
This drives the `SceneService<T>.Instance` shortcut:

- **Pick First Instance** *(default)* — returns the first registered service, whatever scene it lives in.
- **Pick Active Scene Instance** — returns the service that belongs to the currently active scene.

## Prefab references
A **prefab reference** maps a singleton type to a prefab. When the system needs to create an instance of that type and a reference exists, it instantiates the prefab instead of building a bare `GameObject`.

Each reference stores:

- the **singleton type** it applies to,
- a **reference type** — either `Prefab` (a direct prefab asset) or `Resource` (loaded from a `Resources` folder),
- the **asset** itself.

:::info
Prefab references rely on the **Type Mapping** system from Tools, so they keep working even if you rename, move, or change the assembly of your singleton class.
:::

### Registering a prefab from code
You can also register a prefab at runtime, before the singleton is first accessed:

```csharp
SingletonSettings.Current.AddPrefabFor<AudioManager>(myAudioManagerPrefab);
```

After this call, the next `AudioManager.Instance` access will instantiate `myAudioManagerPrefab` rather than creating an empty `GameObject`.

## Singleton viewer window
The package includes an editor window that lists your singletons and their state. Its refresh cadence is controlled by the **Window Refresh Rate** setting above.
