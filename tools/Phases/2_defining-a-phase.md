---
sidebar_position: 1
title: "Defining a Phase"
---

## Two base classes
You define a phase by inheriting from one of two base classes:

- **`Phase`** — a phase that produces **no** result. Implement `ExecuteNoResult`.
- **`Phase<TResult>`** — a phase that returns a **value** when it completes. Implement `Execute`.

```csharp
using System.Threading;
using Helteix.Tools.Phases;
using UnityEngine;

// No result
public class IntroCutscenePhase : Phase
{
    protected override async Awaitable ExecuteNoResult(CancellationToken token)
    {
        await PlayTimeline(token);
    }
}

// Returns a value
public class DrawPhase : Phase<int>
{
    private readonly int amount;
    public DrawPhase(int amount) => this.amount = amount;

    protected override async Awaitable<int> Execute(CancellationToken token)
    {
        int drawn = await DealCards(amount, token);
        return drawn; // becomes the phase's result value
    }
}
```

:::tip
Give your phase a constructor to pass in the data it needs (`amount` above). A phase is a normal object — create a new one each time you want to run that step.
:::

## The cancellation token
`Execute` receives a `CancellationToken`. **Thread it through every async call** and honour it, so the phase can be stopped cleanly:

```csharp
protected override async Awaitable<int> Execute(CancellationToken token)
{
    for (int i = 0; i < amount; i++)
    {
        token.ThrowIfCancellationRequested();     // bail out if cancelled
        await DrawOneCard(token);
    }
    return amount;
}
```

If the token is triggered, the phase ends with a `Cancel` result. If your `Execute` throws any other exception, it is caught, logged, and the phase ends with a `Failure` result — it will not crash the caller.

## Setup and teardown hooks
Override these to run code around `Execute`. They matter because of **when** they fire relative to listeners:

| Hook | Runs | Use it for |
| --- | --- | --- |
| `protected virtual Awaitable Initialize(CancellationToken)` | **before** every listener's `OnPhaseBegin` | Prepare state the listeners will rely on. |
| `protected virtual Awaitable Dispose(CancellationToken)` | **after** every listener's `OnPhaseEnd` | Clean up once everyone is done reacting. |

```csharp
public class BattlePhase : Phase
{
    protected override async Awaitable Initialize(CancellationToken token)
    {
        await base.Initialize(token);   // returns to the main thread
        battlefield.Spawn();
    }

    protected override async Awaitable ExecuteNoResult(CancellationToken token)
    {
        await RunBattle(token);
    }

    protected override async Awaitable Dispose(CancellationToken token)
    {
        battlefield.Clear();
        await base.Dispose(token);
    }
}
```

## Events
A phase exposes plain C# events, handy when you hold a reference to a specific phase instance:

| Event | Fires when |
| --- | --- |
| `event Action OnInitialized` | The phase has initialized. |
| `event Action<TResult> OnCompleted` | `Execute` completed successfully (carries the value). |
| `event Action OnDisposed` | The phase has been disposed. |

## Status and self-control
From inside the phase you can inspect and steer it:

| Member | Description |
| --- | --- |
| `PhaseStatus CurrentStatus` | `None`, `Running`, `Completed`, `Failed`, or `Canceled`. |
| `protected bool IsRunning()` | Whether this phase is currently running. |
| `protected void Cancel()` | Requests cancellation of this phase. |

## Phases driven by an external event
Sometimes a phase shouldn't finish until *something outside* happens — a player presses a button, a network message arrives, an animation event fires. For those, inherit from **`PhaseCompletionSource<TValue>`** instead of implementing `Execute`: the phase stays running until you call `SetResult(value)`.

```csharp
using Helteix.Tools.Phases;

public class WaitForConfirmPhase : PhaseCompletionSource<bool>
{
    private void Awake() => confirmButton.onClick.AddListener(() => SetResult(true));
    private void OnCancelPressed() => SetResult(false);
}
```

`SetResult` completes the phase with a `Success`; the internal `SetCanceled()` ends it as `Cancel`. Like everything else here, call these from the **main thread** (a stray background-thread call is marshalled back to the main thread before completing).

:::info
`PhaseCompletionSource<TValue>` is the bridge between the phase system and event-driven code — use it whenever *"the step is done when X happens"* rather than *"the step runs this code"*.
:::
