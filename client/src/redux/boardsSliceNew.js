import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDataFromApi } from "../utils/api";
import { STATUS } from "../utils/status";

const initialState = {
    boards: [],
    dummy: {
        name: 'kethaka'
    },
    boardsStatus: STATUS.IDLE,
    currentBoard: {}
}

const boardsSliceNew = createSlice({
    name: "boardsNew",
    initialState,
    reducers: {
        setCurrentBoard: (state, action) => {
            const { index } = action.payload;

            // Find the board that matches the index
            const selectedBoard = state.boards.find((board, i) => i === index);

            // If a matching board is found, set it as currentBoard
            if (selectedBoard) {
                state.currentBoard = selectedBoard;
            }
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAsyncBoards.pending, (state, action) => {
            state.boardsStatus = STATUS.LOADING;
        })

        .addCase(fetchAsyncBoards.fulfilled, (state, action) => {
            state.boards = action.payload;
            state.currentBoard = action.payload[0];
            state.boardsStatus = STATUS.SUCCEEDED;
        })
        
        .addCase(fetchAsyncBoards.rejected, (state, action) => {
            state.boardsStatus = STATUS.FAILED
        })
    }
});

export const fetchAsyncBoards = createAsyncThunk('boards/fetch', async(limit) => {
    const response = await fetchDataFromApi("/api/boards/boards_by_owner/");
    console.log('responseL: ', response)
    return response;
});

export const getAllBoards = (state) => state.boards.boards;

export default boardsSliceNew;