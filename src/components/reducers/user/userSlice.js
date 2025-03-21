import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData, updateUserData, registerUser } from './userThunk';

const initialState = {
  userData: null,
  loading: false,
  error: null,
  passwordLength: 0,
  registered: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPasswordLength: (state, action) => {
      state.passwordLength = action.payload;
    },
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
      });
  },
});

export const { setPasswordLength } = userSlice.actions;
export default userSlice.reducer;