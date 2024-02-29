import { configureStore } from "@reduxjs/toolkit";
import boardsSlice from "./boardsSlice";
import boardsSliceNew from "./boardsSliceNew";

const store = configureStore({
  reducer: {
    boards: boardsSlice.reducer,
    boardsNew: boardsSliceNew.reducer,
  }
})

export default store
