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
          const response = await axios.get('http://192.168.0.71:8081/account/me', { // 전체 URL로 수정
              headers: { Access_Token: accessToken }, // 헤더 수정
          });
          console.log("fetchUserData 응답:", response.data);
          return response.data.data; // 백엔드 응답 구조에 맞게 조정
      } catch (error) {
          console.error("fetchUserData 오류:", error.response?.data);
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
