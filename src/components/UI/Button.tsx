import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TEXT_STYLES, BORDER_RADIUS } from '../../theme';

export interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * Button Component
 * Reusable button for game actions
 */
export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyle}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.cardWhite} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primary: {
    backgroundColor: COLORS.easyMode,
  },
  secondary: {
    backgroundColor: COLORS.feltGreenLight,
  },
  danger: {
    backgroundColor: COLORS.hardMode,
  },
  disabled: {
    backgroundColor: COLORS.uiTextMuted,
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    ...TEXT_STYLES.button,
    color: COLORS.cardWhite,
  },
});
