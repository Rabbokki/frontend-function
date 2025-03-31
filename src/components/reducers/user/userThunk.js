import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (newUserData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Convert newUserData to a JSON string and append it as 'dto' with explicit content type
      const dtoBlob = new Blob([JSON.stringify({
        email: newUserData.email,
        nickname: newUserData.nickname,
        password: newUserData.password,
        birthday: newUserData.birthday,
      })], { type: "application/json" });

      formData.append("dto", dtoBlob); // Explicitly set the type

      // Append the image if available
      if (newUserData.imgUrl) {
        formData.append("accountImg", newUserData.imgUrl);
      }

      const response = await axios.post('/account/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Keep multipart format
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "회원가입에 실패했습니다.");
    }
  }
);

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get('/account/me', {
        headers: { "Access_Token": accessToken } // 백엔드와 헤더 이름 일치
      });
      return response.data.data; // "data"만 반환하도록 수정
    } catch (error) {
      return rejectWithValue("사용자 정보를 가져오는 데 실패했습니다.");
    }
  }
);

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (updatedData, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return rejectWithValue("로그인 상태가 아닙니다.");
    }

    try {
      const response = await axios.put('/account/me', updatedData, {
        headers: { Authorization: `${accessToken}` }
      });
      return response.data;
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