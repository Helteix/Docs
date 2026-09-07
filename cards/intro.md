---
sidebar_position: 0
---

# Installation & Architecture

## Installation
`com.helteix.cards` is a flexible, extendable card system meant to fit any kind of card game. Install it from the Unity Asset Store or from the [Helteix GitHub page](https://github.com/Helteix).

:::info[Dependency]
Cards depends on **`com.helteix.tools`**, which is resolved automatically through the Package Manager.
:::

:::warning[Work in progress]
Cards is a young package (currently `0.3.0`). The **core logic** is stable, but the **UI layer** is still evolving — some UI APIs may change in future versions.
:::

## Two layers
The package is split into two independent layers so you can use as little or as much as you need.

### 1. Core — the logic
Pure C#, no `MonoBehaviour`, no UI. It models cards and the collections that hold them:

- [`ICard` / `Card`](./1_cards-and-collections.md) — a card, which always knows the container it belongs to.
- [`CardCollection<TCard>`](./1_cards-and-collections.md) — the base for any collection, with add/remove events.
- [`Deck<TCard>`](./1_cards-and-collections.md) and [`Hand<TCard>`](./1_cards-and-collections.md) — ready-made collections.

You can build a fully working card game on the core alone (server-side logic, simulation, tests) without ever touching the UI.

### 2. UI — the physical cards
An optional layer that renders collections as draggable, clickable, animated cards on a Unity Canvas:

- [`PhysicalCardCollectionUI<TCard>`](./2_card-ui.md) — binds a collection to on-screen cards.
- [`CardUIComponent`](./3_card-components.md) — plug behaviors (click, drag, hover…) onto a card.
- [Movers & drag](./4_drag-and-movers.md) — how cards move, follow, and get dropped onto targets.

## Design principle
Everything is **generic over your own card type** (`TCard : ICard`). You define what a card *is* for your game; Helteix provides the containers, the events, and the UI plumbing around it.
