/**
 * Typography Design Tokens
 * Sans-serif modern typography for readability
 */

import { Platform } from 'react-native';

/**
 * Font families - System fonts for cross-platform consistency
 */
export const FONTS = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'system-ui',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'system-ui',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'system-ui',
  }),
};

/**
 * Font sizes
 */
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

/**
 * Font weights
 */
export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Line heights
 */
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
};

/**
 * Typography styles for common use cases
 */
export const TEXT_STYLES = {
  // Headings
  h1: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.xxxl * LINE_HEIGHTS.tight,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.xxl * LINE_HEIGHTS.tight,
  },
  h3: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.xl * LINE_HEIGHTS.normal,
  },

  // Body text
  body: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.normal,
  },
  bodyLarge: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.normal,
  },
  bodySmall: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
  },

  // Special
  caption: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.normal,
  },
  button: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.tight,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
  },

  // Game-specific
  cardRank: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.xxl * LINE_HEIGHTS.tight,
  },
  playerName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.normal,
  },
  cardCount: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.tight,
  },
};
