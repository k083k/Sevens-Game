# Game Mode Feature: Easy vs Hard

## Overview

A new **Game Mode** setting has been added that fundamentally changes the strategic depth of the game by allowing or preventing voluntary passing.

**This is NOT about AI difficulty** - this is a multiplayer game rule setting that applies to all human players.

---

## The Two Modes

### Easy Mode (Default)
- **Rule:** If you have any valid cards, you **must** play one
- **Cannot Pass:** You can only trigger "cannot play" when you have **zero** valid cards
- **Effect:** Straightforward gameplay, no bluffing
- **Good for:** Beginners, casual games

### Hard Mode (Strategic)
- **Rule:** You can **choose** to pass even if you have valid cards
- **Strategic Passing:** Voluntarily say "I cannot play" to hold onto key cards (especially 7s)
- **Penalty:** You still take a card from the previous player
- **Effect:** Deep strategic gameplay with bluffing and suit blocking
- **Good for:** Advanced players, competitive games

---

## Key Strategic Use Case: Holding 7s

### Scenario
You have 7♥ in your hand. In the current board state:
- Playing it would open Hearts and benefit opponents
- Holding it prevents anyone from playing Hearts cards

### Easy Mode Behavior
- You **must** either play 7♥ or play something else
- You cannot strategically hold the 7

### Hard Mode Behavior
- You can say "I cannot play" (even though you can)
- You take a penalty card from the previous player
- **But:** You keep 7♥ and block the entire Hearts suit
- Strategic question: "Is blocking Hearts worth taking a penalty card?"

---

## Implementation

### Type Definition

```typescript
export enum GameMode {
  EASY = 'easy',   // Must play if you have valid cards
  HARD = 'hard',   // Can choose to pass even with valid cards
}
```

### Usage

```typescript
import { Game, PlayerType, GameMode } from './src/game';

// Easy mode (default)
game.initializeGame([
  { name: 'Alice', type: PlayerType.HUMAN },
  { name: 'Bob', type: PlayerType.HUMAN }
]);

// Hard mode (strategic)
game.initializeGame([
  { name: 'Alice', type: PlayerType.HUMAN },
  { name: 'Bob', type: PlayerType.HUMAN }
], GameMode.HARD);
```

### With Zustand Store

```typescript
import { useGameStore } from './src/store/gameStore';
import { GameMode } from './src/game/types/types';

const { initializeGame } = useGameStore();

// Initialize in Hard mode
initializeGame([
  { name: 'Player 1', type: PlayerType.HUMAN },
  { name: 'Player 2', type: PlayerType.HUMAN }
], GameMode.HARD);
```

---

## Game State

The game mode is stored in game state and persists throughout the game:

```typescript
const state = game.getState();
console.log(state.gameMode); // 'easy' or 'hard'
```

---

## Rule Enforcement

### Easy Mode
```typescript
// Player has valid cards but tries to pass
game.handleCannotPlay();
// ❌ Throws: "Player has valid moves available (Easy mode enforces mandatory play)"
```

### Hard Mode
```typescript
// Player has valid cards and strategically chooses to pass
game.handleCannotPlay();
// ✅ Allowed! Pending card transfer is set up

// Previous player gives a card
game.executeCardTransfer(cardToGive);
// Player receives penalty card but kept their strategic cards
```

---

## Strategic Implications

### 1. Suit Blocking
**Hold a 7 to prevent suit from opening:**
- Opponent has many Hearts cards
- You have 7♥
- Pass voluntarily to keep 7♥
- Hearts stays closed, opponent stuck with dead cards

### 2. Timing Control
**Control when suits open:**
- Wait for optimal board state before opening a suit
- Force opponents to waste turns or give you cards

### 3. Bluffing
**Hide information:**
- Pass even with good cards to mislead opponents
- Make them think you have a weak hand

