import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '../../components/reducers/authenticate/authSlice';
import { fetchUserData } from '../../components/reducers/user/userThunk';

const Callback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const accountId = params.get('accountId');

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            if (accountId) localStorage.setItem('accountId', accountId);
            console.log("OAuth callback: Stored tokens:", { accessToken, refreshToken, accountId });
            dispatch(loginSuccess({ accessToken, accountId: accountId || null }));
            dispatch(fetchUserData(accessToken))
                .unwrap()
                .then(() => navigate('/'))
                .catch((error) => {
                    console.error("Failed to fetch user data in Callback:", error);
                    navigate('/authenticate');
                });
        } else {
            console.error("No tokens found in callback URL:", params.toString());
            navigate('/authenticate');
        }
    }, [dispatch, navigate, location]);

    return <div>Loading...</div>;
};

export default Callback;