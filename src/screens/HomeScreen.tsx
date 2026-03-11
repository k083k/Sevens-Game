import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, TEXT_STYLES } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sevens</Text>
      <Text style={styles.subtitle}>Classic Card Game</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Setup')}
        >
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            // TODO: Navigate to tutorial
            console.log('Tutorial coming soon');
          }}
        >
          <Text style={styles.buttonText}>Tutorial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            // TODO: Show rules modal
            console.log('Rules coming soon');
          }}
        >
          <Text style={styles.buttonText}>Rules</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Phase 2 - UI Development</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.feltGreen,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  title: {
    ...TEXT_STYLES.h1,
    color: COLORS.cardWhite,
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.cardWhite,
    opacity: 0.9,
    marginBottom: SPACING.xxxl,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.cardWhite,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: COLORS.feltGreenLight,
  },
  buttonText: {
    ...TEXT_STYLES.h3,
    color: COLORS.feltGreenDark,
  },
  footer: {
    ...TEXT_STYLES.caption,
    color: COLORS.cardWhite,
    opacity: 0.6,
    marginTop: SPACING.xxxl,
    position: 'absolute',
    bottom: SPACING.lg,
  },
});
