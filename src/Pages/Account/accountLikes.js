import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../components/reducers/user/userThunk";
import { addPostLike, removePostLike } from "../../components/reducers/likes/likeThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";  // Import Framer Motion
import "./accountLikes.css";

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.2 } }) 
  // Each card fades in sequentially with a 0.2s delay increment
};

const AccountLikes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading, error } = useSelector((state) => state.user);
  const [hoveredPostId, setHoveredPostId] = useState(null);

  const likedPosts = useSelector((state) => state.likes.likedPosts);
  const accessToken = localStorage.getItem("accessToken");
  const [removingLikes, setRemovingLikes] = useState(new Set());

  useEffect(() => {
    if (!accessToken) {
      navigate("/authenticate");
    } else if (!userData && !loading) {
      dispatch(fetchUserData(accessToken)).unwrap().catch(() => navigate("/authenticate"));
    }
  }, [dispatch, navigate, userData, loading,accessToken]);

  const handleLikeToggle = async (postId, isLiked) => {
    if (isLiked) {
      setRemovingLikes((prev) => new Set([...prev, postId]));

      setTimeout(async () => {
        try {
          await dispatch(removePostLike(postId)).unwrap();
          dispatch(fetchUserData(accessToken));
        } catch (error) {
          console.error("Failed to remove like:", error);
          setRemovingLikes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
      }, 500);
    } else {
      try {
        await dispatch(addPostLike(postId)).unwrap();
        dispatch(fetchUserData(accessToken));
      } catch (error) {
        console.error("Failed to add like:", error);
      }
    }
  };

  if (error) return <p>오류: {error}</p>;
  if (!userData || userData.postLikes.length === 0) return <p>찜한 상품이 없습니다.</p>;

  return (
    <div className="account-likes-wrapper">
      <div className="account-likes-container">
        {userData.postLikes.map((like, index) => (
          <div
            key={like.id}
            className="like-card fade-in"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="like-action">
              <button
                className="like-button"
                onClick={() => handleLikeToggle(like.postId, true)}
                onMouseEnter={() => setHoveredPostId(like.postId)}
                onMouseLeave={() => setHoveredPostId(null)}
              >
                <FontAwesomeIcon icon={hoveredPostId === like.postId ? faHeartBroken : faHeart} />
              </button>
            </div>

            <img
              src={like.post.imgUrl}
              alt={like.post.title}
              className="post-image"
              onClick={() => navigate(`/detail/${like.post.id}`)}
            />

            <div className="post-content">
              <div className="title-price-container">
                <h3
                  className="post-title"
                  onClick={() => navigate(`/detail/${like.post.id}`)}
                >
                  {like.post.title}
                </h3>
                <p className="post-price">
                  {like.post.price.toLocaleString()} 원
                </p>
              </div>

              <div className="description-container">
                <p className="post-description">{like.post.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };  

export default AccountLikes;
