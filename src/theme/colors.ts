/**
 * Color Design Tokens
 * Classic Card Game Theme - Green Felt Table
 */

export const COLORS = {
  // Table & Background
  feltGreen: '#2C5F3F',
  feltGreenDark: '#1A3D28',
  feltGreenLight: '#3A7F52',

  // Cards
  cardWhite: '#FFFFFF',
  cardBlack: '#1A1A1A',
  cardRed: '#D32F2F',
  cardBack: '#1E3A8A', // Blue card back

  // UI Chrome
  uiBackground: '#1A1A1A',
  uiBackgroundLight: '#2A2A2A',
  uiText: '#FFFFFF',
  uiTextMuted: '#999999',
  uiTextDark: '#1A1A1A',

  // Game Mode Indicators
  easyMode: '#4CAF50',
  easyModeLight: '#81C784',
  hardMode: '#F44336',
  hardModeLight: '#E57373',

  // Game State Highlights
  validCard: '#4CAF50',
  invalidCard: '#F44336',
  currentTurn: '#FFD700',
  selectedCard: '#FFC107',

  // Suit Colors
  spades: '#1A1A1A',
  hearts: '#D32F2F',
  diamonds: '#D32F2F',
  clubs: '#1A1A1A',

  // Shadows
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  shadowMedium: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.15)',

  // Overlay & Modals
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',

  // Borders
  borderLight: '#CCCCCC',
  borderMedium: '#999999',
  borderDark: '#333333',

  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

export type ColorKey = keyof typeof COLORS;
