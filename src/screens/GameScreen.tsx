import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, TEXT_STYLES, LAYOUT } from '../theme';
import { useGameStore } from '../store/gameStore';
import { PlayerType, GamePhase } from '../game/types/types';
import { Board } from '../components/Board';
import { Card } from '../components/Card';
import { GameEndModal, CannotPlayModal, CardTransferModal } from '../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { gameMode, playerCount } = route.params;

  const {
    gameState,
    initializeGame,
    dealCards,
    playCard,
    handleCannotPlay,
    executeCardTransfer,
    resetGame,
  } = useGameStore();

  // Initialize game when screen loads
  useEffect(() => {
    const players = [
      { name: 'You', type: PlayerType.HUMAN },
    ];

    // Add AI players based on player count
    for (let i = 1; i < playerCount; i++) {
      players.push({
        name: `AI Player ${i}`,
        type: i % 2 === 0 ? PlayerType.AI_EASY : PlayerType.AI_HARD,
      });
    }

    initializeGame(players, gameMode);
    dealCards();
  }, []);

  // Debug logging when gameState changes
  useEffect(() => {
    if (gameState) {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      console.log('=== Game State Update ===');
      console.log('Current player:', currentPlayer?.name, currentPlayer?.type);
      console.log('Game phase:', gameState.gamePhase);
      console.log('Valid cards:', gameState.validCards?.length || 0);
      if (currentPlayer?.type === PlayerType.HUMAN) {
        console.log('Human hand size:', currentPlayer.hand.length);
        console.log('Has 7♠:', currentPlayer.hand.some(c => c.suit === 'spades' && c.rank === 7));
      }
    }
  }, [gameState]);

  // Process AI turns automatically with delay
  useEffect(() => {
    if (!gameState) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // If it's an AI player's turn, process after delay
    if (currentPlayer?.type !== PlayerType.HUMAN) {
      const timer = setTimeout(() => {
        try {
          const { processAITurn, gameState: currentState } = useGameStore.getState();

          // Double-check it's still AI's turn (prevent race conditions)
          if (currentState) {
            const player = currentState.players[currentState.currentPlayerIndex];
            if (player?.type !== PlayerType.HUMAN) {
              processAITurn();
            }
          }
        } catch (error) {
          console.error('AI turn error:', error);
        }
      }, 1500); // 1.5 second delay so user can see AI's turn

      return () => clearTimeout(timer);
    }
  }, [gameState?.currentPlayerIndex, gameState?.gamePhase]);

  // Handle pending card transfer from AI player
  useEffect(() => {
    if (!gameState?.pendingCardTransfer) return;

    const givingPlayer = gameState.players.find(
      p => p.id === gameState.pendingCardTransfer!.from
    );

    // If the giving player is AI, automatically select and give a card
    if (givingPlayer && givingPlayer.type !== PlayerType.HUMAN) {
      const timer = setTimeout(() => {
        try {
          const { game } = useGameStore.getState();
          if (!game) return;

          const cardToGive = game.getAICardToGive(
            gameState.pendingCardTransfer!.from,
            gameState.pendingCardTransfer!.to
          );
          executeCardTransfer(cardToGive);
        } catch (error) {
          console.error('AI card transfer error:', error);
        }
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [gameState?.pendingCardTransfer]);

  const handleCardPlay = (card: any) => {
    try {
      playCard(card);
    } catch (error) {
      console.log('Cannot play card:', error);
    }
  };

  if (!gameState) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Initializing game...</Text>
      </View>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const humanPlayer = gameState.players.find(p => p.type === PlayerType.HUMAN);
  const isHumanTurn = currentPlayer?.type === PlayerType.HUMAN;

  // Get valid cards for highlighting (Easy mode only)
  const validCards = isHumanTurn && gameMode === 'easy' && humanPlayer
    ? gameState.validCards || []
    : [];

  const isCardValid = (card: any) => {
    if (gameMode !== 'easy') return true; // Don't show hints in hard mode
    return validCards.some(vc => vc.suit === card.suit && vc.rank === card.rank);
  };

  const handlePlayAgain = () => {
    resetGame();
    navigation.navigate('Setup');
  };

  const handleNewGame = () => {
    resetGame();
    navigation.navigate('Setup');
  };

  const handleBackHome = () => {
    resetGame();
    navigation.navigate('Home');
  };

  // Handle "Cannot Play" button press
  const handleCannotPlayPress = () => {
    if (isHumanTurn) {
      handleCannotPlay();
    }
  };

  // Handle card transfer selection
  const handleCardTransfer = (card: any) => {
    executeCardTransfer(card);
  };

  const isGameOver = gameState?.gamePhase === GamePhase.FINISHED;

  // Check if there's a pending card transfer
  const pendingTransfer = gameState?.pendingCardTransfer;
  const isTransferFromHuman = pendingTransfer &&
    gameState.players.find(p => p.id === pendingTransfer.from)?.type === PlayerType.HUMAN;

  // Get the giving and receiving player names for the transfer modal
  const givingPlayer = pendingTransfer ? gameState.players.find(p => p.id === pendingTransfer.from) : null;
  const receivingPlayer = pendingTransfer ? gameState.players.find(p => p.id === pendingTransfer.to) : null;

  return (
    <View style={styles.container}>
      {/* Board Area - 70% */}
      <View style={styles.boardArea}>
        <View style={styles.header}>
          <Text style={styles.gameMode}>Mode: {gameMode}</Text>
          <Text style={styles.currentTurn}>
            Current Turn: {currentPlayer.name}
          </Text>
        </View>

        <Board
          boardState={gameState.board}
          onCardPress={handleCardPlay}
        />
      </View>

      {/* Hand Area - 30% */}
      <View style={styles.handArea}>
        <Text style={styles.handTitle}>Your Hand ({humanPlayer?.hand.length || 0} cards)</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.handScroll}
          style={styles.handScrollView}
        >
          {humanPlayer?.hand.map((card, index) => (
            <View key={`${card.suit}-${card.rank}-${index}`} style={styles.cardInHand}>
              <Card
                card={card}
                onPress={() => handleCardPlay(card)}
                size="small"
                isValid={isCardValid(card)}
                disabled={!isHumanTurn}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cannotPlayButton]}
            onPress={handleCannotPlayPress}
            disabled={!isHumanTurn}
          >
            <Text style={styles.actionButtonText}>Cannot Play</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.quitButton]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.actionButtonText}>Quit Game</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game End Modal */}
      <GameEndModal
        visible={isGameOver}
        players={gameState?.players || []}
        onPlayAgain={handlePlayAgain}
        onNewGame={handleNewGame}
        onHome={handleBackHome}
      />

      {/* Card Transfer Modal - shown when human needs to give a card */}
      {isTransferFromHuman && givingPlayer && receivingPlayer && (
        <CardTransferModal
          visible={true}
          fromPlayerName={givingPlayer.name}
          toPlayerName={receivingPlayer.name}
          availableCards={givingPlayer.hand}
          onSelectCard={handleCardTransfer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.feltGreen,
  },
  loading: {
    ...TEXT_STYLES.h2,
    color: COLORS.cardWhite,
    textAlign: 'center',
  },
  boardArea: {
    flex: LAYOUT.boardHeightPercentage,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.feltGreenDark,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  gameMode: {
    ...TEXT_STYLES.body,
    color: COLORS.cardWhite,
    backgroundColor: COLORS.easyMode,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  currentTurn: {
    ...TEXT_STYLES.body,
    color: COLORS.cardWhite,
    fontWeight: 'bold',
  },
  handArea: {
    flex: LAYOUT.handHeightPercentage,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  handTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.cardWhite,
    marginBottom: SPACING.md,
  },
  handScrollView: {
    flex: 1,
    width: '100%',
  },
  handScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  cardInHand: {
    marginRight: SPACING.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  cannotPlayButton: {
    backgroundColor: COLORS.easyMode,
  },
  quitButton: {
    backgroundColor: COLORS.hardMode,
  },
  actionButtonText: {
    ...TEXT_STYLES.button,
    color: COLORS.cardWhite,
  },
});
