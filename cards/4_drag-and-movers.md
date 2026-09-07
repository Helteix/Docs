---
sidebar_position: 4
title: "Movers & Drag"
---

## Movers — how cards move
A card doesn't jump instantly to its layout slot: a **mover** drives it toward its holder every frame, which is what gives hands their smooth, animated feel. Each `CardHolderUI` runs the mover with the highest `Priority` among those attached to it.

### `FollowCardMover`
The default mover, `FollowCardMover`, smoothly interpolates a card's position, rotation, scale and size toward its holder. It is serializable, so you can tune it in the inspector.

| Field | Description |
| --- | --- |
| `damping` | How quickly the card catches up to its holder (higher = snappier). |
| `positionOffset`, `rotationOffset`, `scaleOffset`, `sizeOffset` | Constant offsets applied to the target. |
| `positionDampingMultiplier`, `rotationDampingMultiplier`, `scaleDampingMultiplier`, `sizeDampingMultiplier` | Per-channel damping tweaks. |

### Adding and removing movers
You can layer additional movers on a holder at runtime — for example a special mover while a card is being dragged. The holder always applies the highest-priority one.

```csharp
holder.AddMover(myDragMover);
holder.RemoveMover(myDragMover);
```

### Custom movers
Implement `ICardUIMover` for full control:

```csharp
public class SnapMover : ICardUIMover
{
    public int Priority => 10; // wins over the default FollowCardMover (priority 1)

    public void MoveCard(CardHolderUI holderUI, ICardUI cardUI)
    {
        cardUI.RectTransform.position = holderUI.RectTransform.position; // instant snap
    }
}
```

## Drag & drop
When a card supports dragging (via a component implementing `ICardPointerDragHandler`), the collection tracks the gesture as a **drag phase** and resolves it against **drop targets**.

### Drop targets
Implement `ICardDropTarget<TCard>` on anything that should accept dropped cards — another collection's zone, a "play" area, a discard pile:

```csharp
public class PlayZone : MonoBehaviour, ICardDropTarget<PlayingCard>
{
    public int Priority => 0;

    public bool Accepts(ICardUI<PlayingCard> cardUI) => true;

    public void OnCardEnter(ICardUI<PlayingCard> cardUI) { /* highlight */ }
    public void OnCardExit(ICardUI<PlayingCard> cardUI)  { /* un-highlight */ }
    public void OnCardHover(ICardUI<PlayingCard> cardUI) { }
    public void OnCardDrop(ICardUI<PlayingCard> cardUI)  { /* play the card */ }
}
```

- `Accepts` decides whether this target will take the card.
- `Priority` breaks ties when several targets overlap under the pointer.
- `OnCardEnter` / `OnCardExit` / `OnCardHover` let you give feedback while dragging.
- `OnCardDrop` is where you act on a successful drop.

### Drag results
When a drag ends, the outcome is described by a `DragResult<TCard>` — which `Target` was under the pointer, whether it `Accepted` the card, and the `ScreenPosition` of the drop. Your drag handler's `OnCardDrop` receives the resolved target so you can move the card in the **logical** collections accordingly (which then updates the UI automatically).

:::tip
Always perform the actual card move on the **core collections** (`Deck`, `Hand`, …) in response to a drop. The UI is a mirror of the logical state, so once you move the card in the collection, the physical cards rearrange themselves.
:::
