/**
 * Unit tests for Board class
 */

import { Board } from '../../game/models/Board';
import { Card } from '../../game/models/Card';
import { Suit } from '../../game/types/types';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    it('should initialize with all suits closed', () => {
      expect(board.isSuitOpen(Suit.SPADES)).toBe(false);
      expect(board.isSuitOpen(Suit.HEARTS)).toBe(false);
      expect(board.isSuitOpen(Suit.DIAMONDS)).toBe(false);
      expect(board.isSuitOpen(Suit.CLUBS)).toBe(false);
    });
  });

  describe('playCard - opening suits with 7s', () => {
    it('should open a suit when playing a 7', () => {
      const card = new Card(Suit.SPADES, 7);
      board.playCard(card);

      expect(board.isSuitOpen(Suit.SPADES)).toBe(true);
      const sequence = board.getSuitSequence(Suit.SPADES);
      expect(sequence.low).toBe(7);
      expect(sequence.high).toBe(7);
    });

    it('should throw error when trying to open an already open suit', () => {
      board.playCard(new Card(Suit.HEARTS, 7));

      expect(() => {
        board.playCard(new Card(Suit.HEARTS, 7));
      }).toThrow();
    });

    it('should allow opening all four suits', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.HEARTS, 7));
      board.playCard(new Card(Suit.DIAMONDS, 7));
      board.playCard(new Card(Suit.CLUBS, 7));

      expect(board.isSuitOpen(Suit.SPADES)).toBe(true);
      expect(board.isSuitOpen(Suit.HEARTS)).toBe(true);
      expect(board.isSuitOpen(Suit.DIAMONDS)).toBe(true);
      expect(board.isSuitOpen(Suit.CLUBS)).toBe(true);
    });
  });

  describe('playCard - extending sequences', () => {
    beforeEach(() => {
      board.playCard(new Card(Suit.SPADES, 7));
    });

    it('should extend sequence upward (7 → 8)', () => {
      board.playCard(new Card(Suit.SPADES, 8));
      const sequence = board.getSuitSequence(Suit.SPADES);
      expect(sequence.low).toBe(7);
      expect(sequence.high).toBe(8);
    });

    it('should extend sequence downward (7 → 6)', () => {
      board.playCard(new Card(Suit.SPADES, 6));
      const sequence = board.getSuitSequence(Suit.SPADES);
      expect(sequence.low).toBe(6);
      expect(sequence.high).toBe(7);
    });

    it('should extend sequence in both directions', () => {
      board.playCard(new Card(Suit.SPADES, 8));
      board.playCard(new Card(Suit.SPADES, 6));
      board.playCard(new Card(Suit.SPADES, 9));
      board.playCard(new Card(Suit.SPADES, 5));

      const sequence = board.getSuitSequence(Suit.SPADES);
      expect(sequence.low).toBe(5);
      expect(sequence.high).toBe(9);
    });

    it('should throw error when playing non-adjacent card', () => {
      expect(() => {
        board.playCard(new Card(Suit.SPADES, 10)); // Skip 8 and 9
      }).toThrow();
    });

    it('should throw error when playing card on closed suit', () => {
      expect(() => {
        board.playCard(new Card(Suit.HEARTS, 6)); // Hearts not open
      }).toThrow();
    });
  });

  describe('isRankOnSpades', () => {
    it('should return false for non-7 ranks when spades not open', () => {
      expect(board.isRankOnSpades(1)).toBe(false);
      expect(board.isRankOnSpades(6)).toBe(false);
      expect(board.isRankOnSpades(8)).toBe(false);
      expect(board.isRankOnSpades(13)).toBe(false);
    });

    it('should return true for rank 7 even when spades not open (7♠ always first)', () => {
      // Before spades is opened, rank 7 is considered "on spades"
      // because 7♠ will be the first card played
      expect(board.isRankOnSpades(7)).toBe(true);
    });

    it('should return true for rank 7 when only 7♠ is played', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      expect(board.isRankOnSpades(7)).toBe(true);
    });

    it('should return false for ranks not on spades sequence', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      expect(board.isRankOnSpades(6)).toBe(false);
      expect(board.isRankOnSpades(8)).toBe(false);
    });

    it('should return true for all ranks in spades sequence', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.SPADES, 8));
      board.playCard(new Card(Suit.SPADES, 9));
      board.playCard(new Card(Suit.SPADES, 6));
      board.playCard(new Card(Suit.SPADES, 5));

      expect(board.isRankOnSpades(5)).toBe(true);
      expect(board.isRankOnSpades(6)).toBe(true);
      expect(board.isRankOnSpades(7)).toBe(true);
      expect(board.isRankOnSpades(8)).toBe(true);
      expect(board.isRankOnSpades(9)).toBe(true);

      expect(board.isRankOnSpades(4)).toBe(false);
      expect(board.isRankOnSpades(10)).toBe(false);
    });
  });

  describe('canPlaceCard', () => {
    it('should return true for a 7 when suit is closed', () => {
      expect(board.canPlaceCard(new Card(Suit.HEARTS, 7))).toBe(true);
    });

    it('should return false for a 7 when suit is already open', () => {
      board.playCard(new Card(Suit.HEARTS, 7));
      expect(board.canPlaceCard(new Card(Suit.HEARTS, 7))).toBe(false);
    });

    it('should return false for non-7 when suit is closed', () => {
      expect(board.canPlaceCard(new Card(Suit.HEARTS, 6))).toBe(false);
    });

    it('should return true for adjacent card', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      expect(board.canPlaceCard(new Card(Suit.SPADES, 8))).toBe(true);
      expect(board.canPlaceCard(new Card(Suit.SPADES, 6))).toBe(true);
    });

    it('should return false for non-adjacent card', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      expect(board.canPlaceCard(new Card(Suit.SPADES, 9))).toBe(false);
      expect(board.canPlaceCard(new Card(Suit.SPADES, 5))).toBe(false);
    });
  });

  describe('getRanksInSuit', () => {
    it('should return empty array for closed suit', () => {
      expect(board.getRanksInSuit(Suit.HEARTS)).toEqual([]);
    });

    it('should return [7] when only 7 is played', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      expect(board.getRanksInSuit(Suit.SPADES)).toEqual([7]);
    });

    it('should return all ranks in sequence', () => {
      board.playCard(new Card(Suit.DIAMONDS, 7));
      board.playCard(new Card(Suit.DIAMONDS, 8));
      board.playCard(new Card(Suit.DIAMONDS, 9));
      board.playCard(new Card(Suit.DIAMONDS, 6));

      expect(board.getRanksInSuit(Suit.DIAMONDS)).toEqual([6, 7, 8, 9]);
    });
  });

  describe('isComplete', () => {
    it('should return false for empty board', () => {
      expect(board.isComplete()).toBe(false);
    });

    it('should return false when only some cards are played', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.SPADES, 8));
      expect(board.isComplete()).toBe(false);
    });

    it('should return true when all 52 cards are played', () => {
      // Open all suits
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.HEARTS, 7));
      board.playCard(new Card(Suit.DIAMONDS, 7));
      board.playCard(new Card(Suit.CLUBS, 7));

      // Complete all sequences
      const suits = [Suit.SPADES, Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS];
      for (const suit of suits) {
        // Down to Ace
        for (let rank = 6; rank >= 1; rank--) {
          board.playCard(new Card(suit, rank as any));
        }
        // Up to King
        for (let rank = 8; rank <= 13; rank++) {
          board.playCard(new Card(suit, rank as any));
        }
      }

      expect(board.isComplete()).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset board to initial state', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.SPADES, 8));
      board.playCard(new Card(Suit.HEARTS, 7));

      board.reset();

      expect(board.isSuitOpen(Suit.SPADES)).toBe(false);
      expect(board.isSuitOpen(Suit.HEARTS)).toBe(false);
      expect(board.isSuitOpen(Suit.DIAMONDS)).toBe(false);
      expect(board.isSuitOpen(Suit.CLUBS)).toBe(false);
    });
  });

  describe('getState', () => {
    it('should return readonly copy of state', () => {
      const state1 = board.getState();
      const state2 = board.getState();

      // Should be different objects (copies)
      expect(state1).not.toBe(state2);
    });

    it('should reflect current board state', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.SPADES, 8));

      const state = board.getState();
      expect(state[Suit.SPADES].low).toBe(7);
      expect(state[Suit.SPADES].high).toBe(8);
    });
  });
});
