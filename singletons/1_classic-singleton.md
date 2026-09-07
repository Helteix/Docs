---
sidebar_position: 1
title: "Classic Singleton"
---

## Introduction
The **Classic Singleton** is a plain C# singleton that does **not** inherit from `MonoBehaviour`. It is perfect for pure data managers, services, or systems that don't need to live on a `GameObject`.

To create one, inherit from `Singleton<T>` where `T` is your own class. The only constraint is that your type must be a `class` with a public parameterless constructor (`new()`).

```csharp
using Helteix.Singletons;

public class GameManager : Singleton<GameManager>
{
    public int Score { get; set; }

    public void AddPoint() => Score++;
}
```

You can now access the unique instance from anywhere:

```csharp
GameManager.Instance.AddPoint();
Debug.Log(GameManager.Instance.Score);
```

## How it works
The first time you access `Instance`, the singleton looks for an existing instance using its **finder**. If none is found, a fresh instance is created using its **factory**.

:::info
By default, the classic `Singleton<T>` uses a finder that never finds an existing instance, so the very first access always creates a new instance through the factory.
:::

## Useful members

| Member | Description |
| --- | --- |
| `static T Instance` | Returns the current instance, creating one if needed. Returns `null` (with a warning) when called in edit mode. |
| `static bool HasInstance` | `true` if an instance already exists (or can be found by the finder) without forcing its creation. |
| `bool IsInstance` | `true` if *this* object is the active singleton instance. |
| `static void EnsureSingleton()` | Creates the instance ahead of time if none exists. |
| `void Dispose()` | Clears the instance if this object is the active one. `Singleton<T>` implements `IDisposable`. |

:::warning
`Instance` cannot create an instance in **edit mode** — it logs a warning and returns `null`. This is intentional: singletons are runtime constructs.
:::

## Customizing creation and lookup
`Singleton<T>` is built on top of two interfaces, so you can fully control how an instance is created and how an existing one is found.

- `ISingletonFactory<T>` — defines `T CreateSingleton()`.
- `ISingletonFinder<T>` — defines `bool TryFindExistingInstance(out T instance)`.

You can supply your own implementations through the extended generic signatures:

```csharp
// Custom factory only
public class GameManager : Singleton<GameManager, MyFactory> { }

// Custom factory and finder
public class GameManager : Singleton<GameManager, MyFactory, MyFinder> { }
```

For example, a factory that pre-fills some data:

```csharp
public class GameManagerFactory : ISingletonFactory<GameManager>
{
    public GameManager CreateSingleton()
    {
        var manager = new GameManager();
        manager.Score = 100; // starting score
        return manager;
    }
}

public class GameManager : Singleton<GameManager, GameManagerFactory>
{
    public int Score { get; set; }
}
```

:::tip
This factory/finder pattern is the same foundation used by `MonoSingleton` and `SceneService`. Understanding it here makes the other two patterns easier to grasp.
:::
