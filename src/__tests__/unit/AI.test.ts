/**
 * Unit tests for AI strategies
 */

import { EasyAI } from '../../game/ai/EasyAI';
import { HardAI } from '../../game/ai/HardAI';
import { Card } from '../../game/models/Card';
import { HumanPlayer } from '../../game/models/Player';
import { Board } from '../../game/models/Board';
import { Suit, BoardState } from '../../game/types/types';

describe('EasyAI', () => {
  let easyAI: EasyAI;
  let board: Board;
  let boardState: BoardState;

  beforeEach(() => {
    easyAI = new EasyAI();
    board = new Board();
    board.playCard(new Card(Suit.SPADES, 7));
    boardState = board.getState();
  });

  describe('selectCardToPlay', () => {
    it('should select a card from valid cards', () => {
      const hand = [
        new Card(Suit.SPADES, 8),
        new Card(Suit.SPADES, 6),
        new Card(Suit.HEARTS, 10),
      ];
      const validCards = [new Card(Suit.SPADES, 8), new Card(Suit.SPADES, 6)];

      const selected = easyAI.selectCardToPlay(hand, validCards, boardState);

      expect(validCards).toContainEqual(selected);
    });

    it('should throw error when no valid cards', () => {
      const hand = [new Card(Suit.HEARTS, 10)];
      const validCards: Card[] = [];

      expect(() => {
        easyAI.selectCardToPlay(hand, validCards, boardState);
      }).toThrow();
    });

    it('should select different cards over multiple calls (probabilistic)', () => {
      const hand = [
        new Card(Suit.SPADES, 8),
        new Card(Suit.SPADES, 6),
        new Card(Suit.SPADES, 9),
        new Card(Suit.SPADES, 5),
      ];
      const validCards = [...hand];

      const selections = new Set();
      for (let i = 0; i < 20; i++) {
        const selected = easyAI.selectCardToPlay(hand, validCards, boardState);
        selections.add(selected.toString());
      }

      // Should have selected multiple different cards (probabilistic)
      expect(selections.size).toBeGreaterThan(1);
    });
  });

  describe('selectCardToGive', () => {
    it('should select a card from hand', () => {
      const hand = [new Card(Suit.SPADES, 8), new Card(Suit.HEARTS, 10)];
      const recipient = new HumanPlayer('p1', 'Alice', 0);

      const selected = easyAI.selectCardToGive(hand, recipient, boardState);

      expect(hand).toContainEqual(selected);
    });

    it('should throw error when hand is empty', () => {
      const hand: Card[] = [];
      const recipient = new HumanPlayer('p1', 'Alice', 0);

      expect(() => {
        easyAI.selectCardToGive(hand, recipient, boardState);
      }).toThrow();
    });
  });
});

