import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchUserData } from '../../components/reducers/user/userThunk';
import { fetchPostById, updatePost } from "../../components/reducers/post/postThunk";
import "./updatePost.css";

export default function ProductForm() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { title, content, price, image } = location.state || {};

  // Initialize state with location data or fallback to empty strings
  const [productName, setProductName] = useState(title || "");
  const [description, setDescription] = useState(content || "");
  const [images, setImages] = useState([]);
  const [cost, setCost] = useState(price || "");
  
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      console.log("Fetching user data with token:", accessToken);
      dispatch(fetchUserData(accessToken))
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.log("No access token found");
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (image) {
      setImages([{ url: image, file: null }]);
    }
  }, [image]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({ url: URL.createObjectURL(file), file }));
    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 12));
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpdatePost = (event) => {
    event.preventDefault();

    if (!productName || !description || !price || images.length === 0) {
      alert("모든 필드를 입력해야 합니다.");
      return;
    }

    const formData = new FormData();

    images.forEach((img) => {
      if (img.file) {
        formData.append("postImg", img.file); // Only append newly uploaded images
      }
    });

    const updatedProduct = {
      title: productName,
      content: description,
      price: cost, // Make sure cost is used here instead of price
      stock: 999, // Assuming stock remains constant, or update if needed
    };

    formData.append("dto", new Blob([JSON.stringify(updatedProduct)], { type: "application/json" }));

    dispatch(updatePost({ formData, postId: id, accessToken }))
      .then(() => navigate(`/detail/${id}`)) // Redirect after successful update
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">상품 수정</h2>

      <form onSubmit={handleUpdatePost}>
        <label className="form-label">상품명</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)} // Update state on input change
          placeholder="상품명을 입력해 주세요."
          className="form-input"
        />

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
            {images.map((img, index) => (
              <div key={index} className="image-thumbnail">
                <img
                  src={img.file ? URL.createObjectURL(img.file) : img.url}
                  alt="Uploaded"
                  className="uploaded-image"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage(index)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className="form-label">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update state on input change
          placeholder="브랜드, 모델명, 구매 시기, 하자 유무 등을 최대한 상세히 적어주세요."
          rows={4}
          className="form-textarea"
        ></textarea>

        <label className="form-label">가격</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)} // Update state on input change
          placeholder="가격을 입력해 주세요."
          className="form-input"
        />

        <button type="submit" className="form-button">수정하기</button>
      </form>
    </div>
  );
}
