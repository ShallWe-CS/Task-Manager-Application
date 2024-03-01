import { configureStore } from "@reduxjs/toolkit";
import boardsSlice from "./boardsSlice";
import boardsSliceNew from "./boardsSliceNew";
import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    boards: boardsSlice.reducer,
    boardsNew: boardsSliceNew.reducer,
    auth: authSlice.reducer
  }
})

export default store
