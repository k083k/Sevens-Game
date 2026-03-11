# Quick Start Guide - Sevens Game (Phase 1)

## What You Have

A **fully functional card game engine** with:
- ✅ Complete game logic
- ✅ AI opponents (Easy & Hard)
- ✅ 150 passing tests
- ✅ Type-safe TypeScript implementation
- ⏳ No UI yet (Phase 2)

---

## Installation

```bash
# Navigate to project
cd sevens-game

# Install dependencies
npm install

# Run tests to verify everything works
npm test
```

**Expected output:**
```
Test Suites: 7 passed, 7 total
Tests:       150 passed, 150 total
```

---

## Usage Example

Here's how to use the game engine programmatically:

```typescript
import { Game, PlayerType } from './src/game';

// Create a new game
const game = new Game();

// Initialize with 2 players
game.initializeGame([
  { name: 'Alice', type: PlayerType.HUMAN },
  { name: 'Bob (AI)', type: PlayerType.AI_HARD }
]);

// Deal cards
game.dealCards();

// Get current player (whoever has 7♠)
const currentPlayer = game.getCurrentPlayer();
console.log(`${currentPlayer.name} goes first!`);

// Get valid cards for current player
const validCards = game.getValidCardsForCurrentPlayer();
console.log('Valid cards:', validCards.map(c => c.toString()));

// Play the first valid card
game.playCard(validCards[0]);

// Check game state
const state = game.getState();
console.log('Current phase:', state.gamePhase);
console.log('Board state:', state.board);
```

---

## Using the Zustand Store

For React integration (when UI is built in Phase 2):

```typescript
import { useGameStore } from './src/store/gameStore';

function GameScreen() {
  const {
    gameState,
    initializeGame,
    dealCards,
    playCard
  } = useGameStore();

  const startGame = () => {
    initializeGame([
      { name: 'You', type: PlayerType.HUMAN },
      { name: 'AI', type: PlayerType.AI_HARD }
    ]);
    dealCards();
  };

  const handleCardClick = (card) => {
    playCard(card);
  };

  // Render UI based on gameState...
}
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm test:watch

# Run tests with coverage report
npm test:coverage
```

---

## Project Structure

```
sevens-game/
├── src/
│   ├── game/              # Game logic (100% of Phase 1 work)
│   │   ├── models/        # Card, Deck, Board, Players
│   │   ├── engine/        # GameEngine, SpadesLockValidator
│   │   ├── ai/            # AI strategies
│   │   └── types/         # TypeScript interfaces
│   │
│   ├── store/             # Zustand state management
│   ├── utils/             # Constants (app name here!)
│   └── __tests__/         # 150 tests
│
├── README.md              # Full documentation
├── PHASE_1_SUMMARY.md     # What was built
└── QUICK_START.md         # This file
```

---

## The Rules (Quick Version)

1. **Goal:** Empty your hand first
2. **Starting:** Player with 7♠ goes first
3. **Playing:**
   - 7s open new suits
   - Other cards extend sequences from 7
4. **The Spades Lock:**
   - Can't play 8♥ until 8♠ is on the board
   - Can't play any rank N in H/D/C until rank N exists on Spades row
5. **Can't Play:** Take a card from previous player (they choose)
6. **Winning:** First to empty hand = 1st place

Full rules in [README.md](./README.md).

---

## Key Classes

### `Game` - Main orchestrator
```typescript
game.initializeGame(playerConfigs)
game.dealCards()
game.playCard(card)
game.getCurrentPlayer()
game.getValidCardsForCurrentPlayer()
```

### `GameEngine` - Rule enforcement
```typescript
engine.canPlayCard(card, player) // Validates move
engine.getValidCards(player)     // Get all valid options
engine.playCard(card, player)    // Execute move
```

### `Board` - Game board state
```typescript
board.playCard(card)
board.isSuitOpen(suit)
board.isRankOnSpades(rank) // For Spades Lock
```

### `SpadesLockValidator` - The critical rule
```typescript
SpadesLockValidator.isUnlocked(card, board)
SpadesLockValidator.getLockReason(card, board)
```

---

## AI Opponents

### Easy AI
- Random valid card selection
- Good for beginners

### Hard AI
- Prioritizes Spades (unlocks more ranks)
- Strategic card giving
- Holds 7s when beneficial
- Good challenge for experienced players

Create an AI opponent:
```typescript
import { PlayerType } from './src/game';

game.initializeGame([
  { name: 'Human', type: PlayerType.HUMAN },
  { name: 'Easy AI', type: PlayerType.AI_EASY },
  { name: 'Hard AI', type: PlayerType.AI_HARD }
]);
```

---

## Changing the App Name

When you're ready to finalize the name:

1. **Edit `/src/utils/constants.ts`:**
   ```typescript
   export const APP_CONFIG = {
     APP_NAME: 'your-app-name',
     APP_DISPLAY_NAME: 'Your App Display Name',
   };
   ```

2. **Edit `package.json`:**
   ```json
   {
     "name": "your-app-name"
   }
   ```

3. **Edit `app.json`:**
   ```json
   {
     "expo": {
       "name": "Your App Display Name",
       "slug": "your-app-name"
     }
   }
   ```

---

## Next Steps (Phase 2)

Phase 1 is complete! To move to Phase 2:

1. **Work with designer** to define:
   - Visual design language
   - Card appearance
   - Board layout
   - Animations
   - Interactions

2. **Build UI** (after design is approved):
   - Create React Native components
   - Add animations (Reanimated)
   - Implement gestures
   - Connect to Zustand store
   - Test on iOS/Android/Web

---

## Common Tasks

### Run a complete game programmatically
```typescript
const game = new Game();
game.initializeGame([
  { name: 'Player 1', type: PlayerType.HUMAN },
  { name: 'Player 2', type: PlayerType.HUMAN }
]);
game.dealCards();

// Game loop (simplified)
while (game.getState().gamePhase === GamePhase.PLAYING) {
  const validCards = game.getValidCardsForCurrentPlayer();

  if (validCards.length > 0) {
    game.playCard(validCards[0]); // Play first valid card
  } else {
    // Handle cannot-play scenario
    game.handleCannotPlay();
    // Give a card...
  }
}
```

### Check if current player is AI
```typescript
const currentPlayer = game.getCurrentPlayer();
if (currentPlayer.type !== PlayerType.HUMAN) {
  const decision = game.getAIDecision();
  // Process AI turn...
}
```

### Get board state for rendering
```typescript
const boardState = game.getBoardState();

// boardState structure:
{
  spades: { low: 5, high: 9 },    // 5♠ through 9♠ on board
  hearts: { low: 7, high: 7 },    // Only 7♥ on board
  diamonds: { low: null, high: null }, // Not opened
  clubs: { low: null, high: null }     // Not opened
}
```

---

## Troubleshooting

### Tests fail
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm test
```

### TypeScript errors
```bash
# Ensure TypeScript is installed
npm install --save-dev typescript
```

### Import errors
Make sure to import from the correct paths:
```typescript
// ✅ Correct
import { Game, PlayerType } from './src/game';

// ❌ Incorrect
import { Game } from './src/game/Game';
```

---

## Resources

- **README.md** - Full project documentation
- **PHASE_1_SUMMARY.md** - Technical implementation details
- **src/game/types/types.ts** - All TypeScript interfaces
- **src/__tests__/** - Usage examples in tests

---

## Questions?

Phase 1 is production-ready game logic. Everything you need to understand and extend the codebase is in the documentation and tests.

**Ready to build the UI in Phase 2!**
