---
sidebar_position: 4
title: "Single Phases"
---

## The problem
Some steps must **never overlap**. You don't want two "player turn" phases running at once, or a save phase starting while another save is mid-flight. A **single phase** enforces that, per named **channel**.

## Declaring one
Implement `ISinglePhase` on your phase and give it a channel:

```csharp
using Helteix.Tools.Phases;
using System.Threading;
using UnityEngine;

public class TurnPhase : Phase, ISinglePhase
{
    public string Channel => "turn";

    protected override async Awaitable ExecuteNoResult(CancellationToken token)
    {
        await ResolveTurn(token);
    }
}
```

Every phase that shares a `Channel` string is coordinated together. Use different channels for independent concerns (e.g. `"turn"`, `"save"`, `"cutscene"`).

## Two knobs
`ISinglePhase` has two properties with sensible defaults:

| Property | Default | Effect |
| --- | --- | --- |
| `bool AllowMultipleInstances` | `false` | When `false`, starting a phase while another runs on the same channel makes the new one **wait its turn** (it queues). |
| `bool AllowQueuing` | `true` | When `false`, starting a phase while one is already running on the channel **fails immediately** instead of queuing. |

### Wait for its turn (default)
With the defaults, phases on a channel run **one after another**. Fire several and they queue up:

```csharp
new TurnPhase().RunAndForget(); // runs now
new TurnPhase().RunAndForget(); // waits for the first to finish, then runs
```

### Reject overlap instead of queuing
Set `AllowQueuing => false` to make a phase **refuse to start** if the channel is busy — useful for actions that shouldn't stack up, like a save:

```csharp
public class SavePhase : Phase, ISinglePhase
{
    public string Channel => "save";
    public bool AllowQueuing => false; // a second save while one runs just fails

    protected override async Awaitable ExecuteNoResult(CancellationToken token)
    {
        await WriteSaveFile(token);
    }
}
```

```csharp
var result = await new SavePhase();
if (result.type == PhaseResultType.Failure)
    Debug.Log("A save is already in progress — ignored.");
```

:::info
The channel bookkeeping is automatic: when the running phase on a channel ends, the next queued one is released. You only declare the intent (`Channel`, `AllowQueuing`, `AllowMultipleInstances`) — the system handles the ordering.
:::

:::tip
Reach for single phases whenever "only one of these at a time" is a rule of your game. It replaces the usual `bool isBusy` guards with something that also queues correctly.
:::
