---
sidebar_position: 4
title: "Formulas"
---

## Introduction
A `Formula<T>` starts from a **base value** and applies a chain of **operations** contributed by independent channels. It's the tool of choice for stats that stack: base damage modified by buffs and debuffs, a movement speed affected by several effects, a price adjusted by discounts, and so on.

Each modifier owns its channel, so it can be added, changed and removed independently — the final value is always recomputed correctly.

```csharp
using Helteix.ChanneledProperties.Formulas;

// Base damage of 10
Formula<float> damage = new Formula<float>(startValue: 10f);
damage.AddOnValueChangeCallback(v => Debug.Log($"Damage = {v}"), callImmediate: true);
```

:::info[Supported types]
`Formula<T>` requires an `unmanaged` type and uses **Burst-compiled** calculators. The built-in value types are **`float`**, **`int`**, **`Vector2`** and **`Vector3`**.
:::

## Adding operations
Use the shortcut methods for the four basic operators, or the full `AddOperation` for complete control:

```csharp
damage.Add(strengthBuff, 5f);        // +5
damage.Multiply(critModifier, 2f);   // x2
damage.Subtract(armorDebuff, 3f);    // -3
damage.Divide(someKey, 2f);          // /2
```

The generic form:

```csharp
damage.AddOperation(
    key: strengthBuff,
    opValue: 5f,
    op: Operator.Add,
    multiplyWith: MultiplyWith.Nothing,
    group: 0,
    orderInGroup: 0);
```

### Operators
`Operator` is one of `Add`, `Subtract`, `Multiply`, `Divide`.

### Groups and order — emulating parentheses
Operations are organized in **groups**, and ordered **within** each group by `orderInGroup`. Groups let you isolate a set of operations so they resolve together, the way parentheses do in a written formula. Use `group` to separate concerns (e.g. additive bonuses in one group, multipliers in another) and `orderInGroup` to control the sequence inside a group.

### `MultiplyWith`
For multiplicative operations, `MultiplyWith` controls what the operation's value is applied against:

| Value | Applies the operation relative to |
| --- | --- |
| `Nothing` | The value as-is (default). |
| `StartValue` | The formula's original start value. |
| `StartGroupValue` | The value at the start of the current group. |
| `CurrentValue` | The running value at that point in the chain. |

This lets you express modifiers like *"+20% of the base value"* rather than a flat amount.

## Updating and removing
```csharp
damage.Write(strengthBuff, 8f);  // change the operand value of a channel
damage.RemoveOperation(strengthBuff);
```

For anything beyond the operand value (changing the operator, the group, etc.), use `Modify`:

```csharp
damage.Modify(critModifier, channel =>
{
    channel.op = Operator.Multiply;
    channel.value = 3f;
    return channel;
});
```

## Useful members

| Member | Description |
| --- | --- |
| `T Value` | The computed result. Recalculated lazily when a channel changes. |
| `T StartValue` | The base value the formula starts from. |
| `Add / Subtract / Multiply / Divide` | Shortcuts to add an operation with the matching operator. |
| `AddOperation(...)` | Adds an operation with full control over operator, group, order and `MultiplyWith`. |
| `Write(key, value)` | Changes a channel's operand value. |
| `Modify(key, func)` | Modifies a channel in place (operator, group, value...). |
| `RemoveOperation(key)` | Removes an operation. |

:::info
The value is computed **lazily**: it is only recalculated the next time you read `Value` after a change. Listeners registered through `AddOnValueChangeCallback` are still notified when a change marks the formula as needing a refresh.
:::

## Settings
The maximum number of groups a formula can use is capped by the **Max Groups** setting (see [Settings](./5_settings.md)).
