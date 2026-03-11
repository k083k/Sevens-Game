/**
 * Unit tests for Game Mode (Easy vs Hard)
 */

import { Game } from '../../game/Game';
import { Card } from '../../game/models/Card';
import { PlayerType, GameMode, GamePhase, Suit } from '../../game/types/types';

describe('Game Mode - Easy vs Hard', () => {
  let game: Game;

  describe('Easy Mode (default)', () => {
    beforeEach(() => {
      game = new Game();
      game.initializeGame([
        { name: 'Player 1', type: PlayerType.HUMAN },
        { name: 'Player 2', type: PlayerType.HUMAN },
      ]);
      game.dealCards();
    });

    it('should default to Easy mode when not specified', () => {
      const state = game.getState();
      expect(state.gameMode).toBe(GameMode.EASY);
    });

    it('should throw error if player tries to pass with valid cards', () => {
      // Play first card (7♠)
      const firstPlayer = game.getCurrentPlayer();
      const sevenOfSpades = firstPlayer
        .getHand()
        .find((card) => card.suit === Suit.SPADES && card.rank === 7);
      game.playCard(sevenOfSpades!);

      // Now second player's turn
      const currentPlayer = game.getCurrentPlayer();

      // If they have valid cards, they cannot use handleCannotPlay
      if (game.currentPlayerHasValidMoves()) {
        expect(() => {
          game.handleCannotPlay();
        }).toThrow('Player has valid moves available (Easy mode enforces mandatory play)');
      }
    });

    it('should allow handleCannotPlay only when truly no valid cards', () => {
      // Play first card
      const firstPlayer = game.getCurrentPlayer();
      const sevenOfSpades = firstPlayer
        .getHand()
        .find((card) => card.suit === Suit.SPADES && card.rank === 7);
      game.playCard(sevenOfSpades!);

      const currentPlayer = game.getCurrentPlayer();

      // Only allow cannot-play if no valid moves
      if (!game.currentPlayerHasValidMoves()) {
        expect(() => {
          game.handleCannotPlay();
        }).not.toThrow();
      }
    });
  });

  describe('Hard Mode', () => {
    beforeEach(() => {
      game = new Game();
      game.initializeGame(
        [
          { name: 'Player 1', type: PlayerType.HUMAN },
          { name: 'Player 2', type: PlayerType.HUMAN },
        ],
        GameMode.HARD
      );
      game.dealCards();
    });

    it('should be in Hard mode when specified', () => {
      const state = game.getState();
      expect(state.gameMode).toBe(GameMode.HARD);
    });

    it('should allow voluntary pass even with valid cards (strategic 7 holding)', () => {
      // Play first card (7♠)
      const firstPlayer = game.getCurrentPlayer();
      const sevenOfSpades = firstPlayer
        .getHand()
        .find((card) => card.suit === Suit.SPADES && card.rank === 7);
      game.playCard(sevenOfSpades!);

      // Now second player's turn
      const currentPlayer = game.getCurrentPlayer();

      // In Hard mode, even if they have valid cards, they can choose to pass
      const hasValidMoves = game.currentPlayerHasValidMoves();

      if (hasValidMoves) {
        // This should NOT throw in Hard mode
        expect(() => {
          game.handleCannotPlay();
        }).not.toThrow();

        const state = game.getState();
        expect(state.pendingCardTransfer).not.toBeNull();
        expect(state.pendingCardTransfer!.to).toBe(currentPlayer.id);
        expect(state.pendingCardTransfer!.from).toBe(firstPlayer.id);
      }
    });

    it('should allow strategic 7 holding by voluntarily passing', () => {
      // Play 7♠
      const player1 = game.getCurrentPlayer();
      const sevenOfSpades = player1
        .getHand()
        .find((card) => card.suit === Suit.SPADES && card.rank === 7);
      game.playCard(sevenOfSpades!);

      // Player 2's turn
      const player2 = game.getCurrentPlayer();
      const player2HasSeven = player2.getHand().some((card) => card.rank === 7);
      const player2InitialHandSize = player2.getHandSize();

      // If player 2 has a 7, they can strategically hold it
      if (player2HasSeven) {
        // Choose to pass (voluntarily)
        game.handleCannotPlay();

        const state = game.getState();
        expect(state.pendingCardTransfer).not.toBeNull();

        // Player 1 gives a card to Player 2
        const cardToGive = player1.getHand()[0];
        game.executeCardTransfer(cardToGive);

        // Player 2 should now have one more card
        expect(player2.getHandSize()).toBe(player2InitialHandSize + 1);

        // Player 2 still has the 7 they chose to hold
        const stillHasSeven = player2.getHand().some((card) => card.rank === 7);
        expect(stillHasSeven).toBe(true);
      }
    });

    it('should apply to all players in Hard mode', () => {
      // Create a 3-player game in Hard mode
      const hardGame = new Game();
      hardGame.initializeGame(
        [
          { name: 'P1', type: PlayerType.HUMAN },
          { name: 'P2', type: PlayerType.HUMAN },
          { name: 'P3', type: PlayerType.HUMAN },
        ],
        GameMode.HARD
      );
      hardGame.dealCards();

      const state = hardGame.getState();
      expect(state.gameMode).toBe(GameMode.HARD);
      expect(state.players.length).toBe(3);
    });
  });

  describe('Strategic implications of Hard mode', () => {
    it('should allow blocking a suit by holding its 7', () => {
      game = new Game();
      game.initializeGame(
        [
          { name: 'Player 1', type: PlayerType.HUMAN },
          { name: 'Player 2', type: PlayerType.HUMAN },
        ],
        GameMode.HARD
      );
      game.dealCards();

      // Play 7♠
      const player1 = game.getCurrentPlayer();
      const sevenOfSpades = player1
        .getHand()
        .find((card) => card.suit === Suit.SPADES && card.rank === 7);
      game.playCard(sevenOfSpades!);

      // Check if player 2 has 7♥, 7♦, or 7♣
      const player2 = game.getCurrentPlayer();
      const hasOtherSeven = player2.getHand().some((card) => {
        return card.rank === 7 && card.suit !== Suit.SPADES;
      });

      if (hasOtherSeven) {
        // Player 2 can choose NOT to open that suit by passing
        game.handleCannotPlay();

        const state = game.getState();
        expect(state.pendingCardTransfer).not.toBeNull();

        // The suit is still not opened (strategic hold)
        const boardState = game.getBoardState();
        const unopenedSuits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS].filter(
          (suit) => boardState[suit].low === null && boardState[suit].high === null
        );

        // At least one suit should still be unopened
        expect(unopenedSuits.length).toBeGreaterThan(0);
      }
    });

    it('should accept penalty card for strategic advantage', () => {
      game = new Game();
      game.initializeGame(
        [
          { name: 'Player 1', type: PlayerType.HUMAN },
          { name: 'Player 2', type: PlayerType.HUMAN },
        ],
        GameMode.HARD
      );
      game.dealCards();

      const player1 = game.getCurrentPlayer();
      const sevenOfSpades = player1
        .getHand()
        .find((card) => card.suit === Suit.SPADES && card.rank === 7);
      game.playCard(sevenOfSpades!);

      const player2 = game.getCurrentPlayer();
      const player2InitialSize = player2.getHandSize();

      // Player 2 voluntarily passes (even if they have valid cards)
      if (game.currentPlayerHasValidMoves()) {
        game.handleCannotPlay();

        // Execute the penalty
        const cardToGive = player1.getHand()[0];
        game.executeCardTransfer(cardToGive);

        // Player 2 accepted a penalty card for strategic advantage
        expect(player2.getHandSize()).toBe(player2InitialSize + 1);
      }
    });
  });

  describe('Mode persistence', () => {
    it('should maintain game mode throughout the game', () => {
      game = new Game();
      game.initializeGame(
        [
          { name: 'P1', type: PlayerType.HUMAN },
          { name: 'P2', type: PlayerType.HUMAN },
        ],
        GameMode.HARD
      );

      expect(game.getState().gameMode).toBe(GameMode.HARD);

      game.dealCards();

      expect(game.getState().gameMode).toBe(GameMode.HARD);

      // Play a card
      const currentPlayer = game.getCurrentPlayer();
      const validCards = game.getValidCardsForCurrentPlayer();
      if (validCards.length > 0) {
        game.playCard(validCards[0]);
      }

      expect(game.getState().gameMode).toBe(GameMode.HARD);
    });
  });
});
