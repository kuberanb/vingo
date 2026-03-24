import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import shopSlice from "./ownerSlice.js";
import mapSlice from "./mapSlice.js"

const store = configureStore({
  reducer: {
    user: userSlice,
    owner: shopSlice,
    map: mapSlice
  },
});

export default store;
