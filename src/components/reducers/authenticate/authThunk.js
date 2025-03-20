import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from './authSlice';

export const login = (loginData) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post("/account/login", loginData);
    const accessToken = response.headers['access_token'];
    const refreshToken = response.headers['refresh_token'];
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      dispatch(loginSuccess());
    }
  } catch (error) {
    dispatch(loginFailure("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요."));
  }
};
