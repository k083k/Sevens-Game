/**
 * Card Helper Functions
 * Utilities for displaying and working with cards
 */

import { Suit, Rank } from '../game/types/types';

/**
 * Get Unicode symbol for suit
 */
export const getSuitSymbol = (suit: Suit): string => {
  switch (suit) {
    case Suit.SPADES:
      return '♠';
    case Suit.HEARTS:
      return '♥';
    case Suit.DIAMONDS:
      return '♦';
    case Suit.CLUBS:
      return '♣';
  }
};

/**
 * Get display string for rank
 */
export const getRankDisplay = (rank: Rank): string => {
  switch (rank) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return rank.toString();
  }
};

/**
 * Get suit name as string
 */
export const getSuitName = (suit: Suit): string => {
  switch (suit) {
    case Suit.SPADES:
      return 'Spades';
    case Suit.HEARTS:
      return 'Hearts';
    case Suit.DIAMONDS:
      return 'Diamonds';
    case Suit.CLUBS:
      return 'Clubs';
  }
};

/**
 * Check if suit is red
 */
export const isRedSuit = (suit: Suit): boolean => {
  return suit === Suit.HEARTS || suit === Suit.DIAMONDS;
};
