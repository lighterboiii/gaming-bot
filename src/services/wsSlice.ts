import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
  socket: any | null;
}

const initialState: WebSocketState = {
  socket: null,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setSocket(state, action: PayloadAction<WebSocket | null>) {
      state.socket = action.payload;
    },
  },
});

export const { setSocket } = websocketSlice.actions;

export default websocketSlice.reducer;
