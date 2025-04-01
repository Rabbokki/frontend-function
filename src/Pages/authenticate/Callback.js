import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginSuccess, loginFailure } from '../../components/reducers/authenticate/authSlice';
import { fetchUserData } from '../../components/reducers/user/userThunk'; // fetchUserData는 authThunk에서

const Callback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    console.log('Callback - Access Token:', accessToken);
    console.log('Callback - Refresh Token:', refreshToken);

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      dispatch(loginSuccess());
      dispatch(fetchUserData(accessToken));
      navigate('/account');
    } else {
      dispatch(loginFailure('Google 로그인 토큰을 받지 못했습니다.'));
      navigate('/authenticate');
    }
  }, [searchParams, dispatch, navigate]);

  return <div>로그인 처리 중...</div>;
};

export default Callback;