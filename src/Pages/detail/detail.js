import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../../components/reducers/post/postThunk";
import { addPostLike, removePostLike, fetchPostLikeStatus } from "../../components/reducers/likes/likeThunk"; // Add the import here
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faHeart } from "@fortawesome/free-solid-svg-icons";  
import "./detail.css";

const DetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { postDetail, loading, error } = useSelector((state) => state.posts);
  const { likedPosts } = useSelector((state) => state.likes);

  const [isLiked, setIsLiked] = useState(() => likedPosts.includes(id));

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (postDetail) {
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
          <button className="chat">번개톡</button>
          <button className="buy-now">바로구매</button>
          <button className="bookmark">북마크</button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;