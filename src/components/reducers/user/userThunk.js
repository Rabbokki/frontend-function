import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BASE_URL;



export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (newUserData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/account/signup`, newUserData);
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
  "user/fetchUserData",
  async (accessToken, { rejectWithValue }) => {
    if (!accessToken || typeof accessToken !== "string" || accessToken.trim() === "") {
      return rejectWithValue("유효하지 않은 액세스 토큰입니다.");
    }
    try {
      const response = await axios.get(`${baseUrl}/account/me`, {
        headers: { "Access_Token": accessToken },
      });
      console.log("fetchUserData 요청 헤더:", { "Access_Token": accessToken });
      console.log("fetchUserData 응답:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("fetchUserData 오류:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "사용자 정보를 가져오는 데 실패했습니다.");
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
      const response = await axios.put(`${baseUrl}/account/me`, updatedData, {
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
