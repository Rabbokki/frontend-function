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

export const initiatePayment = createAsyncThunk(
  "payment/initiatePayment",
  async ({ postId, amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/payment/ready",
        { postId, amount },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error initiating payment:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
