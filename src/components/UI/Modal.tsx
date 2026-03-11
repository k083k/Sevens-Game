import React from 'react';
import { View, Text, StyleSheet, Modal as RNModal, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, TEXT_STYLES, BORDER_RADIUS } from '../../theme';

export interface ModalProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

/**
 * Modal Component
 * Reusable modal for various game interactions
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {showCloseButton && onClose && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContainer: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    ...TEXT_STYLES.h2,
    color: COLORS.uiTextDark,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.uiTextMuted,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
});
