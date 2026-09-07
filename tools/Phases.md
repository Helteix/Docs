---
sidebar_position: 5
title: "Phases"
---

## Introduction
**Phases** is an `async`-based system for modeling *steps* in your game — a turn, a round, a loading sequence, an intro cutscene, an attack resolution. A phase runs asynchronously, produces a result, can be cancelled, and lets **any number of listeners** react to it beginning and ending, all without the phase and its listeners knowing about each other.

It builds on Unity's `Awaitable` API, so phases integrate naturally with `async`/`await` and run on the main thread.

:::info
All `PhaseManager` methods must be called from the Unity **main thread**, matching Unity's `Awaitable` model.
:::

## Defining a phase
Inherit from `Phase` (no result) or `Phase<TResult>` (returns a value) and implement the execution body.

```csharp
using System.Threading;
using Helteix.Tools.Phases;
using UnityEngine;

// A phase that returns nothing
public class IntroPhase : Phase
{
    protected override async Awaitable ExecuteNoResult(CancellationToken token)
    {
        await PlayCutscene(token);
    }
}

// A phase that returns a value
public class DrawPhase : Phase<int>
{
    protected override async Awaitable<int> Execute(CancellationToken token)
    {
        int drawn = await DealCards(token);
        return drawn;
    }
}
```

You can also override `Initialize` (runs **before** listeners' begin callbacks) and `Dispose` (runs **after** listeners' end callbacks) for setup and teardown.

## Running a phase
Phases are driven through `PhaseManager` extension methods:

```csharp
var draw = new DrawPhase();

// await the result directly
PhaseResult<int> result = await draw;

// fire-and-forget
draw.RunAndForget();

// run and get a callback when done
draw.Run(); // returns an Awaitable<PhaseResult<int>>
```

### Phase results
A `PhaseResult<T>` carries both a `value` and a `PhaseResultType` (`Success`, `Cancel`, or `Failure`). It implicitly converts to either, so you can write:

```csharp
PhaseResult<int> result = await draw;
if (result.type == PhaseResultType.Success)
    Debug.Log($"Drew {result.value} cards");
```

## Cancelling and querying
```csharp
if (draw.IsRunning())
    draw.Cancel();          // requests cancellation via the phase's token

var allRunningDraws = PhaseManager.GetAll<DrawPhase>();
```

A cancelled phase surfaces as a `Cancel` result; an exception thrown inside `Execute` is logged and surfaces as a `Failure`. The phase's `CurrentStatus` moves through `None → Running → Completed / Canceled / Failed`.

## Listening to phases
The real power is that **other systems can react** to any phase type without the phase knowing. Register listeners with `PhaseManager`.

### Callback listeners
```csharp
PhaseManager.Register<DrawPhase>(
    beginCallback: phase => Debug.Log("Draw started"),
    endCallback:   phase => Debug.Log("Draw ended"));
```

### MonoBehaviour listeners
Inherit from `MonoPhaseListener<T>` to react from a component. It auto-registers on `OnEnable` and unregisters on `OnDisable`, and exposes `UnityEvent`s you can wire in the inspector.

```csharp
using Helteix.Tools.Phases.Listeners;

public class DrawUiListener : MonoPhaseListener<DrawPhase>
{
    protected override void OnPhaseBegin(DrawPhase phase) => ShowDrawAnimation();
    protected override void OnPhaseEnd(DrawPhase phase)   => HideDrawAnimation();
}
```

Listeners registered for a **base** phase type also receive derived phases, and an optional `executionOrder` controls the order in which listeners run. A listener can also override `Accepts(phase)` to filter at runtime.

## Waiting for a running phase
If a phase is already running and you just want to await its completion elsewhere, use `WaitAsync`:

```csharp
PhaseResult<int> result = await draw.WaitAsync();
```

## Single phases
Implement `ISinglePhase` to constrain how many instances of a phase can run at once on a named **channel**:

| Property | Meaning |
| --- | --- |
| `string Channel` | The channel this phase belongs to. |
| `bool AllowMultipleInstances` | If `false`, a new instance waits for the current one on the channel. |
| `bool AllowQueuing` | If `false`, starting while one already runs on the channel fails instead of queuing. |

This is handy to guarantee, for example, that only one "turn" phase is ever active per player.
