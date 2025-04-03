import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../components/reducers/user/userThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import "./accountLikes.css";

const AccountLikes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/authenticate");
    } else if (!userData && !loading) {
      dispatch(fetchUserData(accessToken)).unwrap().catch(() => navigate("/authenticate"));
    }
  }, [dispatch, navigate, userData, loading]);

  if (loading) return <p>찜한 상품을 불러오는 중...</p>;
  if (error) return <p>오류: {error}</p>;
  if (!userData || userData.likeList.length === 0) return <p>찜한 상품이 없습니다.</p>;

  return (
    <div className="account-likes-grid">
      {userData.likeList.map((like) => (
        <div key={like.id} className="like-card">
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
          </div>


          {/* Product Image */}
          <img
            src={like.imgUrl}
            alt={like.postTitle}
            className="like-image"
            onClick={() => navigate(`/detail/${like.postId}`)}
          />

          {/* Product Details */}
          <div className="like-content">
            <h3 className="like-title" onClick={() => navigate(`/detail/${like.postId}`)}>
              {like.postTitle}
            </h3>
            <p className="like-price">{like.postPrice.toLocaleString()} 원</p>
          </div>

          {/* Bottom Actions */}
          <div className="like-footer">
            <span className="like-count">
              <FontAwesomeIcon icon={faHeart} className="heart-icon" /> {like.likeSize}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountLikes;
