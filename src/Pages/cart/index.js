import Button from 'react-bootstrap/Button';


function CartPage(){
  return(
    <div>
      <h1> CartPage</h1>
      <div className="cartDiv_box"> 
        <div className='cartImg_box'>
          <img className="cartImg" src="/image/Imsi.jpg" ></img>
          <h1>Title</h1>
        </div>
        <div className='cartInfo_box'>
          <div>
          <p>OnePiece PRICE : 340,000</p>
          </div>
          <div>
          <p>stock  <span><Button variant="outline-dark">-</Button></span><span><Button variant="outline-dark">+</Button></span> <span><Button variant="outline-dark">X</Button></span></p>
          </div>
          <div>
          <p>Total PRICE : 340,000</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CartPage;
