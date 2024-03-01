import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDataFromApi, postDataToApi } from "../utils/api";
import { STATUS } from "../utils/status";
import { jwtDecode } from "jwt-decode";

const initialState = {
    authTokens: localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null,
    userStatus: STATUS.IDLE,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state, action) => {
            localStorage.removeItem('authTokens');
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state, action) => {
            state.userStatus = STATUS.LOADING;
        })

        .addCase(login.fulfilled, (state, action) => {
            state.userStatus = STATUS.SUCCEEDED;

            // Store the payload in localStorage under 'authTokens'
            const { payload } = action;
            localStorage.setItem('authTokens', JSON.stringify(payload));

            // Decode the JWT and update state.user with the decoded username
            const decodedToken = jwtDecode(payload.access);
            state.user = decodedToken.username;
        })
        
        .addCase(login.rejected, (state, action) => {
            state.userStatus = STATUS.FAILED
        })
    }
});

export const login = createAsyncThunk('api/token/', async(data) => {
    const response = await postDataToApi("api/token/", data);
    return response;
});

export const getAllBoards = (state) => state.boardsNew.boards;

export default authSlice;