import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, TEXT_STYLES } from '../theme';
import { PlayerType, GameMode } from '../game/types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Setup'>;

export const SetupScreen: React.FC<Props> = ({ navigation }) => {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.EASY);

  const handleStartGame = () => {
    navigation.navigate('Game', {
      gameMode,
      playerCount: 2, // Always 2 players for now (You vs AI)
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Game Setup</Text>

        {/* Game Mode Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Mode</Text>
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                gameMode === GameMode.EASY && styles.optionButtonSelected,
              ]}
              onPress={() => setGameMode(GameMode.EASY)}
            >
              <Text style={styles.optionText}>Easy Mode</Text>
              <Text style={styles.optionDescription}>
                Must play if you have valid cards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                gameMode === GameMode.HARD && styles.optionButtonSelected,
              ]}
              onPress={() => setGameMode(GameMode.HARD)}
            >
              <Text style={styles.optionText}>Hard Mode</Text>
              <Text style={styles.optionDescription}>
                Can pass strategically with valid cards
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>You vs AI Opponent</Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.feltGreen,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    ...TEXT_STYLES.h1,
    color: COLORS.cardWhite,
    marginBottom: SPACING.xl,
  },
  section: {
    width: '100%',
    maxWidth: 600,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.cardWhite,
    marginBottom: SPACING.md,
  },
  optionGroup: {
    gap: SPACING.md,
  },
  optionButton: {
    backgroundColor: COLORS.feltGreenLight,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    borderColor: COLORS.cardWhite,
    backgroundColor: COLORS.feltGreenDark,
  },
  optionText: {
    ...TEXT_STYLES.h3,
    color: COLORS.cardWhite,
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.cardWhite,
    opacity: 0.8,
  },
  infoSection: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  infoText: {
    ...TEXT_STYLES.body,
    color: COLORS.cardWhite,
    opacity: 0.7,
  },
  startButton: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: COLORS.cardWhite,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.xl,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    ...TEXT_STYLES.h2,
    color: COLORS.feltGreenDark,
  },
  backButton: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
  },
  backButtonText: {
    ...TEXT_STYLES.body,
    color: COLORS.cardWhite,
    opacity: 0.8,
  },
});
