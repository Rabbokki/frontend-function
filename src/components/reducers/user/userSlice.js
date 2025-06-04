import { createSlice } from '@reduxjs/toolkit';
import { registerUser, fetchUserData, updateUserData, fetchUserPosts } from './userThunk';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                console.log("fetchUserData fulfilled, payload:", action.payload);
                state.userData = action.payload.data; // { accountId, email, nickname, imgUrl, postList, bookMarks, reviews }
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
                state.userData = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.userData.postList = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;