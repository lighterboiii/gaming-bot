import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IGameData } from "../utils/types/gameTypes";
import { IBannerData, IBonus, ITask, IUserData } from "../utils/types/mainTypes";
import { ItemData } from "../utils/types/shopTypes";

// костыльнулся с any
interface AppState {
  info: IUserData | null;
  products: ItemData[] | null;
  archive: ItemData[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bonus: IBonus | null | any;
  lavka: ItemData[] | null;
  openedRooms: IGameData | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  languageSettings: string[] | null | any,
  tasks: ITask[] | null,
  bannerData: IBannerData[] | null;
  shopImage: string | null;
  RPSRuleImage: string | null;
  closestNumberRuleImage: string | null;
  ludkaRuleImage: string | null;
  monetkaRuleImage: string | null;
  firstGameRulesState: boolean | null;
  secondGameRulesState: boolean | null;
  thirdGameRulesState: boolean | null;
  fourthGameRulesState: boolean | null;
}

const initialState: AppState = {
  info: null,
  products: null,
  archive: null,
  bonus: null,
  lavka: null,
  openedRooms: null,
  languageSettings: null,
  tasks: null,
  bannerData: null,
  shopImage: null,
  RPSRuleImage: null,
  closestNumberRuleImage: null,
  ludkaRuleImage: null,
  monetkaRuleImage: null,
  firstGameRulesState: null,
  secondGameRulesState: null,
  thirdGameRulesState: null,
  fourthGameRulesState: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // userInfo part
    setUserData: (state, action: PayloadAction<IUserData>) => {
      state.info = action.payload;
    },
    setUserPhoto: (state, action: PayloadAction<string>) => {
      if (state.info) {
        state.info.photo = action.payload
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
    setNewExpValue: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.user_exp = action.payload;
      }
    },
    setActiveEmoji: (state, action: PayloadAction<string>) => {
      if (state.info) {
        state.info.user_active_emoji = action.payload;
      }
    },
    setTaskList: (state, action: PayloadAction<ITask[]>) => {
      if (state.info) {
        state.tasks = action.payload;
      }
    },
    setBannerData: (state, action: PayloadAction<IBannerData[]>) => {
      state.bannerData = action.payload;
    },
    setShopImage: (state, action: PayloadAction<string>) => {
      state.shopImage = action.payload;
    },
    // daily bonus part
    setDailyBonus: (state, action: PayloadAction<IBonus>) => {
      state.bonus = action.payload;
    },
    clearDailyBonus: (state) => {
      state.bonus = null;
    },
    // shop part
    setShopAvailable: (state, action: PayloadAction<ItemData[]>) => {
      state.products = action.payload;
    },
    setProductsArchive: (state, action: PayloadAction<ItemData[]>) => {
      state.archive = action.payload;
    },
    setLavkaAvailable: (state, action: PayloadAction<ItemData[]>) => {
      state.lavka = action.payload;
    },
    addItemToLavka: (state, action: PayloadAction<ItemData>) => {
      if (state.lavka) {
        state.lavka.push(action.payload);
      }
    },
    removeItemFromLavka: (state, action: PayloadAction<number>) => {
      if (state.lavka) {
        const updatedLavka = state.lavka.filter((item: ItemData) => item.item_id !== action.payload);
        state.lavka = updatedLavka;
      }
    },
    setLanguageSettings: (state, action: PayloadAction<string[]>) => {
      state.languageSettings = action.payload;
    },
    // rooms & game part
    getOpenedRooms: (state, action: PayloadAction<IGameData>) => {
      state.openedRooms = action.payload;
    },
    setFirstGameRuleImage: (state, action: PayloadAction<string>) => {
      state.RPSRuleImage = action.payload;
    },
    setSecondGameRuleImage: (state, action: PayloadAction<string>) => {
      state.closestNumberRuleImage = action.payload;
    },
    setFirstGameRulesState: (state, action: PayloadAction<boolean>) => {
      state.firstGameRulesState = action.payload;
    },
    setSecondGameRulesState: (state, action: PayloadAction<boolean>) => {
      state.secondGameRulesState = action.payload;
    },
    addCoins: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.coins += action.payload;
      }
    },
    addTokens: (state, action: PayloadAction<number>) => {
      if (state.info) {
        state.info.tokens += action.payload;
      }
    },
    setThirdGameRuleImage: (state, action: PayloadAction<string>) => {
      state.ludkaRuleImage = action.payload;
    },
    setThirdGameRulesState: (state, action: PayloadAction<boolean>) => {
      state.thirdGameRulesState = action.payload;
    },
    setFourthGameRuleImage: (state, action: PayloadAction<string>) => {
      state.monetkaRuleImage = action.payload;
    },
    setFourthGameRulesState: (state, action: PayloadAction<boolean>) => {
      state.fourthGameRulesState = action.payload;
    },
  }
})

export const {
  addTokens,
  addCoins,
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
  setTaskList,
  setNewExpValue,
  setEnergyDrinksValue,
  addItemToLavka,
  removeItemFromLavka,
  setCoinsNewValue,
  clearDailyBonus,
  addEnergyDrink,
  getOpenedRooms,
  setActiveEmoji,
  setLanguageSettings,
  setBannerData,
  setShopImage,
  setFirstGameRuleImage,
  setSecondGameRuleImage,
  setFirstGameRulesState,
  setSecondGameRulesState,
  setThirdGameRuleImage,
  setThirdGameRulesState,
  setFourthGameRuleImage,
  setFourthGameRulesState
} = appSlice.actions;

export default appSlice.reducer;
