/**
 * Theme System - Central export for all design tokens
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './animations';

import { COLORS } from './colors';
import { SPACING, BORDER_RADIUS, LAYOUT } from './spacing';
import { FONTS, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS, TEXT_STYLES } from './typography';
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  SPRING_CONFIGS,
  ANIMATION_VALUES,
  STAGGER_DELAY,
} from './animations';

/**
 * Complete theme object
 * Import this for full theme access
 */
export const theme = {
  colors: COLORS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  layout: LAYOUT,
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  fontWeights: FONT_WEIGHTS,
  lineHeights: LINE_HEIGHTS,
  textStyles: TEXT_STYLES,
  animationDuration: ANIMATION_DURATION,
  animationEasing: ANIMATION_EASING,
  springConfigs: SPRING_CONFIGS,
  animationValues: ANIMATION_VALUES,
  staggerDelay: STAGGER_DELAY,
};

export type Theme = typeof theme;
