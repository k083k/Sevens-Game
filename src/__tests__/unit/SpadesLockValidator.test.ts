/**
 * Unit tests for SpadesLockValidator - THE MOST CRITICAL RULE
 */

import { SpadesLockValidator } from '../../game/engine/SpadesLockValidator';
import { Board } from '../../game/models/Board';
import { Card } from '../../game/models/Card';
import { Suit } from '../../game/types/types';

describe('SpadesLockValidator', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('isUnlocked - Spades always plays freely', () => {
    it('should allow any spades card regardless of board state (sequence permitting)', () => {
      // Spades is never locked by the spades lock rule
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.SPADES, 1), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.SPADES, 7), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.SPADES, 13), board)).toBe(true);
    });

    it('should allow all spades cards even when spades sequence is limited', () => {
      board.playCard(new Card(Suit.SPADES, 7));

      // All spades cards are unlocked (though only 6 and 8 can be placed by sequence rules)
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.SPADES, 1), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.SPADES, 6), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.SPADES, 8), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.SPADES, 13), board)).toBe(true);
    });
  });

  describe('isUnlocked - Before any spades are played', () => {
    it('should lock all non-spades cards before 7♠ is played', () => {
      // Before spades is opened, only 7s are unlocked (and spades always unlocked)
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 6), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 8), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 1), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.CLUBS, 13), board)).toBe(false);
    });

    it('should unlock 7s in all suits (since 7♠ will be played first)', () => {
      // All 7s are unlocked from the start (7♠ is always first card played)
      board.playCard(new Card(Suit.SPADES, 7)); // First move

      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 7), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 7), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.CLUBS, 7), board)).toBe(true);
    });
  });

  describe('isUnlocked - After 7♠ is played', () => {
    beforeEach(() => {
      board.playCard(new Card(Suit.SPADES, 7)); // Open spades
    });

    it('should unlock only rank 7 in other suits', () => {
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 7), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 7), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.CLUBS, 7), board)).toBe(true);
    });

    it('should lock rank 6 in other suits (not on spades yet)', () => {
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 6), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 6), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.CLUBS, 6), board)).toBe(false);
    });

    it('should lock rank 8 in other suits (not on spades yet)', () => {
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 8), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 8), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.CLUBS, 8), board)).toBe(false);
    });
  });

  describe('isUnlocked - Extending upward from 7♠', () => {
    beforeEach(() => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.SPADES, 8));
      board.playCard(new Card(Suit.SPADES, 9));
      // Spades now: 7-8-9
    });

    it('should unlock ranks 7, 8, 9 in other suits', () => {
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 7), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 8), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 9), board)).toBe(true);

      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 7), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 8), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 9), board)).toBe(true);
    });

    it('should lock rank 10 in other suits (not on spades yet)', () => {
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 10), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 10), board)).toBe(false);
    });

    it('should lock rank 6 in other suits (not on spades yet)', () => {
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 6), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.CLUBS, 6), board)).toBe(false);
    });
  });

  describe('isUnlocked - Extending downward from 7♠', () => {
    beforeEach(() => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.SPADES, 6));
      board.playCard(new Card(Suit.SPADES, 5));
      board.playCard(new Card(Suit.SPADES, 4));
      // Spades now: 4-5-6-7
    });

    it('should unlock ranks 4, 5, 6, 7 in other suits', () => {
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 4), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 5), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 6), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 7), board)).toBe(true);
    });

    it('should lock rank 3 in other suits (not on spades yet)', () => {
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 3), board)).toBe(false);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 3), board)).toBe(false);
    });

    it('should lock rank 8 in other suits (not on spades yet)', () => {
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 8), board)).toBe(false);
    });
  });

  describe('isUnlocked - Extending in both directions', () => {
    beforeEach(() => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.SPADES, 8));
      board.playCard(new Card(Suit.SPADES, 6));
      board.playCard(new Card(Suit.SPADES, 9));
      board.playCard(new Card(Suit.SPADES, 5));
      // Spades now: 5-6-7-8-9
    });

    it('should unlock all ranks in the spades range', () => {
      const unlockedRanks = [5, 6, 7, 8, 9];
      for (const rank of unlockedRanks) {
        expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, rank as any), board)).toBe(
          true
        );
        expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, rank as any), board)).toBe(
          true
        );
        expect(SpadesLockValidator.isUnlocked(new Card(Suit.CLUBS, rank as any), board)).toBe(
          true
        );
      }
    });

    it('should lock ranks outside the spades range', () => {
      const lockedRanks = [1, 2, 3, 4, 10, 11, 12, 13];
      for (const rank of lockedRanks) {
        expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, rank as any), board)).toBe(
          false
        );
      }
    });
  });

  describe('isUnlocked - Complete spades sequence (Ace to King)', () => {
    beforeEach(() => {
      // Play entire spades sequence
      board.playCard(new Card(Suit.SPADES, 7));
      for (let rank = 6; rank >= 1; rank--) {
        board.playCard(new Card(Suit.SPADES, rank as any));
      }
      for (let rank = 8; rank <= 13; rank++) {
        board.playCard(new Card(Suit.SPADES, rank as any));
      }
      // Spades now: A-2-3-4-5-6-7-8-9-10-J-Q-K
    });

    it('should unlock all ranks in all other suits', () => {
      for (let rank = 1; rank <= 13; rank++) {
        expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, rank as any), board)).toBe(
          true
        );
        expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, rank as any), board)).toBe(
          true
        );
        expect(SpadesLockValidator.isUnlocked(new Card(Suit.CLUBS, rank as any), board)).toBe(
          true
        );
      }
    });
  });

  describe('getLockReason', () => {
    beforeEach(() => {
      board.playCard(new Card(Suit.SPADES, 7));
    });

    it('should return null for unlocked cards', () => {
      expect(SpadesLockValidator.getLockReason(new Card(Suit.SPADES, 8), board)).toBeNull();
      expect(SpadesLockValidator.getLockReason(new Card(Suit.HEARTS, 7), board)).toBeNull();
    });

    it('should return reason for locked cards', () => {
      const reason = SpadesLockValidator.getLockReason(new Card(Suit.HEARTS, 8), board);
      expect(reason).toContain('8♥');
      expect(reason).toContain('Spades');
    });
  });

  describe('getUnlockedRanks', () => {
    it('should return all ranks for spades', () => {
      const ranks = SpadesLockValidator.getUnlockedRanks(Suit.SPADES, board);
      expect(ranks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    });

    it('should return only [7] for other suits before spades is opened', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      const heartsRanks = SpadesLockValidator.getUnlockedRanks(Suit.HEARTS, board);
      expect(heartsRanks).toEqual([7]);
    });

    it('should return unlocked range after spades extends', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.SPADES, 8));
      board.playCard(new Card(Suit.SPADES, 6));

      const heartsRanks = SpadesLockValidator.getUnlockedRanks(Suit.HEARTS, board);
      expect(heartsRanks).toEqual([6, 7, 8]);
    });
  });

  describe('canOpenSuit', () => {
    beforeEach(() => {
      board.playCard(new Card(Suit.SPADES, 7));
    });

    it('should allow opening any suit with its 7', () => {
      expect(SpadesLockValidator.canOpenSuit(Suit.HEARTS, board)).toBe(true);
      expect(SpadesLockValidator.canOpenSuit(Suit.DIAMONDS, board)).toBe(true);
      expect(SpadesLockValidator.canOpenSuit(Suit.CLUBS, board)).toBe(true);
    });

    it('should not allow opening already open suit', () => {
      board.playCard(new Card(Suit.HEARTS, 7));
      expect(SpadesLockValidator.canOpenSuit(Suit.HEARTS, board)).toBe(false);
    });

    it('should not allow opening spades again', () => {
      expect(SpadesLockValidator.canOpenSuit(Suit.SPADES, board)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle Ace (rank 1) correctly', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      board.playCard(new Card(Suit.SPADES, 6));
      board.playCard(new Card(Suit.SPADES, 5));
      board.playCard(new Card(Suit.SPADES, 4));
      board.playCard(new Card(Suit.SPADES, 3));
      board.playCard(new Card(Suit.SPADES, 2));
      board.playCard(new Card(Suit.SPADES, 1)); // Ace

      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 1), board)).toBe(true);
    });

    it('should handle King (rank 13) correctly', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      for (let rank = 8; rank <= 13; rank++) {
        board.playCard(new Card(Suit.SPADES, rank as any));
      }

      expect(SpadesLockValidator.isUnlocked(new Card(Suit.HEARTS, 13), board)).toBe(true);
    });

    it('should handle Jack (rank 11) and Queen (rank 12) correctly', () => {
      board.playCard(new Card(Suit.SPADES, 7));
      for (let rank = 8; rank <= 12; rank++) {
        board.playCard(new Card(Suit.SPADES, rank as any));
      }

      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 11), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 12), board)).toBe(true);
      expect(SpadesLockValidator.isUnlocked(new Card(Suit.DIAMONDS, 13), board)).toBe(false);
    });
  });
});
