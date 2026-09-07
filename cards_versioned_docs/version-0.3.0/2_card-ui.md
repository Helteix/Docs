---
sidebar_position: 2
title: "Physical Card UI"
---

## Introduction
The UI layer turns a logical collection into on-screen cards that lay out, animate, and respond to the pointer. The entry point is `PhysicalCardCollectionUI<TCard>`, a `MonoBehaviour` you place on a Canvas and connect to any `ICardCollection<TCard>`.

## The moving parts

| Piece | Role |
| --- | --- |
| `PhysicalCardCollectionUI<TCard>` | Binds a collection to the UI. Spawns a holder + card for each card. |
| `CardFactoryUI` | Creates (and pools) the `CardUI` instances from prefabs. |
| `CardHolderUI` | A layout anchor. A *mover* positions the actual card toward its holder. |
| `CardUI<TCard>` | The visual card. It is the pointer/EventSystem surface and hosts card components. |

The holder and the card are **separate**: holders define *where* a card should be (layout), while the card visually **follows** its holder through a mover. This separation is what makes smooth, springy hand layouts and drag-and-drop possible.

## Setting it up
1. Create a card prefab with a `CardUI<TCard>` component (your own subclass of `CardUI<TCard>`).
2. Add a `CardFactoryUI` to your scene and assign the default card prefab.
3. Add a `CardHolderUI` prefab (a layout anchor).
4. Add your `PhysicalCardCollectionUI<TCard>` component and wire up its references in the inspector:

| Field | Description |
| --- | --- |
| **Custom Event System** | Optional. If left empty, the current `EventSystem` is used. |
| **Factory** | The `CardFactoryUI` used to create cards. |
| **Holder Prefab** | The `CardHolderUI` instantiated per card. |
| **Container Root** | Where holders are parented (defaults to this transform). |
| **Dragging Parent** | The `RectTransform` cards are re-parented to while dragged. |
| **Use 3D Dragging** | Whether dragging uses 3D positioning. |

## Connecting a collection
Once set up, connect any collection and the UI mirrors it automatically:

```csharp
public class HandView : MonoBehaviour
{
    [SerializeField] private PhysicalCardCollectionUI<PlayingCard> ui;

    private Hand<PlayingCard> hand = new Hand<PlayingCard>();

    private void Start()
    {
        ui.Connect(hand); // existing cards appear; future changes are tracked live
    }

    private void OnDestroy()
    {
        ui.Disconnect();
    }
}
```

After `Connect`, adding a card to `hand` spawns its holder and card UI, and removing it despawns them — you drive everything through the **logical** collection, and the UI keeps up.

## Making your own card visual
Subclass `CardUI<TCard>` for your card prefab. It exposes the references you need (`RectTransform`, `CanvasGroup`, `HolderUI`, `CollectionUI`, `Card`) and manages the [card components](./3_card-components.md) attached to it. Reacting to the bound card is done through components rather than by overriding the card itself, which keeps visuals modular.
