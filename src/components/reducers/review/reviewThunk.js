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
        console.log("From review: response data: ", response.data)
        console.log("From review: response data data: ", response.data.data)
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  export const postReview = createAsyncThunk(
    "reviews/postReview",
    async ({ postId, accountId, rating, content }, { rejectWithValue }) => {
      try {
        console.log("Sending review data:", { postId, accountId, rating, content });
        const response = await axios.post(
          `http://localhost:8081/reviews/${postId}`,
          { accountId, rating, content }, 
          { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } } 
        );
        console.log(response.data)
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  

