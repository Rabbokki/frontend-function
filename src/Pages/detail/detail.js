import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, deletePost } from "../../components/reducers/post/postThunk";
import { addPostLike, removePostLike, fetchPostLikeStatus } from "../../components/reducers/likes/likeThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./detail.css";

const DetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { postDetail, loading, error } = useSelector((state) => state.posts);
  const { likedPosts } = useSelector((state) => state.likes);
  const { userData } = useSelector((state) => state.user); // userSlice에서 userData

  const [isLiked, setIsLiked] = useState(() => likedPosts.includes(id));
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
      dispatch(addPostLike(postDetail.id));
    } else {
      dispatch(removePostLike(postDetail.id));
    }
  };

  const handleChat = async () => {
    console.log('handleChat called');
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/authenticate');
      return;
    }
  
    if (!postDetail.sellerEmail) {
      alert('판매자 정보를 찾을 수 없습니다.');
      return;
    }
  
    const userEmail = userData?.email || localStorage.getItem('userEmail') || (() => {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const extractedEmail = payload.sub;
      localStorage.setItem('userEmail', extractedEmail);
      return extractedEmail;
    })();
  
    console.log('Current user email:', userEmail);
    console.log('Target email (seller):', postDetail.sellerEmail);
  
    try {
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access_Token': accessToken,
        },
        body: JSON.stringify({ targetEmail: postDetail.sellerEmail }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Chat creation response:', JSON.stringify(data, null, 2));
      if (data.success) {
        const roomName = data.data.roomName;
        if (!roomName) {
          console.error('Response data:', data.data);
          throw new Error('Room name is missing in response');
        }
        navigate(`/chat/${roomName}`, { state: { roomId: data.data.id } });
      } else {
        alert(`채팅방 생성 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Chat request failed:', error);
      alert(`채팅 요청 중 오류 발생: ${error.message}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm('정말 지울 거냐?')) {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        navigate('/authenticate');
        return;
      }
  
      dispatch(deletePost({ postId: id, accessToken }))
        .unwrap()
        .then(() => {
          alert('삭제 완료!');
          navigate('/'); // 삭제 후 홈으로 이동 (또는 적절한 페이지)
        })
        .catch((error) => {
          alert(`삭제 실패: ${error}`);
        });
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
          <button 
            onClick={() => navigate(`/detail/${id}/reviews`, {
              state: {
                      title: postDetail.title,
                      image: postDetail.imageUrls && postDetail.imageUrls[0],
                      postId: id
                      }
            })} 
            className="review">
              리뷰
          </button>
          <button onClick={() => navigate(`/updatePost/${id}`, {
              state: {
                      title: postDetail.title,
                      content: postDetail.content,
                      price: postDetail.price,
                      image: postDetail.imageUrls && postDetail.imageUrls[0],
                      postId: id
                      }
            })} className="edit">
            수정
          </button>
          <button onClick={handleDelete} className="delete">
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;