import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Bonus, UserInfo } from "../utils/types/mainTypes";
import { ItemData, LavkaData } from "../utils/types/shopTypes";

interface AppState {
  info: UserInfo | null;
  products: ItemData[] | null;
  archive: ItemData[] | null;
  bonus: Bonus | any | null;
  lavka: LavkaData[] | null;
}

const initialState: AppState = {
  info: null,
  products: null,
  archive: null,
  bonus: null,
  lavka: null,
}

const appSlice = createSlice({
  name: 'app',
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
    clearDailyBonus: (state) => {
      state.bonus = null;
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
    removeCollectible: (state, action: PayloadAction<number>) => {
      if (state.info && state.info.collectibles) {
        const updatedCollectibles = state.info.collectibles.filter(collectible => collectible !== action.payload);
        state.info.collectibles = updatedCollectibles;
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
    setCoinsNewValue: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.coins = action.payload;
      }
    },
    setNewTokensValue: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.tokens = action.payload;
      }
    },
    setNewExpValue: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.user_exp = action.payload;
      }
    },
    setEnergyDrinksValue: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.user_energy_drinks = action.payload;
      }
    },
    addEnergyDrink: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.user_energy_drinks += action.payload;
      }
    },
    setShopAvailable: (state, action: PayloadAction<ItemData[]>) => {
      state.products = action.payload;
    },
    setProductsArchive: (state, action: PayloadAction<ItemData[]>) => {
      state.archive = action.payload;
    },
    setLavkaAvailable: (state, action: PayloadAction<LavkaData[]>) => {
      state.lavka = action.payload;
    },
    addItemToLavka: (state, action: PayloadAction<LavkaData>) => {
      if (state.lavka) {
        state.lavka.push(action.payload);
      }
    },
    removeItemFromLavka: (state, action: PayloadAction<number>) => {
      if (state.lavka) {
        const updatedLavka = state.lavka.filter((item: LavkaData) => item.item_id !== action.payload);
        state.lavka = updatedLavka;
      }
    },
  }
})

export const {
  setUserData,
  setCoinsValueAfterBuy,
  setTokensValueAfterBuy,
  setUserPhoto,
  setActiveSkin,
  setCollectibles,
  removeCollectible,
  setNewTokensValue,
  setShopAvailable,
  setProductsArchive,
  setDailyBonus,
  setLavkaAvailable,
  setNewExpValue,
  setEnergyDrinksValue,
  addItemToLavka,
  removeItemFromLavka,
  setCoinsNewValue,
  clearDailyBonus,
  addEnergyDrink
} = appSlice.actions;

export default appSlice.reducer;