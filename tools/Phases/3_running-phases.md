---
sidebar_position: 2
title: "Running Phases"
---

Phases are driven through the static **`PhaseManager`** (via extension methods on your phase). Everything here must be called from the **main thread**.

## Awaiting a phase
The most common form — start the phase and `await` its result:

```csharp
var draw = new DrawPhase(amount: 5);
PhaseResult<int> result = await draw;

if (result.type == PhaseResultType.Success)
    Debug.Log($"Drew {result.value} cards");
```

`await`-ing a phase runs it end to end (Initialize → begin listeners → Execute → end listeners → Dispose) and gives you the `PhaseResult<T>`.

:::warning
Don't `await` the **same phase instance** twice — it throws. A phase instance represents one run of a step; create a new one for a new run. (Use [`WaitAsync`](./6_waiting-utilities.md) if you only want to wait for a phase that is *already* running.)
:::

## Fire and forget
When you don't need to await the result:

```csharp
new IntroCutscenePhase().RunAndForget();
```

## Explicit run
`Run` returns the `Awaitable<PhaseResult<T>>` if you want to hold onto it:

```csharp
Awaitable<PhaseResult<int>> running = draw.Run();
// ... do other things ...
PhaseResult<int> result = await running;
```

## Reading the result
`PhaseResult<T>` carries both a value and an outcome, and converts implicitly to either:

```csharp
PhaseResult<int> r = await draw;

int value = r;                     // implicit -> T
PhaseResultType outcome = r;       // implicit -> PhaseResultType

switch (r.type)
{
    case PhaseResultType.Success: /* r.value is valid */ break;
    case PhaseResultType.Cancel:  /* was cancelled     */ break;
    case PhaseResultType.Failure: /* Execute threw      */ break;
}
```

## Cancelling
Any running phase can be cancelled; it will end with a `Cancel` result and still run its end-listeners and `Dispose`:

```csharp
if (draw.IsRunning())
    draw.Cancel();
```

## Inspecting what's running
```csharp
bool running = draw.IsRunning();

// Every running phase of a given type (or base type)
foreach (BattlePhase battle in PhaseManager.GetAll<BattlePhase>())
    battle.Cancel();
```

## Method summary

| Call | Description |
| --- | --- |
| `await phase` | Runs the phase and returns its `PhaseResult<T>`. |
| `phase.Run()` | Runs it and returns the awaitable result. |
| `phase.RunAndForget()` | Runs it without awaiting. |
| `phase.WaitAsync(token)` | Awaits a phase that is **already running** (see [Waiting utilities](./6_waiting-utilities.md)). |
| `phase.Cancel()` | Requests cancellation. |
| `phase.IsRunning()` | Whether it is currently running. |
| `PhaseManager.GetAll<T>()` | All running phases assignable to `T`. |

:::info[Failures never bubble up]
If `Execute` throws, the manager logs the exception and returns a `Failure` result — the `await` completes normally with `type == Failure`. This keeps one broken step from tearing down the systems that started it.
:::
