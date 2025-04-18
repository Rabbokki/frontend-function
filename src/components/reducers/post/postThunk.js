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

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    const url = "/api/post";
    console.log("Requesting URL:", url);
    try {
      const response = await axios.get(url, { 
        headers: getAuthHeaders(), // 인증 추가
        timeout: 10000 
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
      const response = await axios.get(`/api/post/find/${postId}`, {
        headers: getAuthHeaders(), // 인증 추가
      });
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
        `/api/post/create`,
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
        `/api/post/update/${postId}`,
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
      await axios.delete(`/api/post/delete/${postId}`, {
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