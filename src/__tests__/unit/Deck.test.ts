/**
 * Unit tests for Deck class
 */

import { Deck } from '../../game/models/Deck';
import { Suit } from '../../game/types/types';
import { GAME_CONFIG } from '../../utils/constants';

describe('Deck', () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck();
  });

  describe('constructor', () => {
    it('should create a deck with 52 cards', () => {
      expect(deck.size()).toBe(GAME_CONFIG.DECK_SIZE);
    });

    it('should create a valid deck (no duplicates)', () => {
      expect(deck.validate()).toBe(true);
    });

    it('should contain all four suits', () => {
      const cards = deck.getCards();
      const suits = new Set(cards.map((c) => c.suit));
      expect(suits.size).toBe(4);
      expect(suits.has(Suit.SPADES)).toBe(true);
      expect(suits.has(Suit.HEARTS)).toBe(true);
      expect(suits.has(Suit.DIAMONDS)).toBe(true);
      expect(suits.has(Suit.CLUBS)).toBe(true);
    });

    it('should contain 13 cards per suit', () => {
      const cards = deck.getCards();
      const spades = cards.filter((c) => c.suit === Suit.SPADES);
      const hearts = cards.filter((c) => c.suit === Suit.HEARTS);
      const diamonds = cards.filter((c) => c.suit === Suit.DIAMONDS);
      const clubs = cards.filter((c) => c.suit === Suit.CLUBS);

      expect(spades.length).toBe(GAME_CONFIG.CARDS_PER_SUIT);
      expect(hearts.length).toBe(GAME_CONFIG.CARDS_PER_SUIT);
      expect(diamonds.length).toBe(GAME_CONFIG.CARDS_PER_SUIT);
      expect(clubs.length).toBe(GAME_CONFIG.CARDS_PER_SUIT);
    });

    it('should contain all ranks from 1 to 13', () => {
      const cards = deck.getCards();
      const ranks = new Set(cards.map((c) => c.rank));
      expect(ranks.size).toBe(13);
      for (let rank = 1; rank <= 13; rank++) {
        expect(ranks.has(rank as any)).toBe(true);
      }
    });
  });

  describe('shuffle', () => {
    it('should maintain deck size after shuffling', () => {
      deck.shuffle();
      expect(deck.size()).toBe(GAME_CONFIG.DECK_SIZE);
    });

    it('should maintain deck validity after shuffling', () => {
      deck.shuffle();
      expect(deck.validate()).toBe(true);
    });

    it('should change card order (probabilistic test)', () => {
      const originalOrder = deck.getCards().map((c) => c.toString());
      deck.shuffle();
      const shuffledOrder = deck.getCards().map((c) => c.toString());

      // With 52! possible permutations, the chance of getting the same order is negligible
      expect(originalOrder).not.toEqual(shuffledOrder);
    });
  });

  describe('deal', () => {
    it('should deal correct number of cards for 2 players', () => {
      const hands = deck.deal(2);
      expect(hands.length).toBe(2);
      expect(hands[0].length).toBe(26);
      expect(hands[1].length).toBe(26);
    });

    it('should deal correct number of cards for 3 players', () => {
      const hands = deck.deal(3);
      expect(hands.length).toBe(3);
      const totalCards = hands[0].length + hands[1].length + hands[2].length;
      expect(totalCards).toBe(52);

      // Distribution should be 17, 17, 18 (or some permutation)
      const sizes = hands.map((h) => h.length).sort();
      expect(sizes).toEqual([17, 17, 18]);
    });

    it('should deal correct number of cards for 4 players', () => {
      const hands = deck.deal(4);
      expect(hands.length).toBe(4);
      expect(hands[0].length).toBe(13);
      expect(hands[1].length).toBe(13);
      expect(hands[2].length).toBe(13);
      expect(hands[3].length).toBe(13);
    });

    it('should deal all 52 cards', () => {
      const hands = deck.deal(4);
      const totalCards = hands.reduce((sum, hand) => sum + hand.length, 0);
      expect(totalCards).toBe(52);
    });

    it('should not have duplicate cards across hands', () => {
      const hands = deck.deal(4);
      const allCards = hands.flat();
      const cardStrings = new Set(allCards.map((c) => `${c.suit}-${c.rank}`));
      expect(cardStrings.size).toBe(52);
    });

    it('should throw error for invalid number of players (< 2)', () => {
      expect(() => deck.deal(1)).toThrow();
    });

    it('should throw error for invalid number of players (> 4)', () => {
      expect(() => deck.deal(5)).toThrow();
    });

    it('should shuffle deck before dealing', () => {
      const firstDeal = deck.deal(2);
      const firstCard1 = firstDeal[0][0].toString();

      const secondDeal = deck.deal(2);
      const secondCard1 = secondDeal[0][0].toString();

      // Very unlikely to get the same first card twice (probabilistic)
      expect(firstCard1).not.toBe(secondCard1);
    });
  });

  describe('validate', () => {
    it('should validate a correct deck', () => {
      expect(deck.validate()).toBe(true);
    });
  });

  describe('getCards', () => {
    it('should return a readonly copy', () => {
      const cards1 = deck.getCards();
      const cards2 = deck.getCards();

      // Should be different arrays (copies)
      expect(cards1).not.toBe(cards2);
      // But with the same content
      expect(cards1.length).toBe(cards2.length);
    });
  });
});
