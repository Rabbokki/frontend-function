import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../components/reducers/user/userThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import "./accountPosts.css";

const AccountPosts = () => {
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

  if (loading) return <p>게시물을 불러오는 중...</p>;
  if (error) return <p>오류: {error}</p>;
  if (!userData || userData.postList.length === 0) return <p>등록한 상품이 없습니다.</p>;

  return (
    <div className="account-posts-container">
      {userData.postList.map((post) => (
        <div key={post.id} className="post-card" onClick={() => navigate(`/detail/${post.id}`)}>
          <img src={post.imgUrl} alt={post.title} className="post-image" />
          <div className="post-content">
            <div className="title-price-container">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-price">{post.price.toLocaleString()} 원</p>
            </div>
            <div className="post-stats">
              <span>
                <FontAwesomeIcon icon={faEye} className="icon eye-icon" /> {post.viewCount}
              </span>
              <span>
                <FontAwesomeIcon icon={faHeart} className="icon heart-icon" /> {post.likeCount}
              </span>
              <span>
                <FontAwesomeIcon icon={faStar} className="icon star-icon" />{" "}
                {post.averageRating ? post.averageRating.toFixed(1) : "No rating"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountPosts;
