import Button from 'react-bootstrap/Button';
import './cart.css'
import { useEffect, useState } from 'react';
import axios from 'axios';


function CartPage(){
  const [cartList , setCartList] = useState([])
  useEffect(()=>{
    axios.get("http://localhost:8081/cart/find")
    .then((response)=>{
      setCartList(response.data)
    })
    .catch((error)=>{
      console.log("this error")
    })
  },[])

  return(
    <div>
      <h1> CartPage</h1>
      {cartList.map((cartList , index)=>(
        <div className="cartDiv_box" key={index}> 
        <div className='cartImg_box'>
          <img className="cartImg" src={cartList.postReqDto.imageUrls} ></img>
          <h1>{cartList.postRedDto.title}</h1>
        </div>
        <div className='cartInfo_box'>
          <div>
          <p>OnePiece PRICE : {cartList.postRedDto.price}</p>
          </div>
          <div>
          <p>stock  <span><Button variant="outline-dark">-</Button></span><span><Button variant="outline-dark">+</Button></span> <span><Button variant="outline-dark">X</Button></span></p>
          </div>
          <div>
          <p>Total PRICE : {cartList.price}</p>
          </div>
        </div>
       </div>
      ))}
    </div>
  )
}
export default CartPage;
