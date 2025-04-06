import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../components/reducers/user/userThunk";
import { addPostLike, removePostLike } from "../../components/reducers/likes/likeThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
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
  if (!userData || userData.likeList.length === 0) return <p>찜한 상품이 없습니다.</p>;

  return (
    <div className="account-likes-grid">
      {userData.likeList.map((like, index) => {
        const isLiked = likedPosts.includes(String(like.postId));
        const isFading = removingLikes.has(like.postId);

        return (
          <motion.div 
            key={like.id} 
            className={`like-card ${isFading ? "fade-out" : ""}`}
            custom={index} 
            variants={fadeInVariant} 
            initial="hidden" 
            animate="visible"
          >
            <div className="user-info">
              <div className="avatar">
                <img
                  src={like.profilePic || "/image/blankProfile.png"}
                  alt="User Display Pic"
                  className="profile-image"
                />
              </div>
              <div className="user-details">
                <span className="user-name">{like.sellerNickname}</span>
                <span className="post-time">{new Date(like.createdAt).toLocaleDateString()}</span>
              </div>
              <FontAwesomeIcon
                icon={faHeart}
                className={`heart-icon ${isLiked ? "liked" : ""}`}
                onClick={() => handleLikeToggle(like.postId, isLiked)}
              />
            </div>

            <img
              src={like.imgUrl}
              alt={like.postTitle}
              className="like-image"
              onClick={() => navigate(`/detail/${like.postId}`)}
            />

            <div className="like-content">
              <h3 className="like-title" onClick={() => navigate(`/detail/${like.postId}`)}>
                {like.postTitle}
              </h3>
              <p className="like-price">{like.postPrice.toLocaleString()} 원</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AccountLikes;
