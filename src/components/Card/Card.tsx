import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ICard } from '../../game/types/types';
import { COLORS, SPACING, BORDER_RADIUS, TEXT_STYLES } from '../../theme';
import { getSuitSymbol, getRankDisplay, isRedSuit } from '../../utils/cardHelpers';

export interface CardProps {
  card: ICard;
  onPress?: () => void;
  isSelected?: boolean;
  isValid?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Card Component
 * Displays a playing card with suit and rank
 */
export const Card: React.FC<CardProps> = ({
  card,
  onPress,
  isSelected = false,
  isValid = true,
  disabled = false,
  size = 'medium',
}) => {
  const suitSymbol = getSuitSymbol(card.suit);
  const rankDisplay = getRankDisplay(card.rank);
  const isRed = isRedSuit(card.suit);
  const suitColor = isRed ? COLORS.cardRed : COLORS.cardBlack;

  const cardSizeStyle = sizeStyles[size];

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || !onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        cardSizeStyle.card,
        isSelected && styles.cardSelected,
        !isValid && styles.cardInvalid,
        disabled && styles.cardDisabled,
      ]}
    >
      {/* Top left corner */}
      <View style={styles.corner}>
        <Text style={[styles.rank, cardSizeStyle.rank, { color: suitColor }]}>
          {rankDisplay}
        </Text>
        <Text style={[styles.suit, cardSizeStyle.suit, { color: suitColor }]}>
          {suitSymbol}
        </Text>
      </View>

      {/* Center suit symbol */}
      <View style={styles.center}>
        <Text style={[styles.centerSuit, cardSizeStyle.centerSuit, { color: suitColor }]}>
          {suitSymbol}
        </Text>
      </View>

      {/* Bottom right corner (rotated) */}
      <View style={[styles.corner, styles.cornerBottomRight]}>
        <Text style={[styles.rank, cardSizeStyle.rank, { color: suitColor }]}>
          {rankDisplay}
        </Text>
        <Text style={[styles.suit, cardSizeStyle.suit, { color: suitColor }]}>
          {suitSymbol}
        </Text>
      </View>

      {/* Selection indicator */}
      {isSelected && <View style={styles.selectionBorder} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: BORDER_RADIUS.card,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardSelected: {
    borderColor: COLORS.selectedCard,
    borderWidth: 3,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  cardInvalid: {
    opacity: 0.5,
  },
  cardDisabled: {
    opacity: 0.7,
  },
  corner: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    alignItems: 'center',
  },
  cornerBottomRight: {
    top: undefined,
    left: undefined,
    bottom: SPACING.xs,
    right: SPACING.xs,
    transform: [{ rotate: '180deg' }],
  },
  rank: {
    fontWeight: 'bold',
  },
  suit: {
    lineHeight: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSuit: {
    fontWeight: 'bold',
  },
  selectionBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS.card,
    borderWidth: 3,
    borderColor: COLORS.selectedCard,
    pointerEvents: 'none',
  },
});

// Size-specific styles
const sizeStyles = {
  small: StyleSheet.create({
    card: {
      width: 50,
      height: 70,
      padding: SPACING.xs,
    },
    rank: {
      fontSize: 12,
      lineHeight: 14,
    },
    suit: {
      fontSize: 10,
    },
    centerSuit: {
      fontSize: 24,
    },
  }),
  medium: StyleSheet.create({
    card: {
      width: 80,
      height: 112,
      padding: SPACING.sm,
    },
    rank: {
      fontSize: 18,
      lineHeight: 20,
    },
    suit: {
      fontSize: 14,
    },
    centerSuit: {
      fontSize: 40,
    },
  }),
  large: StyleSheet.create({
    card: {
      width: 100,
      height: 140,
      padding: SPACING.md,
    },
    rank: {
      fontSize: 24,
      lineHeight: 26,
    },
    suit: {
      fontSize: 18,
    },
    centerSuit: {
      fontSize: 56,
    },
  }),
};
