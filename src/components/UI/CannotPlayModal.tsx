import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal, Button } from './';
import { COLORS, SPACING, TEXT_STYLES } from '../../theme';

export interface CannotPlayModalProps {
  visible: boolean;
  playerName: string;
  onAcknowledge: () => void;
}

/**
 * CannotPlayModal Component
 * Shows when a player cannot make a valid move
 */
export const CannotPlayModal: React.FC<CannotPlayModalProps> = ({
  visible,
  playerName,
  onAcknowledge,
}) => {
  return (
    <Modal visible={visible} title="Cannot Play" showCloseButton={false}>
      <View style={styles.content}>
        <Text style={styles.message}>
          {playerName} has no valid moves!
        </Text>
        <Text style={styles.subMessage}>
          They must take a card from the previous player.
        </Text>
      </View>

      <Button
        title="Continue"
        onPress={onAcknowledge}
        variant="primary"
        fullWidth
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  message: {
    ...TEXT_STYLES.h3,
    color: COLORS.uiTextDark,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subMessage: {
    ...TEXT_STYLES.body,
    color: COLORS.uiTextMuted,
    textAlign: 'center',
  },
});
