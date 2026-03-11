/**
 * Unit tests for Card class
 */

import { Card } from '../../game/models/Card';
import { Suit } from '../../game/types/types';

describe('Card', () => {
  describe('constructor', () => {
    it('should create a card with suit and rank', () => {
      const card = new Card(Suit.SPADES, 7);
      expect(card.suit).toBe(Suit.SPADES);
      expect(card.rank).toBe(7);
    });
  });

  describe('equals', () => {
    it('should return true for identical cards', () => {
      const card1 = new Card(Suit.HEARTS, 10);
      const card2 = new Card(Suit.HEARTS, 10);
      expect(card1.equals(card2)).toBe(true);
    });

    it('should return false for different suits', () => {
      const card1 = new Card(Suit.HEARTS, 10);
      const card2 = new Card(Suit.DIAMONDS, 10);
      expect(card1.equals(card2)).toBe(false);
    });

    it('should return false for different ranks', () => {
      const card1 = new Card(Suit.SPADES, 5);
      const card2 = new Card(Suit.SPADES, 6);
      expect(card1.equals(card2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should display numbered cards correctly', () => {
      const card = new Card(Suit.SPADES, 5);
      expect(card.toString()).toBe('5♠');
    });

    it('should display Ace correctly', () => {
      const card = new Card(Suit.HEARTS, 1);
      expect(card.toString()).toBe('A♥');
    });

    it('should display Jack correctly', () => {
      const card = new Card(Suit.DIAMONDS, 11);
      expect(card.toString()).toBe('J♦');
    });

    it('should display Queen correctly', () => {
      const card = new Card(Suit.CLUBS, 12);
      expect(card.toString()).toBe('Q♣');
    });

    it('should display King correctly', () => {
      const card = new Card(Suit.SPADES, 13);
      expect(card.toString()).toBe('K♠');
    });

    it('should display all suits correctly', () => {
      expect(new Card(Suit.SPADES, 7).toString()).toBe('7♠');
      expect(new Card(Suit.HEARTS, 7).toString()).toBe('7♥');
      expect(new Card(Suit.DIAMONDS, 7).toString()).toBe('7♦');
      expect(new Card(Suit.CLUBS, 7).toString()).toBe('7♣');
    });
  });

  describe('isSeven', () => {
    it('should return true for sevens', () => {
      const card = new Card(Suit.HEARTS, 7);
      expect(card.isSeven()).toBe(true);
    });

    it('should return false for non-sevens', () => {
      const card = new Card(Suit.HEARTS, 8);
      expect(card.isSeven()).toBe(false);
    });
  });

  describe('isSevenOfSpades', () => {
    it('should return true for 7♠', () => {
      const card = new Card(Suit.SPADES, 7);
      expect(card.isSevenOfSpades()).toBe(true);
    });

    it('should return false for other sevens', () => {
      const card = new Card(Suit.HEARTS, 7);
      expect(card.isSevenOfSpades()).toBe(false);
    });

    it('should return false for spades non-seven', () => {
      const card = new Card(Suit.SPADES, 8);
      expect(card.isSevenOfSpades()).toBe(false);
    });
  });
});
