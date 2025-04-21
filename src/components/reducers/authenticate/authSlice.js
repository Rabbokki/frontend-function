import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedIn: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,
    accessToken: localStorage.getItem("accessToken") || null,
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
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.loggedIn = false;
            state.accessToken = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;