import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../../components/reducers/post/postThunk";
import { addPostLike, removePostLike, fetchPostLikeStatus } from "../../components/reducers/likes/likeThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./detail.css";
import { useNavigate } from 'react-router-dom';

const DetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { postDetail, loading, error } = useSelector((state) => state.posts);
  const { likedPosts } = useSelector((state) => state.likes);
  const { userData } = useSelector((state) => state.user); // userSlice에서 userData

  const [isLiked, setIsLiked] = useState(() => likedPosts.includes(id));
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  useEffect(() => {
    console.log('postDetail updated:', postDetail);
    if (postDetail) {
      console.log('sellerEmail:', postDetail.sellerEmail);
      dispatch(fetchPostLikeStatus(postDetail.id));
    }
  }, [dispatch, postDetail]);

  useEffect(() => {
    if (postDetail && likedPosts) {
      setIsLiked(likedPosts.includes(postDetail.id));
    }
  }, [likedPosts, postDetail]);

  const handleLikeToggle = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    if (newLikedState) {
      dispatch(removePostLike(postDetail.id));
    } else {
      dispatch(addPostLike(postDetail.id));
    }
  };

  const handleChat = async () => {
    console.log('handleChat called');
    const accessToken = localStorage.getItem('accessToken');
    console.log('accessToken from localStorage:', accessToken);
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    const userEmail = userData?.email || localStorage.getItem('userEmail');
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      console.warn('userEmail not found, extracting from JWT');
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const extractedEmail = payload.sub;
      localStorage.setItem('userEmail', extractedEmail);
      console.log('Extracted userEmail from JWT:', extractedEmail);
    }

    console.log('Sending chat request with targetEmail:', postDetail.sellerEmail);
    console.log('Request headers:', { 'Access_Token': accessToken });

    try {
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access_Token': accessToken
        },
        body: JSON.stringify({ targetEmail: postDetail.sellerEmail })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      if (data.success) {
        navigate(`/chat/${data.data.roomName}`, { state: { roomId: data.data.id } });
      } else {
        alert('채팅방 생성 실패');
      }
    } catch (error) {
      console.error('Chat request failed:', error);
      alert('채팅 요청 중 오류 발생');
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!postDetail) return <p className="not-found">Post not found.</p>;

  return (
    <div className="detail-page">
      <div className="left-section">
        <img
          src={postDetail.imageUrls && postDetail.imageUrls[0]}
          alt="product"
          className="img-fluid"
        />
      </div>
      <div className="right-section">
        <h1 className="product-title">{postDetail.title}</h1>
        <p className="product-price">{postDetail.price}원</p>
        <p className="product-content">{postDetail.content}</p>
        <div className="buttons">
          <button
            className={`wishlist ${isLiked ? "liked" : ""}`}
            onClick={handleLikeToggle}
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={isLiked ? "liked" : "unliked"}
            />
          </button>
          <button
            className="chat"
            onClick={handleChat}
            disabled={!postDetail.sellerEmail}
          >
            번개톡
          </button>
          <button className="buy-now">바로구매</button>
          <button className="bookmark">북마크</button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;