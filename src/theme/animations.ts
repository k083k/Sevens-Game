/**
 * Animation Design Tokens
 * Timing and easing functions for consistent animations
 */

import { Easing } from 'react-native';

/**
 * Animation durations (in milliseconds)
 * Based on smooth & realistic animation style
 */
export const ANIMATION_DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,

  // Specific animations
  cardPickUp: 100,
  cardPlay: 400,
  cardSettle: 100,
  cardTransfer: 600,
  cardDeal: 200,
  cardFlip: 300,
  turnChange: 200,
  modalFade: 250,
  fanSpread: 300,
};

/**
 * Easing functions for animations
 */
export const ANIMATION_EASING = {
  // Basic easing
  linear: Easing.linear,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),

  // Spring-like easing
  elastic: Easing.elastic(1),
  bounce: Easing.bounce,

  // Bezier curves
  smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
  card: Easing.bezier(0.4, 0.0, 0.2, 1), // Material Design standard

  // Specific use cases
  cardPickUp: Easing.out(Easing.cubic),
  cardPlay: Easing.inOut(Easing.cubic),
  cardSettle: Easing.out(Easing.ease),
};

/**
 * Animation spring configs for physics-based animations
 */
export const SPRING_CONFIGS = {
  default: {
    damping: 20,
    mass: 1,
    stiffness: 200,
  },
  gentle: {
    damping: 30,
    mass: 1,
    stiffness: 150,
  },
  wobbly: {
    damping: 10,
    mass: 1,
    stiffness: 200,
  },
  stiff: {
    damping: 20,
    mass: 1,
    stiffness: 300,
  },
  card: {
    damping: 25,
    mass: 0.8,
    stiffness: 250,
  },
};

/**
 * Animation values for common transformations
 */
export const ANIMATION_VALUES = {
  // Scale
  scaleNormal: 1,
  scalePressed: 0.95,
  scaleHovered: 1.05,
  scaleSelected: 1.1,

  // Opacity
  opacityHidden: 0,
  opacityVisible: 1,
  opacityDimmed: 0.5,
  opacitySubtle: 0.7,

  // Card-specific
  cardRaiseHeight: -20, // Pixels to raise selected card
  cardShakeDistance: 5, // Pixels to shake on invalid move
  cardRotationMax: 15, // Degrees for fan layout
};

/**
 * Helper function to create timing config for Reanimated
 */
export const withTimingConfig = (duration: number, easing = ANIMATION_EASING.smooth) => ({
  duration,
  easing,
});

/**
 * Stagger animation delays for sequential animations
 */
export const STAGGER_DELAY = {
  fast: 50,
  normal: 100,
  slow: 150,
  cardDeal: 200, // Delay between dealing cards to each player
};
