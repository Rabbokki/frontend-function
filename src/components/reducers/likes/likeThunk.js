import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL || "http://backend:8081";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return {
    ...(accessToken && { Access_Token: accessToken }),
    ...(refreshToken && { Refresh: refreshToken }),
  };
};

export const addPostLike = createAsyncThunk(
  "likes/addPostLike",
  async (postId, { rejectWithValue }) => {
    console.log("Add like")
    try {
      const response = await axios.post(`${API_URL}/api/likes/${postId}`, {}, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to like post");
    }
  }
);

export const removePostLike = createAsyncThunk(
  "likes/removePostLike",
  async (postId, { rejectWithValue }) => {
    console.log("Remove like")
    try {
      const response = await axios.delete(`${API_URL}/api/${postId}`, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove like");
    }
  }
);

export const fetchPostLikeStatus = createAsyncThunk(
  "likes/fetchPostLikeStatus",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/likes/status/${postId}`, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch like status");
    }
  }
);
