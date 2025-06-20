import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (newUserData, { rejectWithValue }) => {
        try {
            console.log("Registering user with API URL:", process.env.REACT_APP_API_URL);
            const formData = new FormData();
            const dtoBlob = new Blob([JSON.stringify({
                email: newUserData.email,
                nickname: newUserData.nickname,
                password: newUserData.password,
                birthday: newUserData.birthday,
            })], { type: "application/json" });
            formData.append("dto", dtoBlob);
            if (newUserData.imgUrl) {
                if (newUserData.imgUrl.size > 50 * 1024 * 1024) {
                    console.error("Image size exceeds 50MB:", newUserData.imgUrl.size);
                    return rejectWithValue("이미지 파일 크기가 50MB을 초과했습니다.");
                }
                formData.append("accountImg", newUserData.imgUrl);
                console.log("Appended accountImg:", newUserData.imgUrl.name);
            }
            console.log("Sending signup request to:", `${process.env.REACT_APP_API_URL}/api/account/signup`);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/account/signup`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
                timeout: 10000,
            });
            console.log("Register response:", response.data);
            if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
                console.error("Received HTML response:", response.data);
                return rejectWithValue("Unexpected HTML response received instead of JSON.");
            }
            if (response.data.success && response.data.data.accessToken) {
                localStorage.setItem("accessToken", response.data.data.accessToken);
                localStorage.setItem("passwordLength", newUserData.password.length.toString());
                console.log("Stored accessToken:", response.data.data.accessToken);
            }
            return response.data;
        } catch (error) {
            console.error("Register error:", error.message, error.response?.data, error.config?.url);
            return rejectWithValue(error.response?.data?.message || "회원가입에 실패했습니다.");
        }
    }
);

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (accessToken, { rejectWithValue }) => {
        try {
            if (!accessToken) {
                console.error("No accessToken provided for fetchUserData");
                return rejectWithValue("Access token is missing.");
            }
            const apiUrl = `${process.env.REACT_APP_API_URL}/api/account/me`;
            console.log("Sending request to:", apiUrl, "with Access_Token:", accessToken);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Access_Token": accessToken
                },
                withCredentials: true
            };
            console.log("Request config:", config);
            const response = await axios.get(apiUrl, config);
            console.log("User data response:", response.data);
            if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
                console.error("Received HTML response:", response.data);
                return rejectWithValue("Unexpected HTML response received instead of JSON.");
            }
            return response.data;
        } catch (error) {
            console.error("fetchUserData error:", error.message, error.config?.url, error.response?.status);
            return rejectWithValue(error.message || "사용자 데이터를 가져오지 못했습니다.");
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
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/account/me`,
        updatedData,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          withCredentials: true
        }
      );
      console.log("Update user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("updateUserData error:", error.message, error.response?.data);
      return rejectWithValue("사용자 정보를 업데이트하는 데 실패했습니다.");
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
    'user/fetchUserPosts',
    async (accessToken, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/post/user/posts`, {
                headers: { "Access_Token": accessToken }
            });
            console.log("User posts response:", response.data);
            return response.data;
        } catch (error) {
            console.error("fetchUserPosts error:", error.response?.data, error.message);
            return rejectWithValue("사용자의 게시물을 가져오는 데 실패했습니다.");
        }
    }
);