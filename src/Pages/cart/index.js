import Button from 'react-bootstrap/Button';
import './cart.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../../Components/reducers/user/userThunk';
import axios from 'axios';
import { data } from 'react-router-dom';
import axiosInstance from '../../Token/Token';

function CartPage(){
<<<<<<< HEAD:src/Pages/cart/index.js
  const [cartList , setCartList] = useState([])
  useEffect(()=>{
    axios.get("http://192.168.0.71:8081/cart/find")
    .then((response)=>{
      setCartList(response.data)
    })
    .catch((error)=>{
      console.log("this error")
    })
  },[])
=======
  const [cartList , setCartList] = useState([]);
  const dispatch = useDispatch();
  
 
  
>>>>>>> feature-jang--cart:src/Pages/CartPage/index.js

  return(
    <div>
      <h1> CartPage</h1>
      {cartList.map((cartList , index)=>(
        <div className="cartDiv_box" key={index}> 
        <div className='cartImg_box'>
          <img className="cartImg" src='' ></img>
          <h1>sad</h1>
        </div>
        <div className='cartInfo_box'>
          <div>
          <p>OnePiece PRICE : Title</p>
          </div>
          <div>
          <p>stock  <span><Button variant="outline-dark">-</Button></span><span><Button variant="outline-dark">+</Button></span> <span><Button variant="outline-dark">X</Button></span></p>
          </div>
          <div>
          <p>Total PRICE : price</p>
          </div>
        </div>
       </div>
      ))}
    </div>
  )
}
export default CartPage;
