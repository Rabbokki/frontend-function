import { useEffect, useState } from 'react';
import axios from 'axios';

const MyPage = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    setError('로그인 상태가 아닙니다.');
                    return;
                }
                
                const response = await axios.get('/account/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                
                setUserData(response.data.data);  // Assuming `data` contains user info
            } catch (error) {
                setError('사용자 정보를 가져오는 데 실패했습니다.');
                console.error(error);
            }
        };

        fetchUserData();
    }, []);

    if (error) return <div>{error}</div>;

    return (
        <div>
            {userData ? (
                <form>
                    <div>아이디: {userData.id}</div>
                    <div>이메일: {userData.email}</div>
                    <div>닉네임: {userData.nickname}</div>
                </form>
            ) : (
                <p>사용자 정보를 로드 중...</p>
            )}
        </div>
    );
};

export default MyPage;