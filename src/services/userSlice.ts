import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../utils/types";

interface UserState {
  info: UserInfo | null;
}

const initialState: UserState = {
  info: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserInfo>) => {
      state.info = action.payload;
    },
    getUserData: (state, action: PayloadAction<any>) => {
      state.info = action.payload;
    },
    setUserPhoto: (state, action: PayloadAction<string>) => {
      if (state.info) {
        state.info.photo = action.payload
      }
    },
    setDailyBonus: (state, action: PayloadAction<string>) => {
      if (state.info) {
        state.info.bonus = action.payload;
      }
    },
    setActiveSkin: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.active_skin = action.payload;
      }
    },
    setCollectibles: (state, action: PayloadAction<number>) => {
      if (state.info) {
        const collectibles = [...state.info.collectibles, action.payload];
        state.info.collectibles = [...collectibles];
      }
    },
    clearUserData: (state) => {
      state.info = null;
    },
    setCoinsValueAfterBuy: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.coins = state.info.coins - action.payload;
      }
    },
    setTokensValueAfterBuy: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.tokens = state.info.tokens - action.payload;
      }
    },
    // setNewCoinsValue: (state, action: PayloadAction<number>) => {
    //   if (state.userData) {
    //     state.userData.info.coins += action.payload;
    //   }
    // },
    setNewTokensValue: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.tokens = action.payload;
      }
    },
  }
});

export const {
  setUserData,
  getUserData,
  setCoinsValueAfterBuy,
  setTokensValueAfterBuy,
  setUserPhoto,
  setActiveSkin,
  setCollectibles,
  setNewTokensValue,
  // setNewCoinsValue
} = userSlice.actions;

export default userSlice.reducer;