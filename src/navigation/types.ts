import { GameMode } from '../game/types/types';

/**
 * Root navigation parameter list
 * Defines all screens and their parameters
 */
export type RootStackParamList = {
  Home: undefined;
  Setup: undefined;
  Game: {
    gameMode: GameMode;
    playerCount: number;
  };
};
