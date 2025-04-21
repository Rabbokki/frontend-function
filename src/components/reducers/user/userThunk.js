import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserDataStart, fetchUserDataSuccess, fetchUserDataFailure } from './userSlice';

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (newUserData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            const dtoBlob = new Blob([JSON.stringify({
                email: newUserData.email,
                nickname: newUserData.nickname,
                password: newUserData.password,
                birthday: newUserData.birthday,
            })], { type: "application/json" });
            formData.append("dto", dtoBlob);
            if (newUserData.imgUrl) {
                formData.append("accountImg", newUserData.imgUrl);
            }
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/account/signup`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 10000,
            });
            return response.data;
        } catch (error) {
            console.error("registerUser error:", error.response?.data, error.message);
            return rejectWithValue(error.response?.data?.message || "회원가입에 실패했습니다.");
        }
    }
);

export const fetchUserData = (accessToken) => async (dispatch) => {
    dispatch(fetchUserDataStart());
    try {
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
        dispatch(fetchUserDataSuccess(response.data));
    } catch (error) {
        console.error("fetchUserData error:", error.message, error.config?.url, error.response?.status);
        dispatch(fetchUserDataFailure(error.message || "사용자 데이터를 가져오지 못했습니다."));
    }
};

export const updateUserData = createAsyncThunk(
    'user/updateUserData',
    async (updatedData, { rejectWithValue }) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return rejectWithValue("로그인 상태가 아닙니다.");
        }
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/account/me`, updatedData, {
                headers: { "Access_Token": accessToken }
            });
            return response.data;
        } catch (error) {
            console.error("updateUserData error:", error.response?.data, error.message);
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
            return response.data;
        } catch (error) {
            console.error("fetchUserPosts error:", error.response?.data, error.message);
            return rejectWithValue("사용자의 게시물을 가져오는 데 실패했습니다.");
        }
    }
);