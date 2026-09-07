---
sidebar_position: 6
title: "Multi-Column List"
---

## Introduction
The **Multi-Column List** is a data-driven UI widget that renders a collection of items as a table, deriving its columns automatically from your item type. You annotate the properties you want to show, drop in a `MultiColumnListUI<T>`, and connect your data — the columns build themselves.

It's ideal for debug panels, inventories, stat tables, leaderboards, or any tabular data.

## 1. Annotate your item type
Mark the item class with `[GeneratePropertyBag]` and tag each property you want as a column with `[MultiColumnProperty]`.

```csharp
using ATCG;
using Unity.Properties;
using UnityEngine;

[GeneratePropertyBag, System.Serializable]
public class InventoryItem
{
    [property: MultiColumnProperty]
    [field: SerializeField]
    public int Count { get; private set; }

    [property: MultiColumnProperty("Item Name")]   // custom column title
    [field: SerializeField]
    public string Name { get; private set; }

    [property: MultiColumnProperty]
    [field: SerializeField]
    public bool Equipped { get; private set; }
}
```

Each `[MultiColumnProperty]` becomes a column. Pass a string to the attribute to override the column's title; otherwise the property name is used.

:::info
The system relies on Unity's **Properties** package (`Unity.Properties`). `[GeneratePropertyBag]` is what lets the list discover your columns at edit time.
:::

## 2. Create the list UI
Subclass `MultiColumnListUI<T>` for your item type and connect the data.

```csharp
using ATCG;
using System.Collections.Generic;

public class InventoryListUI : MultiColumnListUI<InventoryItem>
{
    protected override void CustomAwake()
    {
        base.CustomAwake();

        var items = new List<InventoryItem> { /* ... */ };
        Connect(items);
    }
}
```

`Connect(items)` binds the collection and populates the rows.

## 3. Configure columns in the inspector
On the `MultiColumnListUI` component, each discovered column exposes:

| Field | Description |
| --- | --- |
| **Show** | Whether the column is visible. |
| **Title** | The header label (from the attribute or property name). |
| **Width** | Column width (`-1` for automatic). |
| **Value UI Prefab** | An optional custom cell prefab used to render that column's value. |

## Custom cell rendering
By default, common value types (text, numbers, booleans) render with built-in cells. To customize how a column's value looks, assign a **Value UI Prefab** whose root has a component implementing `IMultiColumnRowValueUI<TValue>` for that column's value type.

:::warning
If the assigned prefab doesn't carry a component matching the column's value type, the system logs a warning and ignores the prefab, falling back to the default cell.
:::
