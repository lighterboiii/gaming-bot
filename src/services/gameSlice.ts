import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Choice {
  Rock = 'rock',
  Paper = 'paper',
  Scissors = 'scissors',
}

interface GameState {
  playerChoice: Choice | null;
  opponentChoice: Choice | null;
  result: string | null;
}

const initialState: GameState = {
  playerChoice: null,
  opponentChoice: null,
  result: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayerChoice(state, action: PayloadAction<Choice>) {
      state.playerChoice = action.payload;
    },
    setOpponentChoice(state, action: PayloadAction<Choice>) {
      state.opponentChoice = action.payload;
    },
    setResult(state, action: PayloadAction<string>) {
      state.result = action.payload;
    },
    resetGame(state) {
      state.playerChoice = null;
      state.opponentChoice = null;
      state.result = null;
    },
  },
});

export const { setPlayerChoice, setOpponentChoice, setResult, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
