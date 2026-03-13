import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    state: null,
    address: null,
    shopsInMyCity: null,
    itemsInMyCity: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.city = action.payload;
    },
    setCurrentState: (state, action) => {
      state.state = action.payload;
    },
    setcurrentAddress: (state, action) => {
      state.address = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
  },
});

export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setcurrentAddress,
  setShopInMyCity,
  setItemsInMyCity,
} = userSlice.actions;
export default userSlice.reducer;
