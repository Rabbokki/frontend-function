import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom';

import axios from 'axios'
import { fetchPosts } from "../../components/reducers/post/postThunk";

import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa";
import { Button, Card } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './search-list.css'


const SearchList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { posts, loading, error } = useSelector((state) => state.posts);
    const [likedPosts, setLikedPosts] = useState({});
  
    useEffect(() => {
      dispatch(fetchPosts());
    }, [dispatch]);
  
    const toggleLike = async (postId) => {
      try {
        const isLiked = likedPosts[postId];
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: !isLiked,
        }));
        // Handle API call here if needed
      } catch (error) {
        console.error("Error while toggling like:", error);
      }
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
                      <div
                        className="image-wrapper"
                        onClick={() => navigate(`/detail/${liquor.id}`)}
                      >
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