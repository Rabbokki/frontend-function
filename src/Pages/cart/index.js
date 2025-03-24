import Button from "react-bootstrap/Button";
import "./cart.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import axiosInstance from "../../Token/Token";

function CartPage() {
  const [cartList, setCartList] = useState([]);
  const dispatch = useDispatch();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://192.168.0.71:8081";

  // ✅ 장바구니 데이터 가져오기
  useEffect(() => {
    axios
      .get(`${baseUrl}/cart/find`)
      .then((response) => {
        setCartList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Cart Page</h1>
      {cartList.length > 0 ? (
        cartList.map((item, index) => (
          <div className="cartDiv_box" key={index}>
            <div className="cartImg_box">
              <img className="cartImg" src={item.imageUrl || "/image/Imsi.jpg"} alt="product" />
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
              <p>Total PRICE: {item.price * item.quantity}원</p>
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
