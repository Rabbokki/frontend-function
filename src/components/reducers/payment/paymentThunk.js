import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL || "http://backend:8081";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("tempAccessToken");
  const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("tempRefreshToken");

  return {
    ...(accessToken && { Access_Token: accessToken }),
    ...(refreshToken && { Refresh: refreshToken }),
  };
};

export const initiatePayment = createAsyncThunk(
  "payment/initiatePayment",
  async ( paymentData, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();

      // Store tokens in sessionStorage before redirecting to KakaoPay
      if (headers.Access_Token) sessionStorage.setItem("tempAccessToken", headers.Access_Token);
      if (headers.Refresh) sessionStorage.setItem("tempRefreshToken", headers.Refresh);

      const response = await axios.post(
        `${API_URL}/api/payment/ready`,
        paymentData,
        {
          headers,
          withCredentials: true,
        }
      );

      const { next_redirect_pc_url, next_redirect_mobile_url } = response.data.data;
      window.location.href = next_redirect_pc_url || next_redirect_mobile_url; // Redirect user

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const approvePayment = createAsyncThunk(
  "payment/approvePayment",
  async (pgToken, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/payment/success?pg_token=${pgToken}`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
