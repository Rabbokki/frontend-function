import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from '../../Components/reducers/user/userThunk';
import { logout } from '../../Components/reducers/authenticate/authSlice';
import "./detail.css";

const baseUrl = "http://192.168.0.71:8081";

const DetailPage = () => {
    const { id } = useParams();
    const [postDetail, setPostDetail] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sender = useSelector((state) => state.user.userData?.email); // 수정: userData.email 참조
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!id || id === "undefined") {
            console.log("유효하지 않은 ID:", id);
            setError("잘못된 게시글 ID입니다.");
            return;
        }

        const initialize = async () => {
            if (!accessToken) {
                console.log("액세스 토큰 없음");
                navigate("/login");
                return;
            }

            try {
                // 사용자 데이터 가져오기
                const userData = await dispatch(fetchUserData(accessToken)).unwrap();
                console.log("가져온 사용자 데이터:", userData);

                // 게시글 데이터 가져오기
                const response = await axios.get(`${baseUrl}/post/find/${id}`, {
                    headers: { Access_Token: accessToken },
                });
                console.log("가져온 게시글 데이터:", response.data);
                setPostDetail(response.data);
            } catch (err) {
                console.error("초기화 오류:", err);
                if (err.response?.status === 401) {
                    alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    dispatch(logout());
                    dispatch({ type: 'user/logout' });
                    navigate("/login");
                } else {
                    setError("데이터를 불러오는 중 오류가 발생했습니다: " + err.message);
                }
            }
        };

        initialize();
    }, [id, accessToken, dispatch, navigate]);

    const handleChat = async () => {
        const receiver = postDetail.authorEmail;
        console.log("Sender:", sender);
        console.log("Receiver:", receiver);
        console.log("Access Token:", accessToken);

        if (!sender || !receiver) {
            alert("사용자 정보가 올바르지 않습니다. 로그인 상태를 확인하거나 게시글 정보를 확인하세요.");
            return;
        }

        try {
            const response = await axios.post(
                `${baseUrl}/chat`,
                { targetEmail: receiver },
                { headers: { Access_Token: accessToken } }
            );
            const roomName = response.data.data.roomName;
            if (!roomName) {
                throw new Error("roomName이 응답에 없습니다.");
            }
            navigate(`/chat/${roomName}`);
        } catch (error) {
            console.error("채팅 오류:", error);
            alert("채팅방 생성 실패: " + (error.response?.data?.message || "서버 오류"));
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!id || id === "undefined") {
        return <p>잘못된 접근입니다. 유효한 게시글 ID가 필요합니다.</p>;
    }

    if (!postDetail || Object.keys(postDetail).length === 0) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="detail-page">
            <div className="left-section">
                <img
                    src={postDetail.imageUrls && postDetail.imageUrls[0]}
                    alt="product"
                    className="img-fluid"
                />
                <h1>{postDetail.title}</h1>
            </div>
            <div className="right-section">
                <div className="info">
                    <p>{postDetail.price}원</p>
                    <p>{postDetail.content}</p>
                </div>
                <div className="buttons">
                    <button>BookMark</button>
                    <button onClick={handleChat}>채팅</button>
                    <button>바로구매</button>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;