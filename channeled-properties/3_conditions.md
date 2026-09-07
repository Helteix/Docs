---
sidebar_position: 3
title: "Conditions"
---

## Introduction
A `Condition` is a boolean channeled property whose value is `true` only when **all** of its channels are `true`. In other words, it's a distributed logical **AND**: many independent systems can each veto the result, and none of them needs to know about the others.

Typical uses: *"Can the player move?"*, *"Is the door openable?"*, *"Should the tutorial be shown?"* — where any number of systems may independently block the condition.

```csharp
using Helteix.ChanneledProperties.Conditions;

// defaultValue is returned when there are no channels at all
Condition canMove = new Condition(defaultValue: true);
canMove.AddOnValueChangeCallback(v => playerController.enabled = v, callImmediate: true);
```

## Adding and writing channels
Each system adds its own channel. As long as one channel is `false`, the whole condition is `false`.

```csharp
canMove.AddCondition(cutsceneSystem, value: true);
canMove.AddCondition(dialogueSystem, value: true);

// A cutscene starts → it blocks movement
canMove.Write(cutsceneSystem, false); // canMove is now false

// Cutscene ends → it stops blocking
canMove.Write(cutsceneSystem, true);  // canMove is true again (if nothing else blocks)
```

## Removing channels
When a system no longer has any say, it removes its channel:

```csharp
canMove.RemoveCondition(dialogueSystem);
```

The `OnValueChanged` event only fires when the overall boolean result actually flips.

## Useful members

| Member | Description |
| --- | --- |
| `bool Value` | `true` if every channel is `true` (or the default value when empty). |
| `AddCondition(key, value)` | Adds a channel with an initial boolean value (default `true`). |
| `Write(key, value)` | Updates a channel's value. |
| `RemoveCondition(key)` | Removes a channel. |

## Sample
The **Conditions Demo** wires a group of toggles to a single `Condition`. The result text is `true` only when every toggle is on:

```csharp
public class SampleCPManager : MonoBehaviour
{
    [SerializeField] private Text text;
    [SerializeField] private Condition condition;

    private void Awake()
    {
        Toggle[] toggles = GetComponentsInChildren<Toggle>();
        condition = new Condition();

        foreach (var t in toggles)
        {
            condition.AddCondition(t, t.isOn);              // the toggle itself is the key
            t.onValueChanged.AddListener(v => condition.Write(t, v));
        }

        condition.AddOnValueChangeCallback(v => text.text = v.ToString(), true);
    }
}
```
