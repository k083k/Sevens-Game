# Phase 2 Implementation Plan - UI/UX Development

## Overview
This document outlines the complete implementation plan for Phase 2 of the Sevens card game, focusing on building the UI/UX layer on top of the existing game logic engine.

**Based On:** UI_DESIGN_DECISIONS.md
**Game Logic:** Phase 1 (Complete, 160 tests passing)
**Target Timeline:** 8 weeks
**Target Platforms:** iOS, Android, Web (unified codebase)

---

## Project Setup & Dependencies

### Step 1: Install Required Dependencies

```bash
# Navigation
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context

# Animations
npx expo install react-native-reanimated
npx expo install react-native-gesture-handler

# Audio
npx expo install expo-av

# Screen Orientation
npx expo install expo-screen-orientation

# Assets
npx expo install expo-asset
npx expo install expo-font

# SVG Support (if using SVG cards)
npx expo install react-native-svg
```

### Step 2: Configuration Updates

#### babel.config.js
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
```

#### app.json
```json
{
  "expo": {
    "name": "Sevens",
    "slug": "sevens-game",
    "orientation": "landscape",
    "userInterfaceStyle": "automatic",
    "plugins": [
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "LANDSCAPE"
        }
      ]
    ]
  }
}
```

---

## Project Structure (Phase 2 Additions)

```
sevens-game/
├── src/
│   ├── game/                    # [EXISTING] Game logic
│   ├── store/                   # [EXISTING] Zustand store
│   ├── utils/                   # [EXISTING] Constants
│   │
│   ├── components/              # [NEW] React components
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── CardBack.tsx
│   │   │   └── index.ts
│   │   ├── Board/
│   │   │   ├── Board.tsx
│   │   │   ├── SuitRow.tsx
│   │   │   └── index.ts
│   │   ├── Hand/
│   │   │   ├── Hand.tsx
│   │   │   ├── FanLayout.tsx
│   │   │   └── index.ts
│   │   ├── Player/
│   │   │   ├── PlayerInfo.tsx
│   │   │   ├── AIPlayerDisplay.tsx
│   │   │   └── index.ts
│   │   ├── UI/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── index.ts
│   │   └── Tutorial/
│   │       ├── TutorialOverlay.tsx
│   │       ├── TutorialStep.tsx
│   │       └── index.ts
│   │
│   ├── screens/                 # [NEW] Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── SetupScreen.tsx
│   │   ├── GameScreen.tsx
│   │   └── index.ts
│   │
│   ├── navigation/              # [NEW] Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── index.ts
│   │
│   ├── theme/                   # [NEW] Design system
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── animations.ts
│   │   └── index.ts
│   │
│   ├── hooks/                   # [NEW] Custom React hooks
│   │   ├── useCardAnimation.ts
│   │   ├── useSoundEffects.ts
│   │   ├── useTutorial.ts
│   │   └── index.ts
│   │
│   ├── assets/                  # [NEW] Images, sounds, fonts
│   │   ├── images/
│   │   │   ├── cards/          # 52 card images + back
│   │   │   ├── backgrounds/
│   │   │   └── icons/
│   │   ├── sounds/
│   │   │   ├── card-slide.mp3
│   │   │   ├── card-place.mp3
│   │   │   ├── card-shuffle.mp3
│   │   │   └── error.mp3
│   │   └── fonts/              # If using custom fonts
│   │
│   └── services/                # [NEW] Utilities
│       ├── soundManager.ts
│       ├── layoutCalculator.ts
│       └── index.ts
│
├── App.tsx                      # [MODIFIED] Entry point
└── index.ts                     # [EXISTING] Expo entry
```

---

## Implementation Phases (8 Weeks)

## Week 1: Foundation & Setup

### Goals
- Project dependencies installed
- Theme/design system created
- Navigation scaffolding
- Asset preparation

### Tasks

#### Day 1-2: Dependencies & Configuration
- [ ] Install all dependencies
- [ ] Update babel.config.js for Reanimated
- [ ] Update app.json for landscape orientation
- [ ] Test basic Expo build (iOS/Android/Web)
- [ ] Create theme folder structure

#### Day 3-4: Design System
- [ ] Create `src/theme/colors.ts` with design tokens
- [ ] Create `src/theme/spacing.ts`
- [ ] Create `src/theme/typography.ts`
- [ ] Create `src/theme/animations.ts` (durations, easing)
- [ ] Export all from `src/theme/index.ts`

#### Day 5: Navigation Setup
- [ ] Create `src/navigation/AppNavigator.tsx`
- [ ] Set up Stack Navigator
- [ ] Create placeholder screens (Home, Setup, Game)
- [ ] Test navigation flow
- [ ] Update App.tsx to use navigator

#### Day 6-7: Asset Preparation
- [ ] Source or create 52 card images (PNG/SVG)
- [ ] Create card back design
- [ ] Create felt table background
- [ ] Find/create sound effects
- [ ] Organize in `src/assets/`
- [ ] Set up asset loading utilities

**Week 1 Deliverable:**
- Working navigation between 3 screens
- Design system established
- All assets ready

---

## Week 2: Core Components - Cards & Board

### Goals
- Card component with animations
- Board layout with 4 suit rows
- Basic rendering from game state

### Tasks

#### Day 1-2: Card Component
```typescript
// src/components/Card/Card.tsx
- [ ] Create Card component
- [ ] Props: card (ICard), onPress, isValid, isSelected
- [ ] Render card image based on suit/rank
- [ ] Add shadow/elevation styling
- [ ] Create CardBack component (for AI)
- [ ] Test rendering all 52 cards
```

#### Day 3: Card Animations
```typescript
// src/hooks/useCardAnimation.ts
- [ ] Create shared values for position, scale, rotation
- [ ] Implement pick-up animation (scale + translate)
- [ ] Implement play animation (move to board)
- [ ] Implement invalid shake animation
- [ ] Test smooth 60fps performance
```

#### Day 4-5: Board Component
```typescript
// src/components/Board/Board.tsx
- [ ] Create Board container component
- [ ] Create SuitRow component
- [ ] Display 4 rows (Spades, Hearts, Diamonds, Clubs)
- [ ] Render cards in sequence from 7 outward
- [ ] Empty slot placeholders for playable positions
- [ ] Suit icons/labels
```

#### Day 6: Board Integration
- [ ] Connect Board to Zustand store
- [ ] Read boardState from game
- [ ] Render cards from actual game state
- [ ] Test with mock game data
- [ ] Handle different board states

#### Day 7: Testing & Refinement
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on web browser
- [ ] Fix layout issues
- [ ] Performance check

**Week 2 Deliverable:**
- Functional Card component with animations
- Board displaying game state correctly
- Smooth rendering on all platforms

---

## Week 3: Player Hand & Interactions

### Goals
- Fan layout for player hand
- Tap to play interaction
- Valid move highlighting
- Connect to game logic

### Tasks

#### Day 1-2: Hand Component - Fan Layout
```typescript
// src/components/Hand/FanLayout.tsx
- [ ] Calculate fan arc geometry
- [ ] Position cards in arc formation
- [ ] Calculate rotation for each card
- [ ] Handle variable card counts (1-13 cards)
- [ ] Responsive to screen width
- [ ] Overlap calculation (65% visible)
```

#### Day 3: Hand Interaction
```typescript
// src/components/Hand/Hand.tsx
- [ ] Tap to select card (raise up animation)
- [ ] Tap again to play (or tap elsewhere to deselect)
- [ ] Visual feedback on selection
- [ ] Disable interaction during AI turn
- [ ] Touch area optimization (card hitbox)
```

#### Day 4: Valid Move Highlighting
- [ ] Get valid cards from game engine
- [ ] Highlight valid cards (glow/border) in Easy mode
- [ ] Dim invalid cards slightly
- [ ] Disable highlighting in Hard mode
- [ ] Test with various game states

#### Day 5: Play Card Integration
```typescript
// Connect to Zustand store
- [ ] Call playCard() action on tap
- [ ] Handle success: animate card to board
- [ ] Handle error: shake animation + message
- [ ] Update hand after card played
- [ ] Test full play cycle
```

#### Day 6: AI Player Display
```typescript
// src/components/Player/AIPlayerDisplay.tsx
- [ ] Display AI name + card count
- [ ] Show mini fan of card backs
- [ ] Position in top corners
- [ ] Scale appropriately
- [ ] Show difficulty level (Easy/Hard)
```

#### Day 7: Current Player Indicator
- [ ] Highlight active player
- [ ] Glow/border effect
- [ ] Animate turn changes
- [ ] Clear visual distinction
- [ ] Test with 2-4 players

**Week 3 Deliverable:**
- Playable hand with fan layout
- Tap to play working
- Valid move hints (Easy mode)
- AI players visually represented

---

## Week 4: Game Flow & State Management

### Goals
- Full game loop in UI
- AI turn processing
- Turn management
- Game state synchronization

### Tasks

#### Day 1: Game Screen Layout
```typescript
// src/screens/GameScreen.tsx
- [ ] 70% board area (top)
- [ ] 30% hand area (bottom)
- [ ] AI players in corners
- [ ] Game mode badge
- [ ] Current player indicator
- [ ] Pause/menu button
```

#### Day 2: Game Initialization
- [ ] Connect to initializeGame()
- [ ] Connect to dealCards()
- [ ] Animate card dealing
- [ ] Set up initial game state
- [ ] Test with different player configs

#### Day 3: Turn Management
- [ ] Display current turn
- [ ] Enable/disable hand based on turn
- [ ] Process AI turns automatically
- [ ] Add delay for AI actions (realistic pacing)
- [ ] Turn change animations

#### Day 4: AI Turn Processing
```typescript
// AI turn flow
- [ ] Call processAITurn() from store
- [ ] Get AI decision
- [ ] Animate AI card movement
- [ ] Update board
- [ ] Advance to next turn
- [ ] Add 1-2 second delay for realism
```

#### Day 5: Cannot Play Detection
- [ ] Detect when current player has no valid moves
- [ ] Show "Cannot Play" modal
- [ ] Auto-detect vs manual button (based on design)
- [ ] Confirmation flow
- [ ] Trigger card transfer

#### Day 6: Card Transfer UI
- [ ] Modal for previous player
- [ ] "Choose card to give [Player]"
- [ ] Show their hand
- [ ] Select card
- [ ] Animate transfer (card arc across screen)
- [ ] Add to recipient's hand

#### Day 7: Integration Testing
- [ ] Play full game human vs AI
- [ ] Test all game flows
- [ ] Test Cannot Play scenario
- [ ] Test win condition
- [ ] Bug fixes

**Week 4 Deliverable:**
- Complete game loop functional
- AI opponents playing
- Cannot Play + Card Transfer working
- Game playable end-to-end

---

## Week 5: Sound, Modals & Polish

### Goals
- Sound effects system
- Game end screen
- Statistics display
- Error handling

### Tasks

#### Day 1: Sound System
```typescript
// src/services/soundManager.ts
- [ ] Preload all sound effects
- [ ] Create playSound() utility
- [ ] Card slide sound on play
- [ ] Card place sound on board
- [ ] Shuffle sound on deal
- [ ] Error sound on invalid move
- [ ] Mute toggle
```

#### Day 2: Cannot Play Modal
```typescript
// src/components/UI/CannotPlayModal.tsx
- [ ] Design modal layout
- [ ] Message: "No valid moves"
- [ ] "Take card from [Player]" button
- [ ] Notification to previous player
- [ ] Close on card transfer complete
```

#### Day 3: Card Transfer Modal
```typescript
// src/components/UI/CardTransferModal.tsx
- [ ] Show previous player's hand
- [ ] "[Player] cannot play - give them a card"
- [ ] Select card interaction
- [ ] Confirm button
- [ ] Transfer animation trigger
```

#### Day 4: Game End Screen
```typescript
// src/components/UI/GameEndModal.tsx
- [ ] Full rankings display (1st, 2nd, 3rd, 4th)
- [ ] Winner announcement
- [ ] Game statistics:
  - Total turns
  - Time elapsed
  - Cards transferred
