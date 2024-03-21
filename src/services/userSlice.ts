import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Bonus, ItemData, UserInfo } from "../utils/types";

interface UserState {
  info: UserInfo | null;
  products: ItemData[] | null;
  archive: ItemData[] | null;
  bonus: Bonus | null;
}

const initialState: UserState = {
  info: null,
  products: null,
  archive: null,
  bonus: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserInfo>) => {
      state.info = action.payload;
    },
    setUserPhoto: (state, action: PayloadAction<string>) => {
      if (state.info) {
        state.info.photo = action.payload
      }
    },
    setDailyBonus: (state, action: PayloadAction<Bonus>) => {
      state.bonus = action.payload;
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
    setNewCoinsValue: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.coins = action.payload;
      }
    },
    setNewTokensValue: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.tokens = action.payload;
      }
    },
    setShopAvailable: (state, action: PayloadAction<ItemData[]>) => {
      state.products = action.payload;
    },
    setProductsArchive: (state, action: PayloadAction<ItemData[]>) => {
      state.archive = action.payload;
    }
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
  setShopAvailable,
  setProductsArchive,
  setDailyBonus
  // setNewCoinsValue
} = userSlice.actions;

export default userSlice.reducer;