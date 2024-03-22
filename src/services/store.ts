import { configureStore } from "@reduxjs/toolkit";
import appReducer from './appSlice';
// import gameReducer from './gameSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    // game: gameReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;