- [ ] Play Again button
- [ ] New Game button
- [ ] Back to Home button
```

#### Day 5: Error Handling & Feedback
- [ ] Invalid move messages
- [ ] Connection error handling (future)
- [ ] Graceful error recovery
- [ ] User-friendly error messages
- [ ] Toast/snackbar notifications

#### Day 6: Visual Polish
- [ ] Card shadows and depth
- [ ] Smooth transitions between states
- [ ] Loading states
- [ ] Button hover states (web)
- [ ] Touch feedback (mobile)

#### Day 7: Performance Optimization
- [ ] Optimize re-renders
- [ ] Memoize expensive calculations
- [ ] Test on mid-range devices
- [ ] Check memory usage
- [ ] Frame rate monitoring

**Week 5 Deliverable:**
- Sound effects working
- All modals complete
- Game end experience polished
- Performance optimized

---

## Week 6: Screens & Tutorial

### Goals
- Home screen
- Setup screen
- Interactive tutorial system

### Tasks

#### Day 1: Home Screen
```typescript
// src/screens/HomeScreen.tsx
- [ ] App title/logo
- [ ] "Play" button
- [ ] "Tutorial" button
- [ ] "Rules" button (simple modal)
- [ ] Background (felt table)
- [ ] Simple, welcoming design
```

#### Day 2-3: Setup Screen
```typescript
// src/screens/SetupScreen.tsx
- [ ] Player name input
- [ ] Number of players (2-4)
- [ ] AI opponent selection:
  - None, Easy AI, Hard AI
  - Multiple AI selection
