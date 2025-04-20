import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import { fetchUserData } from '../user/userThunk';

export const login = (loginData) => async (dispatch) => {
  dispatch(loginStart());
  try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/account/login`;
      console.log("Sending login request:", apiUrl, loginData);
      const response = await axios.post(apiUrl, loginData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
      });
      console.log("Login response:", response.data, response.headers);
      const accessToken = response.headers['access_token'];
      const refreshToken = response.headers['refresh_token'];
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      await dispatch(fetchUserData(accessToken));
      dispatch(loginSuccess());
  } catch (error) {
      console.error("Login error:", error.response?.data, error.message, error.config.url);
      dispatch(loginFailure(error.response?.data?.message || "로그인 실패"));
  }
};

export const googleLogin = () => async (dispatch) => {
  dispatch(loginStart());
  try {
      const googleUrl = `${process.env.REACT_APP_API_URL}/oauth2/authorization/google`;
      console.log("Redirecting to Google OAuth:", googleUrl);
      window.location.href = googleUrl;
  } catch (error) {
      console.error("Google login error:", error.message);
      dispatch(loginFailure("Google 로그인 시작에 실패했습니다."));
  }
};