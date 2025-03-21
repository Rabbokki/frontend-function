import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import './detail.css'

const DetailPage = ()=>{
  const {id} = useParams();
  const [postDetail , setPostDetail] = useState({});
  useEffect(()=>{
    axios
    .get(`http://localhost:8081/post/find/${id}`)
    .then((response)=>{
      console.log(response.data)
      setPostDetail(response.data);
    })
    .catch((error)=>{
      console.log("error" , error)
    });
  }, [id]);

  if(!postDetail){ return <p>Loading...</p>;}
  return(
    <div className="detail-page">
      DetailPage
      <div className="left-section">
      <img src={postDetail.imageUrls && postDetail.imageUrls[0]} 
      alt="product"
      className="img-fluid"
      ></img>
      <h1>{postDetail.title}</h1>
      </div>
      <div className="right-section">
        <div className="info">
        <p>{postDetail.price}원</p>
        <p>{postDetail.content}</p>
        </div>
        <div className="buttons">
          <button>BookMark</button>
          <button>BookMark</button>
          <button>BookMark</button>
        </div>
      </div>
    </div>
  )
}
export default DetailPage;