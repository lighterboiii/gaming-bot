import { configureStore } from "@reduxjs/toolkit";
import appReducer from './appSlice';
import rpsReducer from './rockPaperScissorsSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    game: rpsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;