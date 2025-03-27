import Button from "react-bootstrap/Button";
import "./cart.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserData } from '../../components/reducers/user/userThunk';
import axios from "axios";
import axiosInstance from "../../Token/Token";

function CartPage() {
  const [cartList, setCartList] = useState([]);
 
  const dispatch = useDispatch();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://192.168.0.71:8081";

  const accessToken = localStorage.getItem('accessToken');
  console.log("이것은 토큰이여" , accessToken)

  useEffect(()=>{
    if(accessToken){
      axios.get(`${baseUrl}/cart/find`,{
        headers: {Access_Token: accessToken },
      })
      .then((res)=>{
        console.log('이건 토큰' , accessToken);
        console.log("이건 데이터" , res.data);
        setCartList(res.data)
      })
      .catch((err)=>{
        console.log("이것은 에러여" , err);
      })
    }else{
      console.log("토큰값이 없습니다")
    }
  },[])
  
  
  return (
    <div>
      <h1>Cart Page</h1>
      
      {cartList.length > 0 ? (
        cartList.map((item, index) => (
          <div className="cartDiv_box" key={index}>
            <div className="cartImg_box">
              <img className="cartImg" src={item.postReqDto.imageUrls?.[0] } alt="product" />
              <h1>{item.title}</h1>
            </div>
            <div className="cartInfo_box">
              <p>OnePiece PRICE: {item.price}원</p>
              <div>
                <p>
                  Stock:{" "}
                  <Button variant="outline-dark">-</Button>
                  <Button variant="outline-dark">+</Button>
                  <Button variant="outline-dark">X</Button>
                </p>
              </div>
              <p>Total PRICE: {item.price}원</p>
            </div>
          </div>
        ))
      ) : (
        <p>장바구니가 비어 있습니다.</p>
      )}
    </div>
  );
}

export default CartPage;
