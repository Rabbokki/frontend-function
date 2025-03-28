import { createSlice } from "@reduxjs/toolkit";
import { addPostLike, removePostLike, fetchPostLikeStatus } from "./likeThunk";

const initialState = {
  likedPosts: [],
  loading: false,
  error: null,
};

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPostLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPostLike.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.likedPosts.includes(action.payload.postId)) {
          state.likedPosts.push(action.payload.postId);
        }
      })
      .addCase(addPostLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removePostLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePostLike.fulfilled, (state, action) => {
        state.loading = false;
        state.likedPosts = state.likedPosts.filter(postId => postId !== action.payload.postId);
      })
      .addCase(removePostLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostLikeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostLikeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.likedPosts = action.payload.likedPosts || [];
      })
      .addCase(fetchPostLikeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
