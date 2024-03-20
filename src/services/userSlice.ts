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
    setCoinsValue: (state, action: PayloadAction<number>) => {
      if (state.userData) {
        state.userData.info.coins += action.payload;
      }
    },
  }
});

export const { setUserData, clearUserData, setUserPhoto, setActiveSkin, setCollectibles } = userSlice.actions;

export default userSlice.reducer;