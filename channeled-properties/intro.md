---
sidebar_position: 0
---

# Installation & Concepts

## Installation
`com.helteix.channeled-properties` is a free package. Install it from the Unity Asset Store or from the [Helteix GitHub page](https://github.com/Helteix).

:::info[Dependencies]
Channeled Properties depends on **`com.helteix.tools`** and on Unity's **Burst** package (`com.unity.burst`). Both are resolved automatically when installing through the Package Manager.
:::

Three ready-to-use samples ship with the package and can be imported from the Package Manager: **Conditions Demo**, **Formulas Demo** and **Priorities Demo**.

## The problem it solves
Imagine an effect that slows down time. The player then opens the pause menu, which also sets the time scale to `0`. When they close the menu, whose value should win? And when the slow-motion effect ends, how does it restore the *right* value without knowing the menu ever touched it?

Classic solutions force every system to be aware of every other one, creating fragile dependency chains. **Channeled Properties** removes those dependencies entirely by applying the **broker / observer pattern**.

## The core idea
A *channeled property* holds a single logical value (say, `TimeScale`), but that value is the result of **many independent writers**, each owning its own **channel**. A writer only ever touches its own channel — it never needs to know about the others.

- The **owner** of the property listens to a single `OnValueChanged` event and reacts to the final value, without knowing *how*, *why*, or *by whom* it changed.
- Each **writer** adds a channel, writes to it, and removes it when done — nothing else.

How the channels are combined into the final value depends on which kind of property you use:

| Type | Combination rule | Typical use |
| --- | --- | --- |
| [`Priority<T>`](./2_priorities.md) | The channel with the **highest priority** wins. | Time scale, current music track, active camera. |
| [`Condition`](./3_conditions.md) | **All** channels must be `true` (logical AND). | "Can the player move?", "Is the door unlocked?". |
| [`Formula<T>`](./4_formulas.md) | A base value modified by a chain of **operations**. | Stats: damage, speed, cost with buffs/debuffs. |

## Channels and keys
Every channel is identified by a [`ChannelKey`](./1_channel-keys.md). A key is what lets a writer come back later to update or remove *its own* contribution. Keys can be generated uniquely, or derived from a Unity `Object` so a component can simply use itself as a key.

## Listening to changes
All channeled properties expose the same subscription API:

```csharp
property.AddOnValueChangeCallback(OnValueChanged);          // subscribe
property.AddOnValueChangeCallback(OnValueChanged, true);    // subscribe + call immediately with current value
property.RemoveOnValueChangeCallback(OnValueChanged);       // unsubscribe
```

The callback receives the newly computed value. You can also read the current value directly through the `Value` property, and every channeled property implicitly converts to its value type:

```csharp
float currentTimeScale = timeScale; // implicit conversion to T
```

## Capacity
Each property pre-allocates a fixed number of channel slots for performance. You can set the capacity in the constructor; if `expandWhenFull` is `true`, the buffer grows (to the next power of two) when it runs out of slots, otherwise adding a channel past capacity fails with an error. Defaults come from the [package settings](./5_settings.md).
