import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchPosts } from "../../components/reducers/post/postThunk";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaHeart } from "react-icons/fa";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./search-list.css";

const SearchList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [likedPosts, setLikedPosts] = useState({});
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // ✅ Redux로 데이터 요청 (useEffect 하나만 유지)
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // ✅ 좋아요 기능 (중복 제거)
  const toggleLike = async (postId) => {
    try {
      const isLiked = likedPosts[postId];

      if (isLiked) {
        setLikedPosts((prev) => {
          const updated = { ...prev };
          delete updated[postId];
          return updated;
        });
        await axios.delete(`${baseUrl}/likes/${postId}`);
      } else {
        setLikedPosts((prev) => ({ ...prev, [postId]: true }));
        await axios.get(`${baseUrl}/likes/${postId}`);
      }
    } catch (error) {
      console.error("Error while toggling like:", error);
    }
  };

  // ✅ 상품 클릭 시 상세 페이지 이동
  const handleClick = (id) => {
    navigate(`/detail/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <div className="row">
        {posts.length > 0 ? (
          posts.map((liquor, index) => (
            <div key={index} className="col-md-3">
              <Container>
                <Row>
                  <Col>
                    <div className="image-wrapper" onClick={() => handleClick(liquor.id)}>
                      <img
                        src={liquor.imageUrls?.[0]}
                        alt="product"
                        className="img-fluid product-image"
                      />
                      <div className="product-info">
                        <h2 className="product-title">{liquor.title}</h2>
                        <h4 className="product-price">{liquor.price}원</h4>
                        <h5 className="product-stock">{liquor.stock}개</h5>
                      </div>
                    </div>
                    <Button variant="light" className="like-button" onClick={() => toggleLike(liquor.id)}>
                      <FaHeart color={likedPosts[liquor.id] ? "red" : "gray"} />
                    </Button>
                  </Col>
                </Row>
              </Container>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchList;
