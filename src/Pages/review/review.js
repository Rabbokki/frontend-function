import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fetchReviews } from "../../components/reducers/review/reviewThunk.js";
import "./review.css";

const Review = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, image, postId } = location.state || {};
  const dispatch = useDispatch();
  const { reviews = [], loading, error } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (postId) {
      console.log("Fetching reviews for postId:", postId);
      dispatch(fetchReviews(postId));
    }
  }, [dispatch, postId]);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="review-container">
      {title && image && (
        <Link to={`/detail/${postId}`} className="product-card">
          <img src={image} alt="Product" className="product-image" />
          <h2 className="product-title">{title}</h2>
        </Link>
      )}

      <button onClick={() => navigate(`/detail/${postId}/writeReview`, { state: { title, image, postId } })}
            className="write-review-button">
        Write Review
      </button>

      {reviews.map((review) => (
        <div className="review-card" key={review.id}>
          <div className="review-header">
            {/* Fix: Ensure profile image is always a circle and doesn't stretch */}
            <div className="avatar">
            <img 
              src={review.profilePic || "/image/blankProfile.png"} 
              alt="User Display Pic" 
              className="profile-image"
            />
            </div>
            <div className="user-info">
              <span className="username">{review.nickname || "Unknown User"}</span>
              <span className="review-date">
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "No Date"}
              </span>
            </div>
            {/* Fix: Correctly display star rating */}
            <div className="rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < review.rating ? "gold" : "gray" }}>★</span>
              ))}
            </div>
          </div>
          {review.image && <img src={review.image} alt="Product" className="review-image" />}
          <p className="review-content">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Review;
