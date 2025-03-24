import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (newUserData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/account/signup', newUserData);
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.error.message);
      }
    } catch (error) {
      return rejectWithValue("회원가입에 실패했습니다.");
    }
  }
);

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get('/account/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("사용자 정보를 가져오는 데 실패했습니다.");
    }
  }
);

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (updatedData, { rejectWithValue, getState }) => {
    const { user } = getState();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return rejectWithValue("로그인 상태가 아닙니다.");
    }

    try {
      const response = await axios.put('/account/me', updatedData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.data.success) {
        return updatedData;
      } else {
        return rejectWithValue(response.data.error.message);
      }
    } catch (error) {
      return rejectWithValue("사용자 정보를 업데이트하는 데 실패했습니다.");
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'user/fetchUserPosts',
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get('/post/user/posts', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("사용자의 게시물을 가져오는 데 실패했습니다.");
    }
  }
);