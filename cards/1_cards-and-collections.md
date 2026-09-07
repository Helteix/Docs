---
sidebar_position: 1
title: "Cards & Collections"
---

## Defining a card
A card implements `ICard`. The easiest way is to inherit from the abstract `Card` class, then add whatever data your game needs.

```csharp
using Helteix.Cards;

public class PlayingCard : Card
{
    public string Name;
    public int Cost;
}
```

Every card always knows the container it currently lives in through its `Container` property. You never set this yourself — collections manage it for you.

## Collections
A collection holds cards and raises events when its contents change. All collections derive from `CardCollection<TCard>` and share the same API:

| Member | Description |
| --- | --- |
| `bool TryAddCard(card, notify = true)` | Adds a card. If it already belongs to another collection, it is removed from there first. |
| `bool TryRemoveCard(card, notify = true)` | Removes a card. |
| `void Clear(notify = true)` | Removes every card. |
| `IEnumerable<TCard> Cards` | The cards currently held. |
| `event Action<TCard> OnCardAdded` | Raised when a card is added. |
| `event Action<TCard> OnCardRemoved` | Raised when a card is removed. |

:::info
Moving a card between collections is automatic: adding a card to a new collection removes it from its previous one, and both collections raise the appropriate events. Pass `notify: false` if you want to move cards silently (for example while dealing a whole hand at once).
:::

## `Deck`
`Deck<TCard>` is an **unordered** collection optimized for draw piles. It guarantees each card is unique and lets you peek/draw from the top.

```csharp
var deck = new Deck<PlayingCard>();
deck.TryAddCard(cardA);
deck.TryAddCard(cardB);

if (deck.TryPeek(out var top))     // look at the top card without removing it
    Debug.Log(top.Name);

Debug.Log(deck.CurrentSize);        // number of cards
```

## `Hand`
`Hand<TCard>` is an **ordered** collection with an optional maximum size — perfect for a player's hand where order and reordering matter.

```csharp
var hand = new Hand<PlayingCard>(maxSize: 7); // -1 for unlimited

hand.TryAddCard(card);
int index = hand.GetCardIndex(card);
hand.MoveCardToIndex(card, 0);       // reorder
hand.Sort(myComparer);               // sort with an IComparer<TCard>
```

Beyond the shared collection API, a hand adds:

| Member | Description |
| --- | --- |
| `int MaxSize` | Maximum number of cards (`-1` = unlimited). Adding past it fails. |
| `int CurrentSize` | Current card count. |
| `GetCard(index)` / `TryGetCard(index, out card)` | Access a card by position. |
| `GetCardIndex(card)` / `TryGetCardIndex(card, out index)` | Find a card's position. |
| `MoveCardToIndex(card, newIndex)` | Reorder a card. |
| `Sort(IComparer<TCard>)` | Sort the hand. |
| `event Action<Hand<TCard>> OnCardOrderChanged` | Raised when the order changes. |

## Extension helpers
The `CardExtensions` class adds convenient operations on any `CardCollection<TCard>`:

```csharp
deck.Shuffle();                 // Fisher-Yates shuffle (uniform, O(n))
deck.Transfer(cardA, cardB);    // add specific cards to this collection
deck.Transfer(hand);            // move every card from 'deck' into 'hand'
```

## A minimal example
```csharp
var deck = new Deck<PlayingCard>();
var hand = new Hand<PlayingCard>(maxSize: 5);

// fill and shuffle the deck
foreach (var card in allCards)
    deck.TryAddCard(card);
deck.Shuffle();

// draw 5 cards into the hand
for (int i = 0; i < 5; i++)
{
    if (deck.TryPeek(out var card))
        hand.TryAddCard(card); // automatically leaves the deck
}
```
