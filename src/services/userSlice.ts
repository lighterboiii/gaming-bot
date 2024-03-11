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
    clearUserData: (state) => {
      state.userData = null;
    },
  }
});

export const { setUserData, clearUserData, setUserPhoto } = userSlice.actions;

export default userSlice.reducer;