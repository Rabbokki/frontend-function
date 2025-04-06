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
    axios.get("/api/post/category/CHAMPAGNE")
      .then((res) => {
        console.log("Raw response:", res);  // 전체 응답 확인
        console.log("Response data:", res.data);
        const posts = Array.isArray(res.data) ? res.data : res.data.data || [];  // 중첩 구조 고려
        setPost(posts);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err.response?.data || err.message);
        setPost([]);
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