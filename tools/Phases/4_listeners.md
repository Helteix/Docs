---
sidebar_position: 3
title: "Listeners"
---

## Why listeners
The real power of Phases is that **other systems can react to a step without the step knowing about them**. Your `TurnPhase` doesn't reference the UI, the analytics logger, or the audio manager — each of those simply *listens* for turn phases beginning and ending.

A listener is notified at two moments: `OnPhaseBegin` (after the phase's `Initialize`) and `OnPhaseEnd` (before the phase's `Dispose`).

## Callback listeners
The quickest way — register two callbacks for a phase type:

```csharp
using Helteix.Tools.Phases;

PhaseManager.Register<DrawPhase>(
    beginCallback: phase => hud.ShowDrawBanner(),
    endCallback:   phase => hud.HideDrawBanner());
```

Unregister with the same delegates when you're done:

```csharp
PhaseManager.Unregister<DrawPhase>(OnDrawBegin, OnDrawEnd);
```

## Interface listeners
For a stateful listener, implement `IPhaseListener<T>` and register the instance:

```csharp
public class DrawLogger : IPhaseListener<DrawPhase>
{
    public bool Accepts(DrawPhase phase) => true;              // optional runtime filter
    public void OnPhaseBegin(DrawPhase phase) => Log("draw begin");
    public void OnPhaseEnd(DrawPhase phase)   => Log("draw end");
}

var logger = new DrawLogger();
logger.Register();
// ...later...
logger.Unregister();
```

`Accepts` lets a listener **opt out at runtime** for a specific phase instance (return `false` to be skipped for that one).

## MonoBehaviour listeners
`MonoPhaseListener<T>` is the drop-in component version. It **auto-registers on `OnEnable`** and **unregisters on `OnDisable`**, and exposes both `UnityEvent`s (wireable in the inspector) and C# events:

```csharp
using Helteix.Tools.Phases.Listeners;

public class DrawPhaseView : MonoPhaseListener<DrawPhase>
{
    protected override void OnPhaseBegin(DrawPhase phase) => PlayDrawAnimation();
    protected override void OnPhaseEnd(DrawPhase phase)   => StopDrawAnimation();
}
```

| Member | Description |
| --- | --- |
| `OnPhaseBeginUnityEvent` / `OnPhaseEndUnityEvent` | `UnityEvent<T>` shown in the inspector. |
| `event Action<T> OnPhaseBegins` / `OnPhaseEnds` | C# events. |
| `protected virtual void OnPhaseBegin/OnPhaseEnd(T)` | Override in code. |

## Listening to a base type
Listeners registered for a **base** phase type receive **every derived** phase too. This is powerful for cross-cutting concerns:

```csharp
public abstract class GamePhase : Phase { }
public class TurnPhase : GamePhase { }
public class ShopPhase : GamePhase { }

// One logger for *all* game phases, whatever the concrete type:
PhaseManager.Register<GamePhase>(
    p => analytics.Track($"{p.GetType().Name} started"),
    p => analytics.Track($"{p.GetType().Name} ended"));
```

Because `IPhase` is the ultimate base, `PhaseManager.Register<IPhase>(...)` observes **everything**.

## Execution order
Pass an `executionOrder` when registering to control the order listeners run in (lower runs first). It applies to both begin and end callbacks:

```csharp
PhaseManager.Register<DrawPhase>(onBegin, onEnd, executionOrder: -10); // early
PhaseManager.Register<DrawPhase>(onBegin, onEnd, executionOrder: 10);  // late
```

:::tip
Keep listeners cheap and non-blocking — they run synchronously inside the phase's begin/end steps. If a listener needs to do long async work in reaction to a phase, have it start *its own* phase rather than stalling this one.
:::
