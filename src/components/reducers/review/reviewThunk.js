import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return {
    ...(accessToken && { Access_Token: accessToken }),
    ...(refreshToken && { Refresh: refreshToken }),
  };
};

export const fetchReviews = createAsyncThunk(
    "reviews/fetchReviews", 
    async (postId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`http://localhost:8081/reviews/${postId}`, {
          headers: getAuthHeaders(),
        });
        console.log("response data: ", response.data)
        console.log("response data data: ", response.data.data)
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  export const postReview = createAsyncThunk(
    "reviews/postReview",
    async ({ postId, rating, content }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `http://localhost:8081/reviews/${postId}`,
          { rating, content },  // Send only rating and content as the body
          { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } } 
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  

