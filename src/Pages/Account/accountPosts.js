import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../components/reducers/user/userThunk";
import { deletePost } from "../../components/reducers/post/postThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faStar, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./accountPosts.css";

const AccountPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem("sortBy") || "upload-date";
  });
  const { userData, loading, error } = useSelector((state) => state.user);

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    localStorage.setItem("sortBy", newSortBy);
  };

  const handleDelete = async (postId) => {
    if (window.confirm("정말 지울 거냐?")) {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        navigate("/authenticate");
        return;
      }
  
      try {
        await dispatch(deletePost({ postId, accessToken })).unwrap();
        dispatch(fetchUserData(accessToken));
        alert("삭제 완료!");
        navigate("/account");
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert(`삭제 실패: ${error}`);
      }
    }
  };
  

  const sortedPosts = [...(userData?.postList || [])].sort((a, b) => {
    switch (sortBy) {
      case "upload-date":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "most-reviews":
        return (b.reviewSize || 0) - (a.reviewSize || 0);
      case "highest-rated":
        return (b.averageRating || 0) - (a.averageRating || 0);
      case "most-views":
        return (b.viewCount || 0) - (a.viewCount || 0);
      case "most-likes":
        return (b.likeCount || 0) - (a.likeCount || 0);
      default:
        return 0;
    }
  });

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
    <div className="account-posts-wrapper">
      <div className="sort-container">
        <label htmlFor="sort">정렬 기준:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="upload-date">업로드 날짜</option>
          <option value="most-reviews">리뷰 많은 순</option>
          <option value="highest-rated">평점 높은 순</option>
          <option value="most-views">조회수 많은 순</option>
          <option value="most-likes">좋아요 많은 순</option>
        </select>
      </div>
  
      <div className="account-posts-container">
        {sortedPosts.map((post) => (
          <div key={post.id} className="post-card">
            {/* Edit & Delete Buttons Positioned at Top Right */}
            <div className="post-actions">
              <button
                className="edit-button"
                onClick={() =>
                  navigate(`/updatePost/${post.id}`, {
                    state: {
                      title: post.title,
                      content: post.content,
                      price: post.price,
                      image: post.imageUrls && post.imageUrls[0],
                      postId: post.id,
                    },
                  })
                }
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
  
              <button className="delete-button" onClick={() => handleDelete(post.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
  
            {/* Image Clickable */}
            <img
              src={post.imgUrl}
              alt={post.title}
              className="post-image"
              onClick={() => navigate(`/detail/${post.id}`)}
            />
  
            <div className="post-content">
              <div className="title-price-container">
                <h3 className="post-title" onClick={() => navigate(`/detail/${post.id}`)}>
                  {post.title}
                </h3>
                <p className="post-price">{post.price.toLocaleString()} 원</p>
              </div>
  
              <div className="description-container">
                <p className="post-description">{post.content}</p>
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
    </div>
  );
  
};

export default AccountPosts;
