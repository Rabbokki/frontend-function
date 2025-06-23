import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedIn: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,
    accessToken: localStorage.getItem("accessToken") || null,
    accountId: localStorage.getItem("accountId") || null,
    email: localStorage.getItem("userEmail") || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loggedIn = true;
            state.loading = false;
            state.accessToken = action.payload.accessToken;
            state.accountId = action.payload.accountId;
            state.email = action.payload.email;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.loggedIn = false;
            state.accessToken = null;
            state.accountId = null;
            state.email = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accountId");
            localStorage.removeItem("userEmail");
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;