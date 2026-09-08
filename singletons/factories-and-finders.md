---
sidebar_position: 4
title: "Factories & Finders"
---

:::info[Advanced]
This is an advanced topic. You don't need it for everyday use — the defaults just work. Reach for it when you need to control **how** a singleton is created, or **where** the system looks for an existing one.
:::

## Two responsibilities
Every Helteix singleton (classic, [Mono](./2_mono-singleton.md) and [Scene](./3_scene-services.md)) is built on two small interfaces:

| Interface | Method | Responsibility |
| --- | --- | --- |
| `ISingletonFactory<T>` | `T CreateSingleton()` | **How** a new instance is created. |
| `ISingletonFinder<T>` | `bool TryFindExistingInstance(out T instance)` | **Whether** an instance already exists somewhere, and how to get it. |

## How they work together
When you access `Instance` for the first time:

1. The singleton asks its **finder**: *does an instance already exist?* (`TryFindExistingInstance`).
2. If the finder returns one, it is **adopted** as the singleton — nothing is created.
3. If not, the **factory** is asked to **create** a fresh instance (`CreateSingleton`).

So the **finder** decides *"is there already one out there?"* and the **factory** decides *"if not, how do I make one?"*.

## The defaults
Each singleton pattern ships with sensible defaults:

| Pattern | Default factory | Default finder |
| --- | --- | --- |
| `Singleton<T>` (classic) | `new T()` | Never finds one — every first access creates a new instance. |
| `MonoSingleton<T>` | Creates a `GameObject` (or instantiates a registered prefab) and adds the component | `FindFirstObjectByType<T>()` — adopts an existing one in the loaded scenes. |

## Plugging in your own
You supply custom implementations through the extended generic signatures. `TFactory` and `TFinder` must have a public parameterless constructor (`new()`).

```csharp
// Classic singleton
public class GameManager : Singleton<GameManager, MyFactory> { }
public class GameManager : Singleton<GameManager, MyFactory, MyFinder> { }

// Mono singleton
public class AudioManager : MonoSingleton<AudioManager, MyFactory, MyFinder> { }
```

## Custom factory — control creation
Use a factory when *"just create one"* isn't enough: pre-configuring the instance, injecting dependencies, pooling, instantiating a specific prefab, or picking a platform-specific implementation.

```csharp
using Helteix.Singletons.Interfaces;

public class GameManagerFactory : ISingletonFactory<GameManager>
{
    public GameManager CreateSingleton()
    {
        var manager = new GameManager();
        manager.Configure(loadedFromDisk: SaveSystem.LoadConfig());
        return manager;
    }
}

public class GameManager : Singleton<GameManager, GameManagerFactory>
{
    public void Configure(Config loadedFromDisk) { /* ... */ }
}
```

## Custom finder — control lookup
Use a finder when an instance may **already exist somewhere the default doesn't look**. The default classic finder never finds anything, and the default Mono finder only searches the loaded scenes — a custom finder can look anywhere.

Some scenarios:

- **A registry / service locator** already holds the instance.
- **An existing object** you want to adopt instead of spawning a new one.
- **A networked / online source** — e.g. the instance is owned by the server or another client, and you want to bind to it rather than create a local duplicate.

```csharp
using Helteix.Singletons.Interfaces;

public class OnlineSessionFinder : ISingletonFinder<GameSession>
{
    public bool TryFindExistingInstance(out GameSession instance)
    {
        // Adopt the session the network layer already knows about, if any.
        if (NetworkLayer.TryGetActiveSession(out instance))
            return true;

        instance = default;
        return false; // none found → the factory will create one
    }
}

public class GameSession : Singleton<GameSession, GameSessionFactory, OnlineSessionFinder>
{
    // ...
}
```

When `TryFindExistingInstance` returns `true`, the returned object becomes the singleton and the factory is **not** called.

:::tip
Keep factories and finders small and side-effect-light: the finder should only *look*, and the factory should only *build*. That separation is what keeps the singleton's behaviour predictable across all three patterns.
:::
