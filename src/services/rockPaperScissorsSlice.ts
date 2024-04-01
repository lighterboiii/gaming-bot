import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RpsState {
  gameData: any[];
}

const initialState: RpsState = {
  gameData: [],
};

const rpsSlice = createSlice({
  name: 'rps',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<any>) {
      state.gameData.push(action.payload);
    },
  },
});

export const { addMessage } = rpsSlice.actions;
export default rpsSlice.reducer;
