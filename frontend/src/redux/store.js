import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import shopSlice from "./ownerSlice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    owner: shopSlice,
  },
});

export default store;
