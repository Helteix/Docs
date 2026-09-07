---
sidebar_position: 2
title: "Priorities"
---

## Introduction
A `Priority<T>` returns the value of the channel with the **highest priority**. It's the perfect fit for situations where several systems want to impose a value and only one should win at a time — the current time scale, the active background music, the current camera, etc.

```csharp
using Helteix.ChanneledProperties.Priorities;

// Default value used when no channel is in control
Priority<float> timeScale = new Priority<float>(defaultValue: 1f);
timeScale.AddOnValueChangeCallback(v => Time.timeScale = v, callImmediate: true);
```

## Adding channels
Each writer adds its own channel with a priority and a value. Priority can be given as an `int` or with the `PriorityTags` enum.

```csharp
// Pause menu wants time frozen, with a very high priority
timeScale.AddPriority(pauseMenu, PriorityTags.VeryHigh, 0f);

// A slow-motion effect wants 0.2, with a lower priority
timeScale.AddPriority(slowMoEffect, PriorityTags.High, 0.2f);
```

While both channels exist, the pause menu wins (higher priority) so the value is `0`. Remove the pause menu channel and the value automatically falls back to the slow-motion effect's `0.2`. Remove that too and it returns to the default `1`.

### Priority tags
`PriorityTags` gives you readable, ordered levels (from lowest to highest):

`None` &lt; `Smallest` &lt; `VerySmall` &lt; `Small` &lt; `Default` &lt; `High` &lt; `VeryHigh` &lt; `Highest`

:::warning
A channel with priority **`None`** can never take control. If every channel is set to `None`, the property returns its default value.
:::

## Updating and removing
Because a writer keeps its key, it can update its value or priority, or remove its channel entirely:

```csharp
timeScale.Write(slowMoEffect, 0.5f);                        // change the value
timeScale.ChangeChannelPriority(slowMoEffect, PriorityTags.Highest); // change the priority
timeScale.RemovePriority(slowMoEffect);                     // remove the channel
```

The `OnValueChanged` event fires only when the **resulting** value actually changes — for example, writing to a channel that isn't currently in control won't notify listeners.

## Useful members

| Member | Description |
| --- | --- |
| `T Value` | The value of the current main channel, or the default value. |
| `bool HasMainChannel` | `true` if at least one channel currently holds control. |
| `bool IsMainChannel(ChannelKey key)` | `true` if the given key is the one in control. |
| `AddPriority(key, priority, value)` | Adds a channel. Overloads accept `int` or `PriorityTags`, with or without a value. |
| `ChangeChannelPriority(key, priority)` | Changes a channel's priority without removing it. |
| `Write(key, value)` | Changes a channel's value. |
| `RemovePriority(key)` | Removes a channel. |
| `Clear()` | Removes every channel. |

## Sample
The **Priorities Demo** drives a text field with a `Priority<string>`:

```csharp
public class SamplePPManager : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI text;
    public Priority<string> texts;

    private void Awake()
    {
        texts = new Priority<string>("No channels");
        texts.AddOnValueChangeCallback(value => text.SetText(value));
    }
}
```

Different UI buttons then add, change and remove channels, and the text always reflects the highest-priority one.
