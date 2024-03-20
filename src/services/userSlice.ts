import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserData } from "../utils/types";

interface UserState {
  userData: UserData | null;
}

const initialState: UserState = {
  userData: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    setUserPhoto: (state, action: PayloadAction<string>) => {
      if (state.userData) {
        state.userData.info.photo = action.payload
      }
    },
    setDailyBonus: (state, action: PayloadAction<string>) => {
      if (state.userData) {
        state.userData.bonus = action.payload;
      }
    },
    setActiveSkin: (state, action: PayloadAction<number>) => {
      if (state.userData) {
        state.userData.info.active_skin = action.payload;
      }
    },
    setCollectibles: (state, action: PayloadAction<number>) => {
      if (state.userData && state.userData.info) {
        const collectibles = [...state.userData.info.collectibles, action.payload];
        state.userData.info.collectibles = collectibles;
      }
    },
    clearUserData: (state) => {
      state.userData = null;
    },
    setCoinsValueAfterBuy: (state, action: PayloadAction<number>) => {
      if (state.userData) {
        state.userData.info.coins = state.userData.info.coins - action.payload;
      }
    },
    setTokensValueAfterBuy: (state, action: PayloadAction<number>) => {
      if (state.userData) {
        state.userData.info.tokens = state.userData.info.tokens - action.payload;
      }
    },
    setNewCoinsValue: (state, action: PayloadAction<number>) => {
      if (state.userData) {
        state.userData.info.coins += action.payload;
      }
    },
    setNewTokensValue: (state, action: PayloadAction<number>) => {
      if (state.userData) {
        state.userData.info.tokens += action.payload;
      }
    },
  }
});

export const {
  setUserData,
  setCoinsValueAfterBuy,
  setTokensValueAfterBuy,
  setUserPhoto,
  setActiveSkin,
  setCollectibles,
  setNewTokensValue,
  setNewCoinsValue
} = userSlice.actions;

export default userSlice.reducer;