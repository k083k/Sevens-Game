/**
 * Unit tests for GameEngine
 */

import { GameEngine } from '../../game/engine/GameEngine';
import { Board } from '../../game/models/Board';
import { Card } from '../../game/models/Card';
import { HumanPlayer } from '../../game/models/Player';
import { Suit, IPlayer } from '../../game/types/types';

describe('GameEngine', () => {
  let engine: GameEngine;
  let board: Board;
  let player: HumanPlayer;

  beforeEach(() => {
    board = new Board();
    engine = new GameEngine(board);
    player = new HumanPlayer('player1', 'Alice', 0);
  });

  describe('canPlayCard', () => {
    it('should reject card not in player hand', () => {
      const card = new Card(Suit.SPADES, 7);
      const result = engine.canPlayCard(card, player);

      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('do not have');
    });

    it('should accept valid 7 to open suit', () => {
      const card = new Card(Suit.SPADES, 7);
      player.addCard(card);

      const result = engine.canPlayCard(card, player);
      expect(result.isValid).toBe(true);
    });

    it('should reject 7 when suit is already open', () => {
      const card1 = new Card(Suit.HEARTS, 7);
      const card2 = new Card(Suit.HEARTS, 7);

      player.addCard(card1);
      player.addCard(card2);

      engine.playCard(card1, player);

      const result = engine.canPlayCard(card2, player);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('already open');
    });

    it('should reject card that violates sequence rules', () => {
      const seven = new Card(Suit.SPADES, 7);
      const ten = new Card(Suit.SPADES, 10); // Skip 8 and 9

      player.addCard(seven);
      player.addCard(ten);

      engine.playCard(seven, player);

      const result = engine.canPlayCard(ten, player);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('adjacent');
    });

    it('should reject card locked by spades rule', () => {
      const sevenSpades = new Card(Suit.SPADES, 7);
      const sevenHearts = new Card(Suit.HEARTS, 7);
      const eightHearts = new Card(Suit.HEARTS, 8); // Locked - 8♠ not played yet

      player.addCard(sevenSpades);
      player.addCard(sevenHearts);
      player.addCard(eightHearts);

      engine.playCard(sevenSpades, player);
      engine.playCard(sevenHearts, player);

      const result = engine.canPlayCard(eightHearts, player);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('locked');
    });

    it('should accept card that satisfies all rules', () => {
      const sevenSpades = new Card(Suit.SPADES, 7);
      const eightSpades = new Card(Suit.SPADES, 8);
      const sevenHearts = new Card(Suit.HEARTS, 7);
      const eightHearts = new Card(Suit.HEARTS, 8);

      player.addCard(sevenSpades);
      player.addCard(eightSpades);
      player.addCard(sevenHearts);
      player.addCard(eightHearts);

      engine.playCard(sevenSpades, player);
      engine.playCard(eightSpades, player); // Unlock rank 8
      engine.playCard(sevenHearts, player); // Open hearts

      const result = engine.canPlayCard(eightHearts, player);
      expect(result.isValid).toBe(true);
    });
  });

  describe('getValidCards', () => {
    it('should return empty array when player has no valid cards', () => {
      player.addCard(new Card(Suit.HEARTS, 6)); // Hearts not open
      player.addCard(new Card(Suit.DIAMONDS, 8)); // Diamonds not open

      const validCards = engine.getValidCards(player);
      expect(validCards).toEqual([]);
    });

    it('should return only 7♠ at the start of the game', () => {
      player.addCard(new Card(Suit.SPADES, 7));
      player.addCard(new Card(Suit.HEARTS, 6));
      player.addCard(new Card(Suit.DIAMONDS, 8));

      const validCards = engine.getValidCards(player);
      expect(validCards.length).toBe(1);
      expect(validCards[0].suit).toBe(Suit.SPADES);
      expect(validCards[0].rank).toBe(7);
    });

    it('should return all valid cards', () => {
      const sevenSpades = new Card(Suit.SPADES, 7);
      const eightSpades = new Card(Suit.SPADES, 8);
      const sixSpades = new Card(Suit.SPADES, 6);
      const sevenHearts = new Card(Suit.HEARTS, 7);

      player.addCard(sevenSpades);
      player.addCard(eightSpades);
      player.addCard(sixSpades);
      player.addCard(sevenHearts);

      engine.playCard(sevenSpades, player);

      const validCards = engine.getValidCards(player);
      // Should be able to play: 8♠, 6♠, 7♥
      expect(validCards.length).toBe(3);
    });
  });

  describe('hasValidMove', () => {
    it('should return false when player has no valid cards', () => {
      player.addCard(new Card(Suit.HEARTS, 6));
      expect(engine.hasValidMove(player)).toBe(false);
    });

    it('should return true when player has at least one valid card', () => {
      player.addCard(new Card(Suit.SPADES, 7));
      player.addCard(new Card(Suit.HEARTS, 6));
      expect(engine.hasValidMove(player)).toBe(true);
    });
  });

  describe('playCard', () => {
    it('should remove card from player hand', () => {
      const card = new Card(Suit.SPADES, 7);
      player.addCard(card);

      expect(player.getHandSize()).toBe(1);
      engine.playCard(card, player);
      expect(player.getHandSize()).toBe(0);
    });

    it('should place card on board', () => {
      const card = new Card(Suit.SPADES, 7);
      player.addCard(card);

      expect(board.isSuitOpen(Suit.SPADES)).toBe(false);
      engine.playCard(card, player);
      expect(board.isSuitOpen(Suit.SPADES)).toBe(true);
    });

    it('should throw error for invalid move', () => {
      const card = new Card(Suit.HEARTS, 6); // Invalid - hearts not open
      player.addCard(card);

      expect(() => {
        engine.playCard(card, player);
      }).toThrow();
    });

    it('should allow playing sequence of valid cards', () => {
      player.addCard(new Card(Suit.SPADES, 7));
      player.addCard(new Card(Suit.SPADES, 8));
      player.addCard(new Card(Suit.SPADES, 6));

      engine.playCard(new Card(Suit.SPADES, 7), player);
      engine.playCard(new Card(Suit.SPADES, 8), player);
      engine.playCard(new Card(Suit.SPADES, 6), player);

      const sequence = board.getSuitSequence(Suit.SPADES);
      expect(sequence.low).toBe(6);
      expect(sequence.high).toBe(8);
    });
  });

  describe('findPlayerWithSevenOfSpades', () => {
    it('should find the player with 7♠', () => {
      const player1 = new HumanPlayer('p1', 'Alice', 0);
      const player2 = new HumanPlayer('p2', 'Bob', 1);

      player1.addCard(new Card(Suit.HEARTS, 7));
      player2.addCard(new Card(Suit.SPADES, 7));

      const players = [player1, player2];
      const result = engine.findPlayerWithSevenOfSpades(players);

      expect(result).toBe(player2);
    });

    it('should return null if no player has 7♠', () => {
      const player1 = new HumanPlayer('p1', 'Alice', 0);
      player1.addCard(new Card(Suit.HEARTS, 7));

      const result = engine.findPlayerWithSevenOfSpades([player1]);
      expect(result).toBeNull();
    });
  });

  describe('determineTurnOrder', () => {
    it('should start with player who has 7♠', () => {
      const player1 = new HumanPlayer('p1', 'Alice', 0);
      const player2 = new HumanPlayer('p2', 'Bob', 1);
      const player3 = new HumanPlayer('p3', 'Charlie', 2);

      player1.addCard(new Card(Suit.HEARTS, 7));
      player2.addCard(new Card(Suit.SPADES, 7)); // Has 7♠
      player3.addCard(new Card(Suit.DIAMONDS, 7));

      const turnOrder = engine.determineTurnOrder([player1, player2, player3]);

      expect(turnOrder[0]).toBe('p2'); // Bob goes first
      expect(turnOrder.length).toBe(3);
    });

    it('should proceed clockwise from 7♠ holder', () => {
      const player1 = new HumanPlayer('p1', 'Alice', 0);
      const player2 = new HumanPlayer('p2', 'Bob', 1);
      const player3 = new HumanPlayer('p3', 'Charlie', 2);
      const player4 = new HumanPlayer('p4', 'Diana', 3);

      player3.addCard(new Card(Suit.SPADES, 7)); // Charlie has 7♠

      const turnOrder = engine.determineTurnOrder([player1, player2, player3, player4]);

      // Should be: Charlie (p3), Diana (p4), Alice (p1), Bob (p2)
      expect(turnOrder).toEqual(['p3', 'p4', 'p1', 'p2']);
    });

    it('should throw error if no player has 7♠', () => {
      const player1 = new HumanPlayer('p1', 'Alice', 0);
      player1.addCard(new Card(Suit.HEARTS, 7));

      expect(() => {
        engine.determineTurnOrder([player1]);
      }).toThrow();
    });
  });

  describe('hasPlayerWon', () => {
    it('should return true when player has no cards', () => {
      expect(engine.hasPlayerWon(player)).toBe(true);
    });

    it('should return false when player has cards', () => {
      player.addCard(new Card(Suit.SPADES, 7));
      expect(engine.hasPlayerWon(player)).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset the board', () => {
      const card = new Card(Suit.SPADES, 7);
      player.addCard(card);
      engine.playCard(card, player);

      expect(board.isSuitOpen(Suit.SPADES)).toBe(true);

      engine.reset();

      expect(board.isSuitOpen(Suit.SPADES)).toBe(false);
    });
  });

  describe('Integration - Complex game scenario', () => {
    it('should enforce all rules in a realistic game sequence', () => {
      // Setup player hand
      player.addCard(new Card(Suit.SPADES, 7));
      player.addCard(new Card(Suit.SPADES, 8));
      player.addCard(new Card(Suit.SPADES, 9));
      player.addCard(new Card(Suit.HEARTS, 7));
      player.addCard(new Card(Suit.HEARTS, 8));
      player.addCard(new Card(Suit.HEARTS, 9));

      // Play 7♠ (first move)
      expect(engine.canPlayCard(new Card(Suit.SPADES, 7), player).isValid).toBe(true);
      engine.playCard(new Card(Suit.SPADES, 7), player);

      // Now 7♥ should be valid (rank 7 unlocked)
      expect(engine.canPlayCard(new Card(Suit.HEARTS, 7), player).isValid).toBe(true);
      engine.playCard(new Card(Suit.HEARTS, 7), player);

      // 8♥ should still be locked (8♠ not played yet)
      expect(engine.canPlayCard(new Card(Suit.HEARTS, 8), player).isValid).toBe(false);

      // Play 8♠ to unlock rank 8
      engine.playCard(new Card(Suit.SPADES, 8), player);

      // Now 8♥ should be valid
      expect(engine.canPlayCard(new Card(Suit.HEARTS, 8), player).isValid).toBe(true);
      engine.playCard(new Card(Suit.HEARTS, 8), player);

      // Play 9♠ to unlock rank 9
      engine.playCard(new Card(Suit.SPADES, 9), player);

      // Now 9♥ should be valid
      expect(engine.canPlayCard(new Card(Suit.HEARTS, 9), player).isValid).toBe(true);
      engine.playCard(new Card(Suit.HEARTS, 9), player);

      // Player should have won (all cards played)
      expect(engine.hasPlayerWon(player)).toBe(true);
    });
  });
});
