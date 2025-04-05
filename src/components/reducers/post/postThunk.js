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

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    console.log("Requesting URL:", `${API_URL}/api/post`);
    try {
      const response = await axios.get(`${API_URL}/api/post`, {
        timeout: 10000, // 10초 타임아웃
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Fetch error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch posts");
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/post/find/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch post");
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ formData, accessToken }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/post/create`,
        formData,
        {
          headers: { Access_Token: accessToken },
          withCredentials: true,
        }
      );
      console.log("✅ Post creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating post:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ formData, postId, accessToken }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/post/update/${postId}`,
        formData,
        {
          headers: {
            Access_Token: accessToken,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId, accessToken }, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/api/post/delete/${postId}`, {
        headers: {
          Access_Token: accessToken,
        },
        withCredentials: true,
      });
      return postId;
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);