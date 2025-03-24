import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return {
    ...(accessToken && { Access_Token: accessToken }),
    ...(refreshToken && { Refresh: refreshToken }),
  };
};

// ✅ Like a post (POST)
export const addPostLike = createAsyncThunk(
  "likes/addPostLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:8081/likes/${postId}`, {}, {
        headers: getAuthHeaders(),
      });

      return response.data; // Response from the server
    } catch (error) {
      // Error handling: Return server response if available or fallback to a default message
      return rejectWithValue(error.response?.data || "Failed to like post");
    }
  }
);

// ✅ Unlike a post (DELETE)
export const removePostLike = createAsyncThunk(
  "likes/removePostLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:8081/likes/${postId}`, {
        headers: getAuthHeaders(),
      });

      return response.data; // Response from the server
    } catch (error) {
      // Error handling: Return server response if available or fallback to a default message
      return rejectWithValue(error.response?.data || "Failed to remove like");
    }
  }
);

// ✅ Fetch like status (GET)
export const fetchPostLikeStatus = createAsyncThunk(
  "likes/fetchPostLikeStatus",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8081/likes/status/${postId}`, {
        headers: getAuthHeaders(),
      });

      return response.data; // Response from the server
    } catch (error) {
      // Error handling: Return server response if available or fallback to a default message
      return rejectWithValue(error.response?.data || "Failed to fetch like status");
    }
  }
);
