import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserData } from '../../../components/reducers/user/userThunk';
import { createPost } from "../../../components/reducers/post/postThunk";
import "./upload.css";

export default function ProductForm() {
  const dispatch = useDispatch();

  const [productName, setProductName] = useState("");
  const [condition, setCondition] = useState("사용감 적음");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [acceptPriceOffer, setAcceptPriceOffer] = useState(true);
  const [shippingIncluded, setShippingIncluded] = useState(true);

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

  const handleNewProduct = (event) => {
    event.preventDefault();

    // Validate that all required fields are filled
    if (!productName || !description || !price || images.length === 0) {
      alert("모든 필드를 입력해야 합니다.");
      return;
    }

    const formData = new FormData();

    images.forEach((image) => {
      formData.append("postImg", image); // Ensure correct key name
    });

    const newProduct = {
      title: productName,
      content: description,
      price: price,
      stock: 999,
      img: images
    };

    formData.append("dto", new Blob([JSON.stringify(newProduct)], { type: "application/json" }));
    dispatch(createPost({formData, accessToken}));
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
              <img key={index} src={URL.createObjectURL(image)} alt="Uploaded" className="uploaded-image" />
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
