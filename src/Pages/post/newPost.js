import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from '../../components/reducers/user/userThunk';
import { createPost } from "../../components/reducers/post/postThunk";
import "./updatePost.css";
import "./newPost.css";

export default function ProductForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

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

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files].slice(0, 12));
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleNewProduct = async (event) => {
    event.preventDefault();

    if (!productName || !description || !price || images.length === 0) {
      alert("모든 필드를 입력해야 합니다.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("postImg", image);
    });

    const newProduct = {
      title: productName,
      content: description,
      price: price,
      stock: 999,
      category: category,
    };
    console.log("Sending category:", category); // 디버깅 로그 추가
    formData.append("dto", new Blob([JSON.stringify(newProduct)], { type: "application/json" }));

    try {
      const resultAction = await dispatch(createPost({ formData, accessToken })).unwrap();
      console.log("Post created successfully:", resultAction);
      const postId = resultAction.id;
      navigate(`/detail/${postId}`);
      dispatch(fetchUserData(accessToken));
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("게시글 생성에 실패했습니다: " + (error.message || "알 수 없는 오류"));
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">상품 등록</h2>

      <form onSubmit={handleNewProduct}>
        <label className="form-label">상품명</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="상품명을 입력해 주세요."
          className="form-input"
        />
        <label className="form-label">카테고리</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
          <option value="">선택하세요</option>
          <option value="WINE">와인</option>
          <option value="WHISKY">위스키</option>
          <option value="VODKA">보드카</option>
          <option value="CHAMPAGNE">샴페인</option>
        </select>

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
        </div>

        <label className="form-label">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="브랜드, 모델명, 구매 시기, 하자 유무 등을 최대한 상세히 적어주세요."
          rows={4}
          className="form-textarea"
        ></textarea>

        {/* <label className="form-label">태그 (선택)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="태그를 입력해 주세요. (최대 5개)"
          className="form-input"
        /> */}

        <label className="form-label">가격</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="가격을 입력해 주세요."
          className="form-input"
        />
        {/* <label>
          <input
            type="checkbox"
            checked={acceptPriceOffer}
            onChange={() => setAcceptPriceOffer(!acceptPriceOffer)}
          /> 가격제안 받기
        </label> */}

        {/* <label className="form-label">택배거래</label>
        <label>
          <input
            type="radio"
            checked={shippingIncluded}
            onChange={() => setShippingIncluded(true)}
          /> 배송비 포함
        </label>
        <label>
          <input
            type="radio"
            checked={!shippingIncluded}
            onChange={() => setShippingIncluded(false)}
          /> 배송비 별도
        </label> */}

        <button type="submit" className="form-button">등록하기</button>
      </form>
    </div>
  );
}
