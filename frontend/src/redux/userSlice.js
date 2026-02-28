import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city:null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity:(state,action)=> {
      state.city = action.payload;
    }
  },
});

export const { setUserData,setCurrentCity } = userSlice.actions;
export default userSlice.reducer;
