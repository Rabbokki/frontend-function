import React, {useState, useEffect} from 'react';
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa";
import { Button, Card } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './search-list.css'
import {  useNavigate } from 'react-router-dom';

const SearchList = () => {
    const [liquorList, setLiquorList] = useState([]);
    const [likedPosts, setLikedPosts] = useState({});

    const toggleLike = async (postId) => {
        try {
            const isLiked = likedPosts[postId];
      
            // If it's already liked, remove the like (unlike)
            if (isLiked) {
              setLikedPosts(prev => {
                const updated = { ...prev };
                delete updated[postId];
                return updated;
              });
              // Optionally, call backend to unlike
              await axios.delete(`http://localhost:8081/likes/${postId}`);
            } else {
              setLikedPosts(prev => ({ ...prev, [postId]: true }));
              // Call backend to like the post
              await axios.get(`http://localhost:8081/likes/${postId}`);
            }
          } catch (error) {
            console.error("Error while toggling like:", error);
          }
        };
    
    const Navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8081/post") 
            .then((response) => {
                console.log(response.data)
                setLiquorList(response.data)
            })
            .catch((error) => {
                console.error("There was an error fetching the liquor data!", error);
            })
    }, [])

    const handleClick = (id)=>{
        Navigate(`/detail/${id}`)
    }


    return (
        <div className="container">
            <div className="row">
                {liquorList.length > 0 ? (
                    liquorList.map((liquor, index) => (
                        <div key={index} className="col-md-3">
                            <Container>
                                <Row>
                                  <Col>
                                    <div className="image-wrapper" onClick={()=>{handleClick(index + 1)}}>
                                     <img 
                                       src={liquor.imageUrls && liquor.imageUrls[0]} 
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
                            {/* <Card style={{ width: '12rem' }}>
                                <Card.Img 
                                    variant="top" 
                                    src={liquor.imageUrls && liquor.imageUrls[0]}
                                    alt="product" 
                                    className="img-fluid" 
                                />
                                <Card.Body>
                                    <Card.Title>{liquor.title}</Card.Title>
                                    <Card.Text>{liquor.price}원</Card.Text>
                                    <div className="d-flex align-items-center">
                                        <FaStar />
                                        <span className="ms-1">
                                            {(liquor.averageRating || 0).toFixed(1)} ({liquor.reviewSize})
                                        </span>
                                        <Button variant="light" className="like-button"
                                            onClick={() => toggleLike(liquor.id)}>
                                                <FaHeart color={likedPosts[liquor.id] ? "red" : "gray"} />
                                        </Button>
                                    </div>
                                    <Button variant="primary" className="mt-2 w-100">추천</Button>
                                </Card.Body>
                            </Card> */}
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    )
}

export default SearchList;