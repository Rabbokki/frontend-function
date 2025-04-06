import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Champagne() {
  const [post, setPost] = useState([]);
  const Navigate = useNavigate();
  const API_URL = process.env.REACT_APP_BASE_URL || "http://backend:8081";

  useEffect(() => {
    axios.get(`${API_URL}/api/post/category/CHAMPAGNE`)  // "/api" 추가
      .then((res) => {
        console.log("Response data:", res.data);  // 응답 확인
        setPost(Array.isArray(res.data) ? res.data : []);  // 배열 보장
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPost([]);  // 에러 시 빈 배열
      });
  }, []);

  return (
    <div>
      <h1>Champagne Page</h1>
      <Container>
        <Row>
          {post.length > 0 ? (
            post.map((x) => (
              <Col md={3} sm={6} key={x.id}>
                <div onClick={() => Navigate(`/detail/${x.id}`)}>
                  <img
                    src={x.imageUrls?.[0] || "default-image.jpg"}
                    alt="product"
                    className="img-fluid product-image"
                  />
                  <h3>{x.title || "제목 없음"}</h3>
                  <p>
                    <strong>PRICE : </strong>
                    {x.price || "가격 미정"}
                  </p>
                </div>
              </Col>
            ))
          ) : (
            <Col><p>게시물이 없습니다.</p></Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
export default Champagne;