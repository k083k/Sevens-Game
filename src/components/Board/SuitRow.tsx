import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Suit, Rank } from '../../game/types/types';
import { Card as CardModel } from '../../game/models/Card';
import { Card } from '../Card';
import { COLORS, SPACING, TEXT_STYLES } from '../../theme';
import { getSuitSymbol, getSuitName, isRedSuit } from '../../utils/cardHelpers';

export interface SuitRowProps {
  suit: Suit;
  lowRank: Rank | null;
  highRank: Rank | null;
  onCardPress?: (card: CardModel) => void;
}

/**
 * SuitRow Component
 * Displays a row for one suit showing cards from low to high
 * Layout: [Ace...] ← [7] → [...King]
 */
export const SuitRow: React.FC<SuitRowProps> = ({
  suit,
  lowRank,
  highRank,
  onCardPress,
}) => {
  const suitSymbol = getSuitSymbol(suit);
  const suitName = getSuitName(suit);
  const suitColor = isRedSuit(suit) ? COLORS.cardRed : COLORS.cardBlack;

  // Generate cards from lowRank to highRank
  const cards: CardModel[] = [];

  if (lowRank !== null && highRank !== null) {
    // Cards extend from 7 in both directions
    for (let rank = lowRank; rank <= highRank; rank++) {
      cards.push(new CardModel(suit, rank as Rank));
    }
  }

  return (
    <View style={styles.container}>
      {/* Suit label */}
      <View style={styles.labelContainer}>
        <Text style={[styles.suitSymbol, { color: suitColor }]}>
          {suitSymbol}
        </Text>
        <Text style={[styles.suitName, { color: suitColor }]}>
          {suitName}
        </Text>
      </View>

      {/* Cards row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Play 7{suitSymbol} to start
            </Text>
          </View>
        ) : (
          cards.map((card) => (
            <View key={`${card.suit}-${card.rank}`} style={styles.cardWrapper}>
              <Card
                card={card}
                onPress={() => onCardPress?.(card)}
                size="small"
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.feltGreenDark,
  },
  labelContainer: {
    width: 80,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  suitSymbol: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  suitName: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '600',
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  cardWrapper: {
    marginRight: SPACING.xs,
  },
  emptyState: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    ...TEXT_STYLES.body,
    color: COLORS.cardWhite,
    opacity: 0.6,
  },
});
