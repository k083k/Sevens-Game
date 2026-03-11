import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Suit } from '../../game/types/types';
import { BoardState } from '../../game/models/Board';
import { Card as CardModel } from '../../game/models/Card';
import { SuitRow } from './SuitRow';
import { SPACING } from '../../theme';

export interface BoardProps {
  boardState: BoardState;
  onCardPress?: (card: CardModel) => void;
}

/**
 * Board Component
 * Displays all 4 suit rows (Spades, Hearts, Diamonds, Clubs)
 */
export const Board: React.FC<BoardProps> = ({ boardState, onCardPress }) => {
  return (
    <View style={styles.container}>
      <SuitRow
        suit={Suit.SPADES}
        lowRank={boardState.spades.low}
        highRank={boardState.spades.high}
        onCardPress={onCardPress}
      />
      <SuitRow
        suit={Suit.HEARTS}
        lowRank={boardState.hearts.low}
        highRank={boardState.hearts.high}
        onCardPress={onCardPress}
      />
      <SuitRow
        suit={Suit.DIAMONDS}
        lowRank={boardState.diamonds.low}
        highRank={boardState.diamonds.high}
        onCardPress={onCardPress}
      />
      <SuitRow
        suit={Suit.CLUBS}
        lowRank={boardState.clubs.low}
        highRank={boardState.clubs.high}
        onCardPress={onCardPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: SPACING.md,
  },
});
