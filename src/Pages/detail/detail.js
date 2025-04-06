import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../../components/reducers/post/postThunk";
import { addPostLike, removePostLike, fetchPostLikeStatus } from "../../components/reducers/likes/likeThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart, faEye, faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { faHeart, faEye, faStar } from "@fortawesome/free-solid-svg-icons";
import "./detail.css";

const DetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { postDetail, loading, error } = useSelector((state) => state.posts);
  const { likedPosts } = useSelector((state) => state.likes);

  const [isLiked, setIsLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const baseUrlsee = process.env.REACT_APP_BASE_URL || "http://192.168.0.71:8081";


  const [cartAdd ,setCartAdd] = useState(false)

  useEffect(() => {
    dispatch(fetchPostById(id));
    dispatch(fetchPostLikeStatus(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (postDetail) {
      console.log('Redux postDetail:', postDetail);
      setLocalLikeCount(postDetail.likeCount);
    }
  }, [postDetail]);

  useEffect(() => {
    if (likedPosts) {
      const liked = likedPosts.includes(String(id));
      setIsLiked(liked);
      console.log('likedPosts:', likedPosts, 'isLiked:', liked);
    }
  }, [likedPosts, id]);

  const handleLikeToggle = async () => {
    if (isLoading) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/authenticate");
      return;
    }
  
    setIsLoading(true);
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLocalLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));
  
    try {
      if (newLikedState) {
        await dispatch(addPostLike(id)).unwrap();
      } else {
        await dispatch(removePostLike(id)).unwrap();
      }
      const status = await dispatch(fetchPostLikeStatus(id)).unwrap();
      setIsLiked(status.data);  // 서버 상태로 동기화
      const updatedPost = await dispatch(fetchPostById(id)).unwrap();  // 최신 게시물 정보 가져오기
      setLocalLikeCount(updatedPost.likeCount);  // 최신 좋아요 수 반영
    } catch (error) {
      console.error("Like toggle failed:", error);
      setIsLiked(!newLikedState);  // 롤백
      setLocalLikeCount((prev) => (newLikedState ? prev - 1 : prev + 1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async (postId, sellerEmail) => {
    console.log('handleChat called');
    const accessToken = localStorage.getItem('accessToken');
    const sender = localStorage.getItem('userEmail');

    if (!accessToken || !sender) {
        alert('로그인이 필요합니다.');
        navigate('/authenticate');
        return;
    }

    console.log('Sender:', sender);
    console.log('Receiver:', sellerEmail);
    console.log('PostId:', postId);

    if (sender === sellerEmail) {
        console.log('Sender and receiver are the same:', sender);
        alert('자신과는 채팅할 수 없습니다.');
        return;
    }

    try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        console.log('Token expiration:', new Date(payload.exp * 1000).toISOString());
        if (Date.now() > payload.exp * 1000) {
            alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
            navigate('/authenticate');
            localStorage.removeItem('accessToken');
            return;
        }

        console.log('Fetching existing chat rooms...');
        const chatRoomsResponse = await axios.get(`${baseUrl}/chat/rooms`, {
            headers: { 'Access_Token': accessToken },
        });
        console.log('Chat rooms full response:', chatRoomsResponse.data);
        const rooms = chatRoomsResponse.data.content || chatRoomsResponse.data.data || [];
        console.log('Chat rooms list:', rooms.map(room => ({
            roomName: room.roomName,
            postId: room.postId,
            sender: room.sender,
            receiver: room.receiver,
        })));

        const existingRoom = rooms.find(room => {
            const matchPostId = room.postId === postId;
            const matchUsers = 
                (room.sender === sender && room.receiver === sellerEmail) || 
                (room.sender === sellerEmail && room.receiver === sender);
            console.log(`Checking room: ${room.roomName}, PostId match: ${matchPostId}, Users match: ${matchUsers}`);
            return matchPostId && matchUsers;
        });

        if (existingRoom) {
            console.log('Existing room found:', existingRoom.roomName);
            navigate(`/chat/${existingRoom.roomName}`, {
                state: {
                    postId,
                    sellerEmail,
                    image: postDetail.imageUrls && postDetail.imageUrls[0],
                    title: postDetail.title,
                    price: postDetail.price,
                    content: postDetail.content,
                    sellerNickname: postDetail.sellerNickname,
                },
            });
            return;
        }

        console.log('No existing room found, creating new chat room...');
        const response = await axios.post(
            `${baseUrl}/chat`,
            { postId, targetEmail: sellerEmail },
            { headers: { 'Access_Token': accessToken } }
        );
        console.log('Chat creation response:', response.data);
        if (response.data.success) {
            navigate(`/chat/${response.data.data.roomName}`, {
                state: {
                    postId,
                    sellerEmail,
                    image: postDetail.imageUrls && postDetail.imageUrls[0],
                    title: postDetail.title,
                    price: postDetail.price,
                    content: postDetail.content,
                    sellerNickname: postDetail.sellerNickname,
                },
            });
        } else {
            alert(`채팅방 생성 실패: ${response.data.error || '알 수 없는 오류'}`);
        }
    } catch (error) {
        console.error('Chat handling failed:', error);
        if (error.response) console.log('Error response:', error.response.data);
        alert(`채팅 처리 중 오류 발생: ${error.message}`);
    }
};

  const handleBuyNow = () => {
    if (!postDetail) {
      alert("상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    navigate(`/payment/${id}`, {
      state: {
        title: postDetail.title,
        price: postDetail.price,
        image: postDetail.imageUrls && postDetail.imageUrls[0],
        postId: id,
      },
    });
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!postDetail) return <p className="not-found">Post not found.</p>;
  const accessToken = localStorage.getItem("accessToken");
  console.log("이것은 토큰이여" , accessToken)
  console.log(postDetail)
  const handleCartAdd = async()=>{
    await axios.post(`${baseUrlsee}/cart/add/${id}` , {} , {
      headers: { Access_Token: accessToken} ,
    }).catch((err)=>{
      console.log("이것은 에러여" , err)
    })
    setCartAdd(true);
    alert("장바구니에 추가되었습니다.");
  }

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
        <span className="views">
          <FontAwesomeIcon icon={faEye} className="eye-icon" /> {postDetail.viewCount}
          <FontAwesomeIcon icon={faHeart} className="heart-icon" /> {localLikeCount}
          <FontAwesomeIcon icon={faStar} className="star-icon" />{" "}
          {postDetail.averageRating ? postDetail.averageRating.toFixed(1) : 'No rating'}
        </span>
        <p className="product-price">{postDetail.price}원</p>
        <p className="product-content">{postDetail.content}</p>
        <p className="time-ago">{postDetail.timeAgo}</p>
        <div className="buttons">
          <button
            className={`wishlist ${isLiked ? "liked" : ""}`}
            onClick={handleLikeToggle}
            disabled={isLoading}
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={isLiked ? "liked" : "unliked"}
            />
          </button>
          <button
            className="chat"
            onClick={() => handleChat(postDetail.id, postDetail.sellerEmail)}
            disabled={!postDetail.sellerEmail || isLoading}
          >
            챗
          </button>
          <button onClick={handleBuyNow} className="buy-now">바로구매</button>
          <button
            onClick={() =>
              navigate(`/detail/${id}/reviews`, {
                state: {
                  title: postDetail.title,
                  image: postDetail.imageUrls && postDetail.imageUrls[0],
                  postId: id,
                },
              })
            }
            className="review"
          >
            리뷰
          </button>
          {/* 장바구니 */}
          <button
            onClick={handleCartAdd}
            className="cart"
          >
            장바구니
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default DetailPage;