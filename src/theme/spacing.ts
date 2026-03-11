/**
 * Spacing Design Tokens
 * Consistent spacing throughout the application
 */

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export type SpacingKey = keyof typeof SPACING;

/**
 * Border Radius values
 */
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999, // Fully rounded
  card: 8, // Standard playing card corner radius
};

/**
 * Component-specific spacing
 */
export const LAYOUT = {
  // Screen padding
  screenPaddingHorizontal: SPACING.lg,
  screenPaddingVertical: SPACING.md,

  // Board layout (70% / 30% split)
  boardHeightPercentage: 0.7,
  handHeightPercentage: 0.3,

  // Card spacing
  cardGap: SPACING.sm,
  cardOverlap: 0.65, // 65% of card visible when overlapped

  // Component spacing
  componentGap: SPACING.md,
  sectionGap: SPACING.xl,
};
