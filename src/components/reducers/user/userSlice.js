import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData, updateUserData, registerUser, fetchUserPosts } from './userThunk';

const initialState = {
    userData: null,
    loading: false,
    error: null,
    registered: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setRegistered: (state, action) => {
            state.registered = action.payload;
        },
        logout: (state) => {
            state.userData = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserData.fulfilled, (state, action) => {
                state.userData = { ...state.userData, ...action.payload };
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.loading = false;
                state.error = null;
                state.registered = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.registered = false;
            })
            .addCase(fetchUserPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.userPosts = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setRegistered, logout } = userSlice.actions;
export default userSlice.reducer;