### 4. Penalty Trade-Off
**Risk/reward decision:**
- Is taking a penalty card worth the strategic advantage?
- Calculate: "What card might I receive vs what I'm protecting"

---

## Example Game Flow (Hard Mode)

```typescript
// Game in Hard mode
game.initializeGame([
  { name: 'Alice', type: PlayerType.HUMAN },
  { name: 'Bob', type: PlayerType.HUMAN }
], GameMode.HARD);

game.dealCards();

// Alice plays 7♠
game.playCard(sevenOfSpades);

// Bob's turn - he has 7♥ and 8♠
// In Easy mode: MUST play one of them
// In Hard mode: Can strategically pass

const validCards = game.getValidCardsForCurrentPlayer();
console.log('Valid cards:', validCards); // [7♥, 8♠]

// Bob decides to hold 7♥ to block Hearts
game.handleCannotPlay(); // ✅ Allowed in Hard mode

// Alice must give Bob a card (she chooses)
const state = game.getState();
console.log(state.pendingCardTransfer);
// { from: 'alice-id', to: 'bob-id' }

// Alice gives her worst card
game.executeCardTransfer(worstCard);

// Bob now has one more card, but still has 7♥
// Hearts remains closed - strategic success!
```

---

## Testing

**10 comprehensive tests added** covering:

✅ Default mode is Easy
✅ Easy mode prevents passing with valid cards
✅ Easy mode allows passing only with no valid cards
✅ Hard mode allows voluntary passing
✅ Hard mode enables strategic 7 holding
✅ Hard mode applies to all players
✅ Strategic suit blocking
✅ Penalty card acceptance for advantage
✅ Mode persistence throughout game

**Total test suite: 160 tests (all passing)**

---

## Backward Compatibility

- **Default behavior unchanged:** Easy mode is default
- **Existing code works:** All existing tests pass
- **Opt-in feature:** Must explicitly specify `GameMode.HARD`

---

## UI Considerations (Phase 2)

When building the UI, consider:

### Mode Selection Screen
- Let players choose Easy or Hard mode before game starts
- Explain the difference clearly
- Maybe show a quick example

### During Game (Hard Mode)
- Show "Pass" or "Cannot Play" button
- Indicate that passing is voluntary
- Show warning: "You have valid cards. Pass anyway?"
- Display current game mode in UI

### Strategic Indicator
- Maybe show suit availability
- Indicate which suits are blocked by missing 7s
- Help players make strategic decisions

---

## Advanced Strategy Tips (for documentation)

### When to Pass in Hard Mode

**Good times to pass:**
1. You have the only 7 of a suit opponents need
2. Opening a suit would benefit opponents more than you
3. You're close to winning and want to control the pace
4. You can force a specific opponent to give you a card

**Bad times to pass:**
1. Taking a penalty card could make you lose
2. You're already behind and need to play aggressively
3. The card you'd receive might be worse than what you're holding

### Suit Blocking Strategy
- Track which 7s have been played
- Hold 7s of suits where opponents have concentration
- Use suit blocking to force card transfers

### Penalty Card Psychology
- Previous player chooses what to give
- They'll give their worst card
- Consider: is their worst card better than holding your 7?

---

## Future Enhancements (Post-Phase 2)

Potential additions:
- **Visual indicators** of which 7s are being held
- **Turn history** showing who passed voluntarily
- **Statistics** tracking pass frequency per player
- **AI adaptation** - Hard AI could use voluntary passing
- **Tutorial mode** explaining the strategic depth

---

## Summary

This Game Mode feature adds **significant strategic depth** while maintaining backward compatibility:

- **Easy Mode:** Simple, beginner-friendly (default)
- **Hard Mode:** Strategic passing, suit blocking, bluffing

**No breaking changes** - all existing code works exactly as before.

**Fully tested** - 10 new tests, 160 total tests passing.

**Ready for UI** - When Phase 2 begins, just add mode selection to the game setup screen.

---

**Game Mode Feature: COMPLETE** ✅
