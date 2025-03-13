import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Champagne(){
  const [post , setPost] = useState([]);
  const Navigate = useNavigate();
  useEffect(()=>{
    axios.get("/api/post")
    .then(response=>{
      setPost(response.data)
    })
    
  },[])
  return(
    <div>
      <h1>Champagne Page</h1>
      <Container>
        <Row>
          {post.map((x, y) => (
            <Col md={3} sm={6} key={x.id}>
              <div onClick={()=>{
                Navigate(`/detail/${x.id}`)
              }}>
                <img
                  src="/image/choice.jpg"
                  style={{ width: "150px", height: "150px" }}
                ></img>
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
export default Champagne;