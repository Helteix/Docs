---
sidebar_position: 3
title: "Card Components"
---

## Introduction
Rather than cramming all card behavior into one big script, Cards uses small, composable **components** attached to a card. A component registers itself with its `CardUI` and opts into the interactions it cares about by implementing handler interfaces. This is conceptually similar to Unity's own event-system interfaces, but scoped to cards.

## Writing a component
Inherit from `CardUIComponent<TCard>` and override the connection hooks to react to the card the UI is bound to:

```csharp
using Helteix.Cards.UI.Physical.Components;
using UnityEngine;
using UnityEngine.UI;

public class CardArtwork : CardUIComponent<PlayingCard>
{
    [SerializeField] private Image image;

    public override void Connect(PlayingCard card)
    {
        base.Connect(card);
        image.sprite = LoadSprite(card.Name);
    }

    public override void Disconnect(PlayingCard card)
    {
        base.Disconnect(card);
        image.sprite = null;
    }
}
```

- `Connect` / `Disconnect` are called when a card is bound to / unbound from the UI.
- The component finds its owning card with `GetComponentInParent`, so it can live on the card root **or on any sub-object** of the card.
- Registration happens automatically on `OnEnable` (and unregistration on `OnDisable`), controlled by the `registerOnEnable` / `unregisteredOnDisable` fields.

## Handler interfaces
Implement any of these interfaces on your component to receive the matching interactions. You only implement what you need.

| Interface | Methods | Fires on |
| --- | --- | --- |
| `ICardPointerClickHandler` | `OnClickCard(button)` | The card is clicked. |
| `ICardPointerHoverHandler` | `OnBeginCardHover`, `OnEndCardHover`, `OnCardHoverMove` | The pointer enters/moves/leaves the card. |
| `ICardPointerDragHandler` | `OnInitializePotentialCardDrag`, `OnBeginCardDrag`, `OnUpdateCardDrag`, `OnEndCardDrag`, `OnCardDrop` | The card is dragged and dropped. |
| `ICardSelectionHandler` | `OnSelect`, `OnDeselect`, `OnMove` | The card gains/loses selection (gamepad/keyboard navigation). |
| `ICardSubmitHandler` | `OnSubmitCard`, `OnCancelCard` | The Submit/Cancel action is triggered on the card. |

Example — a component that scales the card up on hover:

```csharp
public class HoverScale : CardUIComponent<PlayingCard>, ICardPointerHoverHandler
{
    public void OnBeginCardHover() => transform.localScale = Vector3.one * 1.1f;
    public void OnEndCardHover()   => transform.localScale = Vector3.one;
    public void OnCardHoverMove(Vector2 position, Vector2 delta) { }
}
```

## Querying components
From code you can look up the components on a card through the `CardUI`:

```csharp
if (cardUI.TryGetCardComponent<HoverScale>(out var hover))
    // ...

foreach (var handler in cardUI.GetCardComponents<ICardPointerClickHandler>())
    // ...
```

:::tip
Keep each component focused on a single concern — artwork, hover animation, click sound, drag logic — and compose them on the prefab. This makes card behaviors reusable across different card types.
:::
