import "./cart.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Await } from "react-router-dom";

function CartPage() {
  const [cartList, setCartList] = useState([]);
  const dispatch = useDispatch();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://192.168.0.71:8081";

  const accessToken = localStorage.getItem("accessToken");
  console.log("이것은 토큰이여", accessToken);

  useEffect(() => {
    if (accessToken) {
      axios
        .get(`${baseUrl}/cart/find`, {
          headers: { Access_Token: accessToken },
        })
        .then((res) => {
          setCartList(res.data);
        })
        .catch((err) => {
          console.log("이것은 에러여", err);
        });
    } else {
      console.log("토큰값이 없습니다");
    }
  }, []);
  const handleMinuse = async(id)=>{
    await axios.patch(`${baseUrl}/cart/update/${id}?status=-1` , {} ,{
      headers: {  Access_Token: accessToken },
    });
    const res = await axios.get(`${baseUrl}/cart/find`, {
      headers: { Access_Token: accessToken },
    });
    setCartList(res.data);

  };
  const handleplus = async(id)=>{
    await axios.patch(`${baseUrl}/cart/update/${id}?status=+1` , {} ,{
      headers: {  Access_Token: accessToken },
    });
    const res = await axios.get(`${baseUrl}/cart/find`, {
      headers: { Access_Token: accessToken },
    });
    setCartList(res.data);
  };
  
  const handleDelete = async(id)=>{
    await axios.delete(`${baseUrl}/cart/delete/${id}` , {
      headers: {Access_Token: accessToken},
    });
    const res = await axios.get(`${baseUrl}/cart/find`,{
      headers: {Access_Token: accessToken},
    });
    setCartList(res.data)
  }


  
  

  



  let price = cartList.reduce((acc, item)=>acc+(item.count * item.price), 0).toLocaleString();
  return (
    <div className="top">
      <h1>Cart Page</h1>
      <div className="cart-container">
        {cartList.length > 0 ? (
          cartList.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={item.postReqDto.imageUrls?.[0]}
                  alt={item.postReqDto.title}
                />
              </div>
              <div className="cart-item-info">
                <h1>{item.postReqDto.title}</h1>
                <div className="cart-item-count">
                  <button onClick={()=>{handleMinuse(item.postReqDto.id)}}>-</button>
                  <p>{item.count}개</p>
                  <button onClick={()=>{handleplus(item.postReqDto.id)}}>+</button>
                </div>
                <div className="cart-item-price">
                  {/* 수정해야함 */}
                <h3>{(item.count * item.price).toLocaleString()}원</h3>
                </div>
                <button className="cart-item-remove" onClick={()=>{handleDelete(item.id)}}>삭제</button>
              </div>
            </div>
          ))
        ) : (
          <p>장바구니가 비어 있습니다</p>
        )}

        <div className="cart-total">
          <h2>
            총 결제 금액{" "}
            {price}원
          </h2>
          <button>결제 하기</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