- [ ] Game mode toggle (Easy/Hard)
- [ ] Mode descriptions
- [ ] "Start Game" button
- [ ] Validation (at least 2 players)
```

#### Day 4-5: Tutorial System
```typescript
// src/components/Tutorial/TutorialOverlay.tsx
- [ ] Overlay system (dims background)
- [ ] Highlight specific UI elements
- [ ] Tooltip component
- [ ] Step progression
- [ ] Progress indicator (3 of 10)
- [ ] Next/Skip buttons
- [ ] Can be dismissed and replayed
```

#### Day 6: Tutorial Steps
```typescript
// Tutorial content
- [ ] Step 1: Welcome + objective
- [ ] Step 2: Board explanation
- [ ] Step 3: Playing 7♠
- [ ] Step 4: Extending sequences
- [ ] Step 5: Spades Lock rule
- [ ] Step 6: Cannot Play scenario
- [ ] Step 7: Game modes (Easy/Hard)
- [ ] Step 8: Practice game
- [ ] Step 9: Completion
- [ ] First launch detection
```

#### Day 7: Tutorial Testing
- [ ] Test full tutorial flow
- [ ] Test skip functionality
- [ ] Test replay from menu
- [ ] Ensure clear explanations
- [ ] User experience testing

**Week 6 Deliverable:**
- Complete Home screen
- Functional Setup screen
- Interactive tutorial system
- First-launch experience

---

## Week 7: Cross-Platform Testing & Refinement

### Goals
- Test on all platforms
- Fix platform-specific bugs
- Responsive design verification
- Performance tuning

### Tasks

#### Day 1: iOS Testing
- [ ] Test on iOS simulator (iPhone)
- [ ] Test on iOS simulator (iPad)
- [ ] Test on physical device if available
- [ ] Check touch targets
- [ ] Check safe area insets
- [ ] Fix iOS-specific issues

#### Day 2: Android Testing
- [ ] Test on Android emulator (phone)
- [ ] Test on Android emulator (tablet)
- [ ] Test on physical device if available
- [ ] Check back button behavior
- [ ] Check status bar
- [ ] Fix Android-specific issues

#### Day 3: Web Testing
- [ ] Test in Chrome
- [ ] Test in Safari
- [ ] Test in Firefox
- [ ] Mouse interaction verification
- [ ] Keyboard shortcuts (optional)
- [ ] Responsive breakpoints

#### Day 4: Landscape Orientation Testing
- [ ] Test various aspect ratios
- [ ] Test on different screen sizes
- [ ] Portrait warning message
- [ ] Rotation lock working
- [ ] Responsive scaling

#### Day 5: Game Logic Edge Cases
- [ ] Test with 2 players
- [ ] Test with 3 players
- [ ] Test with 4 players
- [ ] Test all AI combinations
- [ ] Test Easy mode vs Hard mode
- [ ] Test Spades Lock scenarios
- [ ] Test Cannot Play scenarios

#### Day 6: Performance Testing
- [ ] Frame rate monitoring
- [ ] Memory leak checks
- [ ] Long game sessions
- [ ] Multiple game replays
- [ ] Animation smoothness
- [ ] Sound playback

#### Day 7: Bug Bash
- [ ] Fix all discovered bugs
- [ ] Address edge cases
- [ ] Refinement of animations
- [ ] UX improvements
- [ ] Code cleanup

**Week 7 Deliverable:**
- All platforms tested and working
- Bugs fixed
- Performance optimized
- Ready for polish

---

## Week 8: Final Polish & Documentation

### Goals
- Final UI polish
- App icon and splash screen
- Documentation
- Build preparation

### Tasks

#### Day 1: Visual Polish
- [ ] Consistent spacing throughout
- [ ] Color consistency check
- [ ] Font sizes optimized
- [ ] Animation timing refinement
- [ ] Shadows and depth consistent

#### Day 2: Accessibility Basics
- [ ] Button labels for screen readers
- [ ] Sufficient touch target sizes (44x44)
- [ ] Color contrast check
- [ ] Text scaling support
- [ ] Focus indicators

#### Day 3: App Icon & Splash Screen
- [ ] Design app icon (1024x1024)
- [ ] Generate all icon sizes
- [ ] Create splash screen
- [ ] Update app.json
- [ ] Test on all platforms

#### Day 4: Phase 2 Documentation
```markdown
- [ ] PHASE_2_SUMMARY.md
  - What was built
  - Architecture decisions
  - Component breakdown
  - Known limitations
  - Future improvements
