import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return {
    ...(accessToken && { Access_Token: accessToken }),
    ...(refreshToken && { Refresh: refreshToken }),
  };
};

export const addPostLike = createAsyncThunk(
  "like/addPostLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/likes/${postId}`, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to like post");
    }
  }
);

export const removePostLike = createAsyncThunk(
  "like/removePostLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/likes/${postId}`, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove like");
    }
  }
);

export const fetchPostLikeStatus = createAsyncThunk(
  "like/fetchPostLikeStatus",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/likes/status/${postId}`, {
        headers: getAuthHeaders(),
      });

      return response.data; // Should return the like status (true/false)
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch like status");
    }
  }
);
