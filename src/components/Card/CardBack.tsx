import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export interface CardBackProps {
  size?: 'small' | 'medium' | 'large';
}

/**
 * CardBack Component
 * Displays the back of a playing card (for AI opponents)
 */
export const CardBack: React.FC<CardBackProps> = ({ size = 'medium' }) => {
  const cardSizeStyle = sizeStyles[size];

  return (
    <View style={[styles.cardBack, cardSizeStyle.card]}>
      {/* Decorative pattern */}
      <View style={styles.pattern}>
        <View style={styles.patternLine} />
        <View style={[styles.patternLine, styles.patternLineHorizontal]} />
        <View style={styles.patternCircle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardBack: {
    backgroundColor: COLORS.cardBack,
    borderRadius: BORDER_RADIUS.card,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: COLORS.cardWhite,
    overflow: 'hidden',
  },
  pattern: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  patternLine: {
    position: 'absolute',
    width: 2,
    height: '80%',
    backgroundColor: COLORS.cardWhite,
    opacity: 0.3,
  },
  patternLineHorizontal: {
    width: '80%',
    height: 2,
  },
  patternCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.cardWhite,
    opacity: 0.3,
  },
});

// Size-specific styles
const sizeStyles = {
  small: StyleSheet.create({
    card: {
      width: 50,
      height: 70,
    },
  }),
  medium: StyleSheet.create({
    card: {
      width: 80,
      height: 112,
    },
  }),
  large: StyleSheet.create({
    card: {
      width: 100,
      height: 140,
    },
  }),
};
