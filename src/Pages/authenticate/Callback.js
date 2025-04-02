// src/components/Callback.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginSuccess, loginFailure } from '../../components/reducers/authenticate/authSlice';
import { fetchUserData } from '../../components/reducers/user/userThunk';

const Callback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("Current URL:", window.location.href); // 전체 URL 출력
    const accessToken = searchParams.get('accessToken')?.trim();
    const refreshToken = searchParams.get('refreshToken')?.trim();
    console.log('Callback - Access Token:', accessToken);
    console.log('Callback - Refresh Token:', refreshToken);
    console.log('Callback - Access Token structure:', accessToken?.split('.').length === 3 ? 'Valid JWT' : 'Invalid JWT');

    if (accessToken && refreshToken && accessToken.split('.').length === 3) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      dispatch(loginSuccess());

      dispatch(fetchUserData(accessToken))
        .unwrap()
        .then(() => {
          navigate('/account');
        })
        .catch((error) => {
          console.error('Fetch user data failed in Callback:', error);
          dispatch(loginFailure('사용자 데이터를 가져오지 못했습니다.'));
          navigate('/authenticate');
        });
    } else {
      dispatch(loginFailure('유효하지 않은 Google 로그인 토큰입니다.'));
      navigate('/authenticate');
    }
  }, [searchParams, dispatch, navigate]);

  return <div>로그인 처리 중...</div>;
};

export default Callback;