import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '../reducers/authenticate/authSlice';
import { fetchUserData } from '../reducers/user/userThunk';

const Callback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            dispatch(loginSuccess({ accessToken }));
            dispatch(fetchUserData(accessToken));
            navigate('/account');
        } else {
            console.error("No tokens found in callback URL");
            navigate('/authenticate');
        }
    }, [dispatch, navigate, location]);

    return <div>Loading...</div>;
};

export default Callback;