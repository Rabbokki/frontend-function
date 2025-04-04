import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserData } from '../../components/reducers/user/userThunk.js';
import { postReview } from '../../components/reducers/review/reviewThunk.js';
import './writeReview.css';

const WriteReview = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { title, image, postId } = useLocation().state || {};
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      console.log("Fetching user data with token:", accessToken);
      dispatch(fetchUserData(accessToken));
    }
    else console.log("No access token found");
    }, [dispatch]);

  useEffect(() => {
    console.log(userData)
  }, [userData]);

  // useEffect(() => {
  //   return () => {
  //       images.forEach((image) => URL.revokeObjectURL(image));
  //   };
  // }, [images]);
  

  // const handleImageUpload = (event) => {
  //   const files = Array.from(event.target.files);
  //   setImages((prevImages) => [...prevImages, ...files].slice(0, 12));
  // };

  // const handleRemoveImage = (index) => {
  //   setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  // };



  const handleSubmit = (event) => {
    event.preventDefault();

    if (!userData || !userData.accountId) {
        alert("User data is not available.");
        return;
      }

    const reviewData = { postId, accountId: userData.accountId, rating, content };
  
    if (!content || !rating) {
      alert("모든 필드를 입력해야 합니다.");
      return;
    }
  
    dispatch(postReview(reviewData));
  
    setRating(0);
    setHover(0);
    setContent('');
    setImages([]);
  };
  

  return (
    <div className="write-review-container">
      <h2>리뷰 작성</h2>
      
      {/* Post 디태일 */}
      <div className="product-details">
        <img src={image} alt="Product" className="product-image" />
        <h3>{title}</h3>
      </div>

      {/* 별 */}
      <form onSubmit={handleSubmit} className="write-review-form">
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <span
              key={starValue}
              className={`star ${starValue <= (hover || rating) ? 'filled' : ''}`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        {/* 리뷰 콘탠츠 */}
        <textarea
          className="review-textarea"
          placeholder="리뷰 쓰기..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* 이미지
        <label className="form-label">상품 이미지 ({images.length}/12)</label>
        <div className="image-upload-container">
          <label className="image-upload-box" htmlFor="image-upload">
            <span className="image-upload-text">이미지 등록</span>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="image-upload-input"
            />
          </label>

          <div className="image-preview">
            {images.map((image, index) => (
              <div key={index} className="image-thumbnail">
                <img src={URL.createObjectURL(image)} alt="Uploaded" className="uploaded-image" />
                <button type="button" className="remove-image-btn" onClick={() => handleRemoveImage(index)}>
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div> */}

        <button type="submit" className="submit-review-button">
          리뷰 제출
        </button>
      </form>
    </div>
  );
};

export default WriteReview;
