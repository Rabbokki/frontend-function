// import axios from 'axios';
// import { loginStart, loginSuccess, loginFailure } from './authSlice';

// export const login = (loginData) => async (dispatch) => {
//   dispatch(loginStart());
//   try {
//     const response = await axios.post("/account/login", loginData);
//     const accessToken = response.headers['access_token'];
//     const refreshToken = response.headers['refresh_token'];
//     if (accessToken) {
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);
//       dispatch(loginSuccess());
//     }
//   } catch (error) {
//     dispatch(loginFailure("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요."));
//   }
// };

// import axios from 'axios';
// import { loginStart, loginSuccess, loginFailure } from './authSlice';
// import { fetchUserData } from './userThunk';

// export const login = (loginData) => async (dispatch) => {
//   dispatch(loginStart());
//   try {
//     const response = await axios.post("/account/login", loginData);
//     const accessToken = response.headers['access_token'];
//     const refreshToken = response.headers['refresh_token'];
//     if (accessToken) {
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);
//       localStorage.setItem("userEmail", loginData.email); // 이메일 저장
//       await dispatch(fetchUserData(accessToken)); // 사용자 정보 가져오기
//       dispatch(loginSuccess());
//     }
//   } catch (error) {
//     dispatch(loginFailure("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요."));
//   }
// };

import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserData } from '../user/userThunk';

const API_URL = process.env.REACT_APP_BASE_URL || "http://backend:8081";

// 로그인 thunk
export const login = (loginData) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(`${API_URL}/account/login`, loginData);
    const accessToken = response.headers['access_token'];
    const refreshToken = response.headers['refresh_token'];
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userEmail", loginData.email);
      localStorage.setItem("passwordLength", loginData.password.length);
      console.log("Trying to log in...")
      await dispatch(fetchUserData(accessToken)); // 사용자 정보 가져오기
      dispatch(loginSuccess());
    }
  } catch (error) {
    dispatch(loginFailure("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요."));
  }
};

export const googleLogin = () => async (dispatch) => {
  dispatch(loginStart());
  try {
    // Google OAuth2 인증 페이지로 리다이렉션
    window.location.href = `${API_URL}/oauth2/authorization/google`;
  } catch (error) {
    dispatch(loginFailure("Google 로그인 시작에 실패했습니다."));
  }
};

// fetchUserData thunk (userThunk에서 이동)
// export const fetchUserData = createAsyncThunk(
//   'user/fetchUserData',
//   async (accessToken, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('/account/me', {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       });
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue("사용자 정보를 가져오는 데 실패했습니다.");
//     }
//   }
// );