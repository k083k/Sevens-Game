# UI/UX Design Decisions - Sevens Game Phase 2

## Overview
This document captures all design decisions made for the Sevens card game UI/UX implementation. These decisions will guide the Phase 2 development.

**Decision Date:** March 11, 2026
**Target Platforms:** iOS, Android, Web (via Expo/React Native)
**Build Approach:** Single unified codebase for all platforms

---

## Core Design Philosophy

**Theme:** Classic Card Game
- Traditional card game aesthetic with green felt table
- Realistic/photographic playing cards
- Smooth, realistic animations
- Professional and familiar experience

---

## Design Decisions Summary

### 1. Visual Style & Aesthetics

#### Overall Style
**Choice:** Classic Card Game
- Traditional playing card aesthetic
- Felt table background
- Casino/card table vibes
- Familiar and comfortable for card game players

#### Color Scheme
**Choice:** Traditional (Green Table)
- Classic green felt background (#2C5F3F or similar)
- Red and black cards (traditional suits)
- Neutral UI elements (whites, grays for chrome)
- Warm wood tones for table edges/borders (optional)

#### Typography
**Choice:** Sans-Serif (Modern)
- Clean, readable sans-serif fonts
- System fonts: SF Pro (iOS), Roboto (Android), System UI (Web)
- High readability for card ranks and game info
- Modern touch on classic aesthetic

**Font Usage:**
- Card ranks: Bold, large
- Player names: Medium weight
- UI labels: Regular weight
- Game mode indicator: Small caps or uppercase

---

### 2. Layout & Structure

#### Screen Orientation
**Choice:** Landscape Only
- Optimized for horizontal orientation
- Lock rotation to landscape
- Mimics sitting at a real card table
- Better visibility of 4 horizontal card rows
- More natural for card game layout

#### Board Layout
**Choice:** 4 Horizontal Rows
- Traditional layout
- One row per suit: Spades, Hearts, Diamonds, Clubs
- Rows read left-to-right (Ace ← 7 → King)
- Scrollable if needed (though landscape should fit most)
- Clear visual separation between suits

#### Screen Real Estate
**Choice:** Board Dominant (70/30)
- 70% of screen: Game board (4 suit rows)
- 30% of screen: Player hand at bottom
- Maximizes visibility of game state
- Hand area still sufficient for fan layout
- Other players' info in top corners/edges

#### Navigation Structure
**Choice:** Home → Setup → Game
```
1. Home Screen
   - Play button
   - Rules/Tutorial access
   - Settings (future)

2. Setup Screen
   - Player configuration
   - AI opponent selection
   - Game mode selection (Easy/Hard)
   - Start game button

3. Game Screen
   - Main gameplay
   - Pause/quit option
   - Back to setup confirmation
```

---

### 3. Card Design & Display

#### Card Style
**Choice:** Realistic/Photographic
- Photo-realistic playing cards
- Traditional suit designs (♠ ♥ ♦ ♣)
- Proper shadows and depth
- Texture on card face (subtle)
- Card back design for opponents' cards

**Card Specifications:**
- Standard aspect ratio (2.5:3.5 or 5:7)
- High-resolution images for all devices
- Consistent rendering across platforms
- Clear rank and suit visibility

#### Player Hand Display
**Choice:** Fan Layout (Arc)
- Cards arranged in arc/fan shape
- Mimics holding real cards
- All cards visible at once
- Natural spreading effect
- Bottom-center of screen

**Fan Layout Specs:**
- Arc radius: Proportional to screen width
- Card overlap: ~60-70% visible per card
- Selected card: Raises up slightly
- Maximum angle: ~120 degrees for full hand
- Scales gracefully with card count

---

### 4. Interactions & Controls

#### Primary Card Interaction
**Choice:** Tap to Play
- Simple tap on card to play it
- Works on all platforms (mobile + web)
- Immediate, intuitive
- Accessible to all users

**Interaction Flow:**
1. Tap card in hand → Card highlights/raises
2. If valid: Card animates to board position
3. If invalid: Shake animation + error message
4. No extra confirmation needed

#### Valid Move Hints
**Choice:** Visual hints in Easy mode only
- In Easy mode: Highlight playable cards with glow/border
- In Hard mode: No hints (player must determine)
- Toggle-able in settings (future)
- Helps learning players understand rules

#### Cannot Play Interaction
**Choice:** Auto-Detect + Confirm
- Game detects when player has no valid moves
- Shows confirmation modal: "No valid moves - take a card from previous player?"
- Player confirms to proceed
- Notification sent to previous player

**Flow:**
```
Current Player (no valid moves):
  → Auto-detect triggers
  → Modal: "No valid moves available"
  → Button: "Take Card from [Previous Player]"
  → Confirm

Previous Player:
  → Notification: "[Player Name] cannot play - choose a card to give"
  → Shows their hand
  → Taps card to give
  → Card transfers with animation
```

#### Card Transfer Mechanism
**Choice:** AI Auto-Gives (Human)
- **If AI must give:** Instant decision (uses AI strategy)
- **If Human must give:** Modal shows their hand, they select
- Clear indication of who's giving to whom
- Transfer animation shows card path

---

### 5. Animations & Effects

#### Animation Style
**Choice:** Smooth & Realistic
- Card flips, slides, realistic physics
- Natural motion curves (ease-in-out)
- ~300-500ms duration for most animations
- Feels like handling real cards
- 60fps target

#### Animation Library
**Choice:** React Native Reanimated
- Industry standard for React Native
- Runs on native thread (smooth 60fps)
- Complex animations possible
- Best performance across platforms
- Handles gestures well

#### Card Play Effects
**Choice:** Sound Effects + Keep it Simple
- Sound effects for card actions:
  - Card slide/deal sound
  - Card place sound
  - Shuffle sound (deal phase)
  - Error sound (invalid move)
- No visual particle effects (keep it clean)
- No haptic feedback (too much)
- Focus on smooth animation + audio

**Sound Design:**
- Realistic card sounds
- Volume: Moderate, not intrusive
- User can mute in settings
- Preload all sounds for no delay

#### Key Animations
```
Card Play:
  - Pick up: Card raises from hand (100ms)
  - Move: Card slides to board position (400ms, ease-out)
  - Place: Slight settle animation (100ms)

Card Deal:
  - Cards fly from deck to each player (200ms each, staggered)
  - Fan spreads out at end (300ms, elastic)

Card Transfer (Cannot Play):
  - Card leaves giver's hand
  - Arcs across screen
  - Lands in receiver's hand
  - Total: 600ms

Turn Change:
  - Highlight current player (200ms fade-in)
  - Dimming non-current players (200ms fade)
```

---

### 6. Game Information Display

#### Always Visible Information
**Choices:** (Multiple selected)
1. **Player Names & Card Count**
   - Each player: Name + card count
   - Format: "Alice (7)" or "Alice: 7 cards"
   - Positioned around screen edges

2. **Current Turn Indicator**
   - Clear highlight of active player
   - Glow, border, or pulsing effect
   - Arrow or icon pointing to active player
   - Immediate visual clarity

3. **Game Mode (Easy/Hard)**
   - Small badge in corner
   - "Easy Mode" or "Hard Mode"
   - Color-coded (green = easy, red = hard)
   - Always visible as reminder

4. **Valid Move Hints** (Easy mode only)
   - Playable cards glow or have green border
   - Non-playable cards slightly dimmed
   - Only in Easy mode
   - Teaches the rules visually

#### Player Display Layout (Landscape)
```
┌─────────────────────────────────────────────┐
│ [AI 1]        GAME BOARD (70%)        [AI 2]│
│  (5)              [SPADES ROW]          (7)  │
│                   [HEARTS ROW]               │
│                   [DIAMONDS ROW]             │
│                   [CLUBS ROW]                │
├─────────────────────────────────────────────┤
│         [YOUR HAND - FAN LAYOUT]            │
│         You (8)    [Easy Mode]              │
└─────────────────────────────────────────────┘
```

---

### 7. AI Opponent Representation

#### AI Display Style
**Choice:** Card Back Display
- Show fanned card backs for AI hands
- Positioned at top/sides of screen
- Mimics sitting at a table across from AI
- Card count visible
- More immersive than simple boxes

**AI Display Details:**
- Mini fan of card backs (scaled down)
- Player name + card count label
- Difficulty indicator (Easy/Hard)
- Current turn highlight when it's their turn
- Position: Top-left and top-right corners

---

### 8. Game Flow & Screens

#### Game End Experience
**Choices:** (Multiple selected)

1. **Full Rankings Display**
   - Show complete ranking: 1st, 2nd, 3rd, 4th
   - Player names with placement
   - Visual medals/badges for top 3
   - Clear winner announcement

2. **Play Again Button**
   - Prominent "Play Again" button
   - Same settings (players, mode)
   - Quick rematch flow
   - Option to change settings

3. **Statistics Summary**
   - Game stats displayed:
     - Total turns played
     - Cards transferred
     - Time elapsed
     - Each player's card count at end
   - Optional: Most cards played by one player, etc.

**Game End Modal:**
```
┌───────────────────────────────┐
│    🏆 GAME OVER 🏆           │
│                               │
│  1st Place: Alice             │
│  2nd Place: Bob (Hard AI)     │
│  3rd Place: You               │
│                               │
│  📊 Game Statistics:          │
│  Turns: 47                    │
│  Time: 8:32                   │
│  Cards Transferred: 12        │
│                               │
│  [Play Again] [New Game]     │
│  [Back to Home]              │
└───────────────────────────────┘
```

---

### 9. Tutorial & Help System

#### Tutorial Choice
**Choice:** Interactive Tutorial
- Step-by-step walkthrough on first launch
- Guided learning experience
- Highlights UI elements
- Teaches rules through play
- Can be replayed from menu

**Tutorial Flow:**
```
1. Welcome screen
2. Explain objective (empty hand first)
3. Show board layout (4 suits)
4. Demonstrate playing 7♠ (first move)
5. Explain extending sequences
6. Teach Spades Lock rule (key mechanic)
7. Show Cannot Play scenario
8. Explain Game Mode differences
9. Let them play tutorial game (simplified)
10. Completion + "Ready to play!"
```

**Tutorial Implementation:**
- Overlay system with tooltips
- Dimmed background, highlighted areas
- "Next" and "Skip" buttons
- Progress indicator (step 3 of 10)
- Accessible from settings later

---

### 10. Cross-Platform Strategy

#### Platform Approach
**Choice:** Unified Design
- Same look and feel on iOS, Android, Web
- Consistent brand experience everywhere
- Single design system
- Reduces development complexity
- Strong brand identity

**Platform Considerations:**
- Use React Native's built-in components
- Consistent colors, spacing, typography
- Same navigation patterns
- Responsive to screen sizes (but landscape locked)
- Web: Mouse + keyboard support (secondary)
- Mobile: Touch optimized (primary)

**Responsive Scaling:**
- Cards scale based on screen size
- Fan arc adjusts to screen width
- Font sizes scale proportionally
- Minimum screen size: 480p landscape
- Maximum: 4K (scales up gracefully)

---

## Technical Specifications

### Dependencies to Add
```json
{
  "react-native-reanimated": "^3.x",
  "react-native-gesture-handler": "^2.x",
  "expo-av": "~14.x", // for sound effects
  "@react-navigation/native": "^6.x", // for screen navigation
  "@react-navigation/stack": "^6.x"
}
```

### Asset Requirements

#### Images
- 52 card face images (high-res PNG or SVG)
- 1 card back design
- Felt table background texture
- UI icons (settings, home, back, etc.)
- Tutorial illustration assets

#### Sounds
- Card slide sound (WAV/MP3)
- Card place sound
- Card shuffle sound
- Invalid move sound (error beep)
- Game end sound (victory/completion)

#### Fonts
- System fonts (default)
- Optional: Custom card game font for headers

---

## Design Tokens (Constants)

### Colors
```typescript
export const COLORS = {
  // Table
  feltGreen: '#2C5F3F',
  feltGreenDark: '#1A3D28',

  // Cards
  cardWhite: '#FFFFFF',
  cardBlack: '#1A1A1A',
  cardRed: '#D32F2F',

  // UI Chrome
  uiBackground: '#1A1A1A',
  uiText: '#FFFFFF',
  uiTextMuted: '#999999',

  // Game Mode
  easyMode: '#4CAF50',
  hardMode: '#F44336',

  // Highlights
  validCard: '#4CAF50',
  invalidCard: '#F44336',
  currentTurn: '#FFD700',

  // Shadows
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  shadowLight: 'rgba(0, 0, 0, 0.2)',
};
```

### Spacing
```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### Animation Timing
```typescript
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  transfer: 600,
};
```

### Card Dimensions
```typescript
export const CARD = {
  aspectRatio: 2.5 / 3.5,
  boardWidth: 80, // px (scales with screen)
  handWidth: 100, // px (scales with screen)
  fanOverlap: 0.65, // 65% visible
  fanMaxAngle: 120, // degrees
};
```

---

## Implementation Priorities (Phase 2 Roadmap)

### Week 1: Foundation
- [ ] Set up React Navigation (Home → Setup → Game)
- [ ] Install Reanimated + Gesture Handler
- [ ] Create design tokens file (colors, spacing, etc.)
- [ ] Source/create card images (52 cards + back)
- [ ] Create felt table background component

### Week 2: Core Components
- [ ] Card component (front/back, animations)
- [ ] Board component (4 horizontal rows)
- [ ] Hand component (fan layout)
- [ ] Player info display components
- [ ] Game mode indicator

### Week 3: Interactions
- [ ] Tap to play card interaction
- [ ] Card play animation (hand → board)
- [ ] Valid move highlighting (Easy mode)
- [ ] Cannot play detection + modal
- [ ] Card transfer UI + animation

### Week 4: Screens & Flow
- [ ] Home screen
- [ ] Setup screen (player config, mode selection)
- [ ] Game screen layout
- [ ] Connect to Zustand store
- [ ] Turn management UI

### Week 5: Polish
- [ ] Sound effects integration
- [ ] Game end screen + statistics
- [ ] Play again functionality
- [ ] Error handling + user feedback
- [ ] Responsive scaling testing

### Week 6: Tutorial
- [ ] Interactive tutorial system
- [ ] Tutorial steps implementation
- [ ] First-launch detection
- [ ] Tutorial replay option

### Week 7: Testing & Refinement
- [ ] iOS testing
- [ ] Android testing
- [ ] Web testing
- [ ] Performance optimization
- [ ] Bug fixes

### Week 8: Launch Prep
- [ ] Final polish
- [ ] App icon + splash screen
- [ ] Build for all platforms
- [ ] Phase 2 documentation
- [ ] Ready for Phase 3 planning

---

## Notes & Special Considerations

### Landscape Orientation
- Must handle different landscape ratios (iPad, tablets, phones)
- Rotation lock to landscape
- "Rotate device" message if in portrait

### Notification System
- Cannot Play: Both players need clear notifications
- Turn changes: Visual + optional sound
- Game mode reminders: Subtle but present

### Accessibility (Future Phase)
- Screen reader support
- Larger text option
- High contrast mode
- Color blind friendly indicators

### Performance Targets
- 60fps animations on all devices
- < 100ms interaction response time
- Smooth on devices from 2020+
- Graceful degradation on older devices

---

## Design Sign-Off

**Decisions Approved By:** User
**Date:** March 11, 2026
**Status:** ✅ Ready for Implementation

**Next Step:** Begin Phase 2 development following this specification.

---

## Questions & Clarifications

If any design decisions need adjustment during implementation, document changes here:

1. [Add questions/changes as they arise]

---

**End of Design Specification**
