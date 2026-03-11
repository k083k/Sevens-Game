# Sevens Card Game - Phase 1

A cross-platform digital card game built with Expo and React Native. This is **Phase 1** - the core game logic engine.

## Project Status

**Phase 1: COMPLETE** ✅

- ✅ Core game logic engine (TypeScript, fully tested)
- ✅ AI opponent logic (Easy & Hard difficulty)
- ✅ Complete rule enforcement (including Spades Lock)
- ✅ State management (Zustand)
- ✅ Comprehensive test suite (150 tests, all passing)

**Next Phases:**
- Phase 2: UI and animations (awaiting designer input)
- Phase 3: Accounts, profiles, history
- Phase 4: Multiplayer via Socket.io + Supabase
- Phase 5: Leaderboards, streaks

---

## The Game: Sevens

A strategic card game for 2-4 players where positioning and timing are everything.

### Quick Rules

- **Objective:** Be the first to empty your hand
- **Starting Card:** The player with 7♠ always goes first
- **The Spades Lock (Critical Rule):** No card of any rank in Hearts/Diamonds/Clubs can be played until that same rank exists on the Spades row
- **Cannot Play:** If you have no valid moves, you take a card from the previous player (they choose which card to give)
- **Winning:** First to empty their hand wins. Play continues until only one player remains (they finish last)

---

## Tech Stack

- **Framework:** Expo (React Native + Web support)
- **Language:** TypeScript (strict mode, no `any` types)
- **State Management:** Zustand
- **Testing:** Jest (150 tests, 100% critical path coverage)
- **Architecture:** Object-Oriented Design with clean separation of concerns

---

## Project Structure

```
sevens-game/
├── src/
│   ├── game/
│   │   ├── models/           # Core domain models
│   │   │   ├── Card.ts       # Immutable card representation
│   │   │   ├── Deck.ts       # Deck creation, shuffle, deal
│   │   │   ├── Board.ts      # 4-row board state management
│   │   │   ├── Player.ts     # Abstract player + HumanPlayer
│   │   │   └── AIPlayers.ts  # EasyAI & HardAI players
│   │   ├── engine/           # Rule enforcement
│   │   │   ├── GameEngine.ts         # Core game rules
│   │   │   └── SpadesLockValidator.ts # Spades Lock rule
│   │   ├── ai/               # AI strategies
│   │   │   ├── EasyAI.ts     # Random play strategy
│   │   │   └── HardAI.ts     # Strategic AI
│   │   ├── types/
│   │   │   └── types.ts      # All TypeScript interfaces & types
│   │   ├── Game.ts           # Main game orchestrator
│   │   └── index.ts          # Game exports
│   ├── store/
│   │   └── gameStore.ts      # Zustand state management
│   ├── utils/
│   │   └── constants.ts      # App config (easy name change)
│   └── __tests__/
│       ├── unit/             # Unit tests for all components
│       └── integration/      # Full game flow tests
├── package.json
├── jest.config.js
└── README.md
```

---

## Key Design Patterns

### 1. **Strategy Pattern** (AI)
Different AI difficulty levels implement the same interface:
```typescript
interface IAIStrategy {
  selectCardToPlay(hand, validCards, boardState): ICard;
  selectCardToGive(hand, recipient, boardState): ICard;
}
```

### 2. **Object-Oriented Design**
- **Encapsulation:** Board internals hidden behind public methods
- **Single Responsibility:** Each class has one clear purpose
- **Dependency Injection:** GameEngine receives dependencies, doesn't create them
- **Immutability:** Card objects are immutable

### 3. **Clean Architecture**
- Models contain business logic
- Engine enforces rules
- Store is a thin layer over Game class
- All testable in isolation

---

## The Spades Lock Rule (Implementation Highlight)

The most complex rule in the game is isolated in `SpadesLockValidator`:

```typescript
// Before you can play 8♥, you must play 8♠ first
SpadesLockValidator.isUnlocked(card, board)
```

**How it works:**
1. Spades always plays freely
2. All other suits are "locked" to the Spades progression
3. You can only play rank N in Hearts/Diamonds/Clubs if rank N exists on the Spades row
4. Applies in both directions (toward Ace and toward King)

