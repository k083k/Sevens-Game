import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Modal } from './';
import { COLORS, SPACING, TEXT_STYLES } from '../../theme';
import { ICard } from '../../game/types/types';
import { Card } from '../Card';

export interface CardTransferModalProps {
  visible: boolean;
  fromPlayerName: string;
  toPlayerName: string;
  availableCards: ICard[];
  onSelectCard: (card: ICard) => void;
}

/**
 * CardTransferModal Component
 * Allows a player to select which card to give to another player
 */
export const CardTransferModal: React.FC<CardTransferModalProps> = ({
  visible,
  fromPlayerName,
  toPlayerName,
  availableCards,
  onSelectCard,
}) => {
  return (
    <Modal visible={visible} title="Select Card to Give" showCloseButton={false}>
      <View style={styles.content}>
        <Text style={styles.message}>
          {fromPlayerName}, select a card to give to {toPlayerName}:
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.cardScroll}
          style={styles.scrollView}
        >
          {availableCards.map((card, index) => (
            <TouchableOpacity
              key={`${card.suit}-${card.rank}-${index}`}
              onPress={() => onSelectCard(card)}
              style={styles.cardWrapper}
            >
              <Card
                card={card}
                size="small"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.hint}>
          Tap a card to give it to {toPlayerName}
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  message: {
    ...TEXT_STYLES.body,
    color: COLORS.uiTextDark,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  scrollView: {
    maxHeight: 120,
    width: '100%',
  },
  cardScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  cardWrapper: {
    marginRight: SPACING.xs,
  },
  hint: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.uiTextMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
