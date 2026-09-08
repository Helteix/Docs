---
sidebar_position: 3
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
How a singleton is created (its **factory**) and how an existing one is found (its **finder**) are both fully customizable through the extended generic signatures:

```csharp
public class GameManager : Singleton<GameManager, MyFactory> { }            // custom factory
public class GameManager : Singleton<GameManager, MyFactory, MyFinder> { }  // custom factory + finder
```

This is an advanced mechanism shared by **every** singleton pattern (classic, Mono and Scene). See [Factories & Finders](./factories-and-finders.md) for the full explanation and examples.