- [ ] Update README.md
- [ ] Update QUICK_START.md
```

#### Day 5: Code Cleanup
- [ ] Remove console.logs
- [ ] Remove dead code
- [ ] Organize imports
- [ ] Add missing TypeScript types
- [ ] Code comments for complex logic
- [ ] Format all files

#### Day 6: Build & Test
- [ ] Build iOS app (simulator)
- [ ] Build Android APK
- [ ] Build web version
- [ ] Test all builds
- [ ] Verify no errors

#### Day 7: Final Review & Handoff
- [ ] Final walkthrough of app
- [ ] Verify all Phase 2 requirements met
- [ ] Documentation complete
- [ ] Plan Phase 3 (accounts, profiles, history)
- [ ] Celebrate completion!

**Week 8 Deliverable:**
- Phase 2 COMPLETE
- Fully functional UI/UX
- Tested on iOS, Android, Web
- Documentation complete
- Ready for Phase 3 planning

---

## Success Criteria (Definition of Done)

### Functionality
- ✅ Complete game playable from start to finish
- ✅ All game rules enforced (via Phase 1 engine)
- ✅ AI opponents working (Easy & Hard)
- ✅ Game modes working (Easy & Hard)
- ✅ Cannot Play scenario handling
- ✅ Card transfer working
- ✅ Win detection and rankings
- ✅ Play again functionality

### UI/UX
- ✅ Classic card game aesthetic
- ✅ Green felt table background
- ✅ Realistic card images
- ✅ 4 horizontal suit rows
- ✅ Fan layout for player hand
- ✅ Tap to play interaction
- ✅ Smooth animations (60fps)
- ✅ Sound effects
- ✅ Valid move hints (Easy mode)

### Screens & Flow
- ✅ Home screen
- ✅ Setup screen (player config)
- ✅ Game screen
- ✅ Interactive tutorial
- ✅ Game end screen with stats
- ✅ Navigation working

### Cross-Platform
- ✅ Works on iOS (simulator + device)
- ✅ Works on Android (emulator + device)
- ✅ Works on Web (modern browsers)
- ✅ Landscape orientation locked
- ✅ Unified design across platforms

### Performance
- ✅ Smooth animations (target 60fps)
- ✅ No memory leaks
- ✅ Quick load times
- ✅ Responsive interactions (<100ms)

### Code Quality
- ✅ TypeScript strict mode (no any)
- ✅ Components well-organized
- ✅ Proper state management
- ✅ Clean code (no warnings)
- ✅ Documented complex logic

---

## Risk Management

### Potential Challenges

#### 1. Card Image Assets
**Risk:** Finding or creating 52 high-quality card images
**Mitigation:**
- Option A: Use royalty-free card deck images (search online)
- Option B: Use SVG library (react-native-svg-playing-cards)
- Option C: Commission designer for custom deck
- Option D: Use emoji/unicode suit symbols temporarily

#### 2. Animation Performance
**Risk:** Animations may be slow on older devices
**Mitigation:**
- Use React Native Reanimated (native thread)
- Test early on mid-range devices
- Provide reduced motion option
- Optimize re-renders

#### 3. Landscape Orientation
**Risk:** Different aspect ratios across devices
**Mitigation:**
- Design for 16:9 ratio (most common)
- Test on various simulators
- Use responsive scaling
- Set minimum supported size

#### 4. Sound Effects
**Risk:** Finding appropriate card sounds
**Mitigation:**
- Use freesound.org or similar
- Record custom sounds (paper cards)
- Option to mute always available
- Not critical for MVP

#### 5. Tutorial Complexity
**Risk:** Tutorial may be hard to build
**Mitigation:**
- Start simple (just text overlays)
- Iterate on complexity
- Can be simplified if needed
- Not blocking for core gameplay

---

## Phase 3 Preview (Future)

After Phase 2 is complete, Phase 3 will add:
- User accounts & authentication
- Player profiles
- Game history tracking
- Statistics dashboard
- Settings screen
- Cloud save (Supabase)

Phase 4: Multiplayer (real-time)
Phase 5: Leaderboards, achievements, streaks

---

## Resources & References

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [React Navigation](https://reactnavigation.org/)

### Assets
- Freesound.org (sound effects)
- Unsplash/Pexels (textures)
- Figma (design mockups - optional)

### Testing
- iOS Simulator (Xcode)
- Android Emulator (Android Studio)
- Expo Go app (physical device testing)

---

## Notes

- All Phase 1 game logic remains untouched
- UI is a pure layer on top of existing engine
- No changes to test suite
- Design decisions documented in UI_DESIGN_DECISIONS.md

---

**Phase 2 Plan Status:** ✅ Ready to Begin

**Next Action:** Start Week 1, Day 1 - Install dependencies and set up project structure

