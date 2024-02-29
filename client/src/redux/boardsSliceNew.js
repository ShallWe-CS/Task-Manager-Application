import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDataFromApi } from "../utils/api";
import { STATUS } from "../utils/status";

const initialState = {
    boards: [],
    boardsStatus: STATUS.IDLE
}

const boardsSliceNew = createSlice({
    name: "boardsNew",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAsyncBoards.pending, (state, action) => {
            state.boardsStatus = STATUS.LOADING;
        })

        .addCase(fetchAsyncBoards.fulfilled, (state, action) => {
            state.boards = action.payload;
            state.boardsStatus = STATUS.SUCCEEDED;
        })
        
        .addCase(fetchAsyncBoards.rejected, (state, action) => {
            state.boardsStatus = STATUS.FAILED
        })
    }
});

export const fetchAsyncBoards = createAsyncThunk('boards/fetch', async(limit) => {
    const response = await fetchDataFromApi("/api/boards/");
    return response.data;
});

export const getAllBoards = (state) => state.boards.boards;

export default boardsSliceNew.reducer;