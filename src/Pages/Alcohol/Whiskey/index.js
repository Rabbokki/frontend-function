import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { steps } from "framer-motion";

function Whiskey(){
  const [post , setPost] = useState([]);
  const Navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://192.168.0.71:8081";
  useEffect(()=>{
    axios.get(`${baseUrl}/post/category/WHISKY`)
    .then((res)=>{
      setPost(res.data)
    })
  },[])

  return(
    <div>
      <h1>WhiskeyList</h1>
      <Container>
        <Row>
          {post.map((x, y) => (
            <Col md={3} sm={6} key={x.id}>
              <div onClick={()=>{
                Navigate(`/detail/${x.id}`)
              }}>
                <img
                        src={x.imageUrls?.[0]}
                        alt="product"
                        className="img-fluid product-image"
                      />
                <h3>{x.title}</h3>
                <p>
                  <strong>PRICE : </strong>
                  {x.price}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}
export default Whiskey;