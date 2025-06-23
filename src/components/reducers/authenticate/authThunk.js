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
        console.log("Login response:", response.data);
        if (response.data.success) {
            console.log("Login data:", response.data.data);
            const { accessToken, refreshToken, accountId, email } = response.data.data;
            if (!email) {
                console.warn("Email missing in login response:", response.data.data);
            }
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("accountId", accountId);
            localStorage.setItem("userEmail", email || "");
            console.log("Stored tokens:", { accessToken, refreshToken, accountId, userEmail: email });
            await dispatch(fetchUserData(accessToken));
            dispatch(loginSuccess({ accessToken, accountId, email }));
        } else {
            throw new Error(response.data.message || "로그인 실패");
        }
    } catch (error) {
        console.error("Login error:", error.response?.data, error.message, error.config?.url);
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

export const kakaoLogin = () => async (dispatch) => {
    dispatch(loginStart());
    try {
        const kakaoUrl = `${process.env.REACT_APP_API_URL}/oauth2/authorization/kakao`;
        console.log("Redirecting to Kakao OAuth:", kakaoUrl);
        window.location.href = kakaoUrl;
    } catch (error) {
        console.error("Kakao login error:", error.message);
        dispatch(loginFailure("Kakao 로그인 시작에 실패했습니다."));
    }
};

// OAuth 콜백 처리
export const handleOAuthCallback = (params) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/account/oauth/callback`;
        console.log("Handling OAuth callback:", params);
        const response = await axios.get(apiUrl, { params });
        console.log("OAuth callback response:", response.data);
        if (response.data.success) {
            const { accessToken, refreshToken, accountId, email } = response.data.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("accountId", accountId);
            localStorage.setItem("userEmail", email);
            console.log("Stored OAuth tokens:", { accessToken, refreshToken, accountId, userEmail: email });
            await dispatch(fetchUserData(accessToken));
            dispatch(loginSuccess({ accessToken, accountId, email }));
        } else {
            throw new Error(response.data.message || "OAuth 로그인 실패");
        }
    } catch (error) {
        console.error("OAuth callback error:", error.response?.data, error.message);
        dispatch(loginFailure(error.response?.data?.message || "OAuth 로그인 실패"));
    }
};