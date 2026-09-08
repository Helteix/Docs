---
sidebar_position: 5
title: "Waiting Utilities"
---

Beyond running a phase yourself, you often need to **wait for a phase you don't own** — one another system started. These helpers (extension methods in `Helteix.Tools.Phases.Utilities`) cover that.

## Wait for a specific phase to end
`WaitFor` suspends until the given phase finishes (whoever started it):

```csharp
using Helteix.Tools.Phases.Utilities;

await currentTurn.WaitFor();
// runs after 'currentTurn' has ended
```

## Wait for any phase of a type
`WaitForAny<T>()` resumes as soon as **any** phase of type `T` ends:

```csharp
await PhaseUtilities.WaitForAny<TurnPhase>();
// resumes when the next TurnPhase (any instance) ends
```

## Wait for a result
`WaitForResult` waits for a `Phase<TResult>` to finish and hands you its value:

```csharp
int drawn = await someDrawPhase.WaitForResult();
```

## Wait for a running phase via the manager
If you started a phase and want to await its outcome elsewhere, `WaitAsync` returns its `PhaseResult<T>` (and throws if the phase isn't actually running):

```csharp
PhaseResult<int> result = await draw.WaitAsync();
```

## General Awaitable helpers
The `Awaitables` static class adds a few conveniences on top of Unity's `Awaitable`, useful inside phase bodies:

```csharp
using Helteix.Tools;

// Resume when the first of several awaitables completes
await Awaitables.WhenAny(loadA, loadB);

// Resume when all complete
await Awaitables.WhenAll(loadA, loadB, loadC);

// Poll a condition, resuming once it's true
await Awaitables.WaitUntil(() => player.IsGrounded);
```

### Fire-and-forget with error handling
When you start an `Awaitable` without awaiting it, exceptions thrown after the first `await` are normally swallowed. `ListenForExceptions` catches and logs them (or routes them to your handler):

```csharp
DoSomethingAsync().ListenForExceptions();
DoSomethingAsync().ListenForExceptions(e => Report(e));
```

:::tip
Prefer `WaitFor` / `WaitForAny` over polling a `bool`. They hook the phase's real end event, so you resume exactly when the step is done — no missed frames, no race conditions.
:::
