import { createSlice } from '@reduxjs/toolkit';
import { fetchPostLikeStatus, addPostLike, removePostLike } from './likeThunk';

const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    likedPosts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostLikeStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostLikeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const postId = String(action.meta.arg); // 문자열로 변환
        if (action.payload.data) { // 서버에서 true 반환 시
          if (!state.likedPosts.includes(postId)) {
            state.likedPosts.push(postId);
          }
        } else {
          state.likedPosts = state.likedPosts.filter(id => id !== postId);
        }
      })
      .addCase(fetchPostLikeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPostLike.fulfilled, (state, action) => {
        const postId = String(action.meta.arg);
        if (!state.likedPosts.includes(postId)) {
          state.likedPosts.push(postId);
        }
      })
      .addCase(removePostLike.fulfilled, (state, action) => {
        const postId = String(action.meta.arg);
        state.likedPosts = state.likedPosts.filter(id => id !== postId);
      });
  },
});

export default likeSlice.reducer;