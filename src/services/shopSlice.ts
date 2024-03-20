import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ShopState {
  products: any | null;
}

const initialState: ShopState = {
  products: null,
}

const shopSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setShopData: (state, action: PayloadAction<any>) => {
      state.products = action.payload;
    },
    // setDailyBonus: (state, action: <Pa)
  }
});

export const { setShopData } = shopSlice.actions;

export default shopSlice.reducer;