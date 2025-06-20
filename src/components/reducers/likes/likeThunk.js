import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("Access Token from localStorage:", accessToken);
  console.log("Refresh Token from localStorage:", refreshToken);
  const headers = {};
  if (accessToken) headers["Access_Token"] = accessToken;
  if (refreshToken && refreshToken !== "undefined") headers["Refresh"] = refreshToken;  // "undefined" 문자열 방지
  console.log("Prepared headers:", headers);
  return headers;
};

export const addPostLike = createAsyncThunk(
  "likes/addPostLike",
  async (postId, { rejectWithValue }) => {
    console.log("Add like");
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/likes/${postId}`, {}, {
        headers: getAuthHeaders(),
      });

      if (response.data?.success === false) {
        console.warn("Backend said like already exists:", response.data);
        return rejectWithValue(response.data?.error || "이미 좋아요 되있음.");
      }

      return response.data;

    } catch (error) {
      console.error("Like failed:", error);
      return rejectWithValue(error.response?.data || "Failed to like post");
    }
  }
);

export const removePostLike = createAsyncThunk(
  "likes/removePostLike",
  async (postId, { rejectWithValue }) => {
    console.log("Remove like for postId:", postId);
    const headers = getAuthHeaders();
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/likes/${postId}`, {
        headers,
        withCredentials: true,  // 인증 정보 포함 (필요 시)
      });
      console.log("Remove like response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Remove like error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to remove like");
    }
  }
);

export const fetchPostLikeStatus = createAsyncThunk(
  "likes/fetchPostLikeStatus",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/likes/status/${postId}`, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch like status");
    }
  }
);
