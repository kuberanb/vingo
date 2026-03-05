import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    state: null,
    address: null,
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
  },
});

export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setcurrentAddress,
} = userSlice.actions;
export default userSlice.reducer;
