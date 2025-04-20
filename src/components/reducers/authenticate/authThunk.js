import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import { fetchUserData } from '../user/userThunk';

export const login = (loginData) => async (dispatch) => {
  dispatch(loginStart());
  try {
      const apiUrl = 'https://dopaminex.kro.kr:8443/api/account/login';
      console.log("Sending login request:", apiUrl, loginData);
      const response = await axios.post(apiUrl, loginData, {
          headers: { "Content-Type": "application/json" }
      });
      console.log("Login response:", response.data, response.headers);
      const accessToken = response.headers['access_token'];
      const refreshToken = response.headers['refresh_token'];
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      await dispatch(fetchUserData(accessToken));
      dispatch(loginSuccess());
  } catch (error) {
      console.error("Login error:", error.response?.data, error.message);
      dispatch(loginFailure(error.response?.data?.message || "로그인 실패"));
  }
};

export const googleLogin = () => async (dispatch) => {
  dispatch(loginStart());
  try {
      window.location.href = 'https://dopaminex.kro.kr:8443/oauth2/authorization/google';
  } catch (error) {
      dispatch(loginFailure("Google 로그인 시작에 실패했습니다."));
  }
};