**Special case:**
- Since 7♠ is always the first card played, all four 7s are unlocked from the start

---

## Installation & Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage

# Start Expo dev server (when UI is built in Phase 2)
npm start
```

---

## Running Tests

All 150 tests pass:

```bash
npm test
```

**Test Coverage:**
- ✅ Card creation and equality
- ✅ Deck creation (52 cards, no duplicates, correct distribution)
- ✅ Board sequence management
- ✅ **Spades Lock rule enforcement (comprehensive edge cases)**
- ✅ GameEngine rule validation
- ✅ AI decision-making (Easy & Hard)
- ✅ Full game flow integration tests

---

## Game State Management

Using Zustand for lightweight, performant state management:

```typescript
const { game, gameState, initializeGame, playCard } = useGameStore();

// Initialize a game
initializeGame([
  { name: 'Alice', type: PlayerType.HUMAN },
  { name: 'Bob AI', type: PlayerType.AI_HARD },
]);

// Deal cards
dealCards();

// Play a card
playCard(selectedCard);

// Process AI turn
processAITurn();
```

---

## AI Implementation

### Easy AI
- Plays a random valid card
- Gives a random card when opponent cannot play

### Hard AI
**Strategic priorities:**

**When playing:**
1. Play Spades cards to unlock more ranks
2. Avoid opening suits that benefit opponents
3. Hold 7s when better plays exist

**When giving cards:**
1. Give cards in closed suits (locked behind 7s)
2. Give cards locked by Spades rule
3. Give cards furthest from 7 (hardest to play)

---

## Changing the App Name

The app name is centralized in `/src/utils/constants.ts`:

```typescript
export const APP_CONFIG = {
  APP_NAME: 'sevens-game',        // Change here
  APP_DISPLAY_NAME: 'Sevens',     // And here
  VERSION: '1.0.0',
};
```

Also update:
- `package.json` → `name` field
- `app.json` → `expo.name` and `expo.slug` fields

---

## Game Flow Example

```typescript
import { Game, PlayerType } from './src/game';

const game = new Game();

// 1. Initialize
game.initializeGame([
  { name: 'Human', type: PlayerType.HUMAN },
  { name: 'AI', type: PlayerType.AI_HARD }
]);

// 2. Deal cards
game.dealCards();

// 3. First player (has 7♠) plays
const currentPlayer = game.getCurrentPlayer();
const validCards = game.getValidCardsForCurrentPlayer();
game.playCard(validCards[0]); // Play 7♠

// 4. Next player's turn
if (game.currentPlayerHasValidMoves()) {
  // Play a card
} else {
  // Cannot play - must take card from previous player
  game.handleCannotPlay();
  // Previous player chooses card to give
  game.executeCardTransfer(cardToGive);
}
```

---

## Critical Implementation Notes

### The 7♠ Rule
- **Always** the first card played
- Player who has it goes first
- Turn order proceeds clockwise from that player

### The Cannot-Play Mechanic
- If you can't play, you take one card from the previous player
- They choose which card to give (strategic)
- If they have only one card and give it away, they win on the spot

### Winning & Ranking
- First to empty hand = 1st place
- Play continues among remaining players
- Last player holding cards = last place

---

## What's Next (Phase 2)

**UI/UX work begins** - awaiting designer decisions on:
- Visual design language
- Card layout and animations
- Game board presentation
- Player interaction flows

**No UI code has been written yet** - all design decisions deferred to Phase 2.

---

## Testing Philosophy

- **Unit tests:** Test each class in isolation
- **Integration tests:** Test full game flows
- **No mocks:** Tests use real implementations where possible
- **Edge cases:** Comprehensive coverage of Spades Lock rule

**Current stats:**
- 150 tests
- 7 test suites
- 100% coverage of critical game logic

---

## Contributors

Built following strict OOP principles with a focus on:
- Type safety (strict TypeScript)
- Testability (dependency injection, pure functions)
- Maintainability (single responsibility, clean architecture)
- Scalability (designed for future multiplayer & backend)

---

## License

[Add license information]

---

## Questions?

This is Phase 1 only. For questions about future phases or the game rules, refer to the master design document.
