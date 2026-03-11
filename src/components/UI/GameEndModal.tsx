import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal, Button } from './';
import { COLORS, SPACING, TEXT_STYLES } from '../../theme';
import { IPlayer } from '../../game/types/types';

export interface GameEndModalProps {
  visible: boolean;
  players: IPlayer[];
  onPlayAgain: () => void;
  onNewGame: () => void;
  onHome: () => void;
}

/**
 * GameEndModal Component
 * Displays rankings and statistics when game ends
 */
export const GameEndModal: React.FC<GameEndModalProps> = ({
  visible,
  players,
  onPlayAgain,
  onNewGame,
  onHome,
}) => {
  // Sort players by finish order (those who finished first)
  const finishedPlayers = players
    .filter(p => p.finishPosition !== undefined)
    .sort((a, b) => (a.finishPosition || 0) - (b.finishPosition || 0));

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <Modal visible={visible} title="🎉 Game Over!" showCloseButton={false}>
      {/* Rankings */}
      <View style={styles.rankings}>
        {finishedPlayers.map((player) => (
          <View key={player.id} style={styles.rankingRow}>
            <Text style={styles.medal}>{getMedalEmoji(player.finishPosition!)}</Text>
            <Text style={styles.position}>{player.finishPosition}.</Text>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.cardCount}>({player.hand.length} cards)</Text>
          </View>
        ))}
      </View>

      {/* Statistics */}
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>📊 Game Statistics</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Players:</Text>
          <Text style={styles.statValue}>{players.length}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Winner:</Text>
          <Text style={styles.statValue}>{finishedPlayers[0]?.name || 'N/A'}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Play Again"
          onPress={onPlayAgain}
          variant="primary"
          fullWidth
        />
        <Button
          title="New Game"
          onPress={onNewGame}
          variant="secondary"
          fullWidth
        />
        <Button
          title="Back to Home"
          onPress={onHome}
          variant="danger"
          fullWidth
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rankings: {
    marginBottom: SPACING.xl,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  medal: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  position: {
    ...TEXT_STYLES.h3,
    color: COLORS.uiTextDark,
    width: 30,
  },
  playerName: {
    ...TEXT_STYLES.body,
    color: COLORS.uiTextDark,
    flex: 1,
    fontWeight: '600',
  },
  cardCount: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.uiTextMuted,
  },
  stats: {
    backgroundColor: COLORS.feltGreenLight,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xl,
  },
  statsTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.cardWhite,
    marginBottom: SPACING.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  statLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.cardWhite,
  },
  statValue: {
    ...TEXT_STYLES.body,
    color: COLORS.cardWhite,
    fontWeight: '600',
  },
  actions: {
    gap: SPACING.md,
  },
});