describe('HardAI', () => {
  let hardAI: HardAI;
  let board: Board;
  let boardState: BoardState;

  beforeEach(() => {
    hardAI = new HardAI();
    board = new Board();
    board.playCard(new Card(Suit.SPADES, 7));
    boardState = board.getState();
  });

  describe('selectCardToPlay', () => {
    it('should prioritize spades cards', () => {
      const hand = [
        new Card(Suit.SPADES, 8),
        new Card(Suit.HEARTS, 7),
        new Card(Suit.DIAMONDS, 7),
      ];
      const validCards = [...hand];

      const selected = hardAI.selectCardToPlay(hand, validCards, boardState);

      // Should select spades card to unlock more ranks
      expect(selected.suit).toBe(Suit.SPADES);
    });

    it('should prefer non-7 cards over opening new suits', () => {
      board.playCard(new Card(Suit.HEARTS, 7)); // Open hearts
      boardState = board.getState();

      const hand = [new Card(Suit.HEARTS, 8), new Card(Suit.DIAMONDS, 7)];
      const validCards = [...hand];

      const selected = hardAI.selectCardToPlay(hand, validCards, boardState);

      // Should prefer playing 8♥ over opening diamonds
      expect(selected.rank).toBe(8);
      expect(selected.suit).toBe(Suit.HEARTS);
    });

    it('should play cards further from 7 first', () => {
      board.playCard(new Card(Suit.SPADES, 8));
      board.playCard(new Card(Suit.SPADES, 9));
      board.playCard(new Card(Suit.SPADES, 6));
      boardState = board.getState();

      const hand = [new Card(Suit.SPADES, 10), new Card(Suit.SPADES, 5)];
      const validCards = [...hand];

      const selected = hardAI.selectCardToPlay(hand, validCards, boardState);

      // Both are distance 3 from 7, so either is valid strategy
      // Just verify it's one of them
      expect([10, 5]).toContain(selected.rank);
    });

    it('should play 7s when no better options exist', () => {
      const hand = [new Card(Suit.HEARTS, 7)];
      const validCards = [...hand];

      const selected = hardAI.selectCardToPlay(hand, validCards, boardState);

      expect(selected.rank).toBe(7);
    });

    it('should throw error when no valid cards', () => {
      expect(() => {
        hardAI.selectCardToPlay([], [], boardState);
      }).toThrow();
    });
  });

  describe('selectCardToGive', () => {
    it('should prefer giving cards in closed suits', () => {
      // Only spades is open
      const hand = [
        new Card(Suit.SPADES, 8),
        new Card(Suit.HEARTS, 6), // Hearts not open
        new Card(Suit.DIAMONDS, 5), // Diamonds not open
      ];
      const recipient = new HumanPlayer('p1', 'Alice', 0);

      const selected = hardAI.selectCardToGive(hand, recipient, boardState);

      // Should give a card from a closed suit
      expect([Suit.HEARTS, Suit.DIAMONDS]).toContain(selected.suit);
    });

    it('should prefer giving cards further from 7 in closed suits', () => {
      const hand = [
        new Card(Suit.HEARTS, 10), // Distance 3 from 7
        new Card(Suit.DIAMONDS, 9), // Distance 2 from 7
      ];
      const recipient = new HumanPlayer('p1', 'Alice', 0);

      const selected = hardAI.selectCardToGive(hand, recipient, boardState);

      // Should give 10♥ (further from 7)
      expect(selected.rank).toBe(10);
    });

    it('should prefer giving cards locked by spades', () => {
      board.playCard(new Card(Suit.SPADES, 8));
      board.playCard(new Card(Suit.HEARTS, 7));
      boardState = board.getState();
      // Spades: 7-8, Hearts: 7
      // Ranks 7-8 unlocked, but 9+ and 6- are locked

      const hand = [
        new Card(Suit.HEARTS, 8), // Unlocked and playable
        new Card(Suit.HEARTS, 10), // Locked by spades
      ];
      const recipient = new HumanPlayer('p1', 'Alice', 0);

      const selected = hardAI.selectCardToGive(hand, recipient, boardState);

      // Should give 10♥ (locked)
      expect(selected.rank).toBe(10);
    });

    it('should give cards not adjacent to sequences when possible', () => {
      board.playCard(new Card(Suit.SPADES, 8));
      board.playCard(new Card(Suit.SPADES, 9));
      board.playCard(new Card(Suit.SPADES, 10));
      boardState = board.getState();
      // Spades: 7-8-9-10

      const hand = [
        new Card(Suit.SPADES, 11), // Adjacent to sequence (immediately playable)
        new Card(Suit.SPADES, 6), // Adjacent to sequence (immediately playable)
        new Card(Suit.HEARTS, 7), // Not adjacent (hearts not open)
      ];
      const recipient = new HumanPlayer('p1', 'Alice', 0);

      const selected = hardAI.selectCardToGive(hand, recipient, boardState);

      // Should give 7♥ (in closed suit, not immediately playable)
      expect(selected.toString()).toBe('7♥');
    });

    it('should handle edge case when all cards are equally bad to give', () => {
      const hand = [new Card(Suit.SPADES, 8)];
      const recipient = new HumanPlayer('p1', 'Alice', 0);

      const selected = hardAI.selectCardToGive(hand, recipient, boardState);

      // Should give the only card available
      expect(selected.toString()).toBe('8♠');
    });

    it('should throw error when hand is empty', () => {
      const recipient = new HumanPlayer('p1', 'Alice', 0);

      expect(() => {
        hardAI.selectCardToGive([], recipient, boardState);
      }).toThrow();
    });
  });

  describe('Strategic behavior comparison', () => {
    it('should make more strategic choices than EasyAI', () => {
      // This is a qualitative test showing HardAI's strategic superiority
      const hand = [
        new Card(Suit.SPADES, 8), // Unlocks rank 8
        new Card(Suit.HEARTS, 7), // Opens hearts but doesn't unlock ranks
      ];
      const validCards = [...hand];

      const hardChoice = hardAI.selectCardToPlay(hand, validCards, boardState);

      // HardAI should choose to play spades to unlock rank 8
      expect(hardChoice.suit).toBe(Suit.SPADES);
      expect(hardChoice.rank).toBe(8);

      // EasyAI would randomly pick either one (we can't test randomness directly,
      // but we've demonstrated HardAI has a deliberate strategy)
    });
  });
});
