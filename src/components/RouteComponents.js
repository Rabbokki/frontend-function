import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Whiskey from "../pages/alcohol/Whiskey";
import { Routes, Route } from "react-router-dom";
import Authenticate from "../pages/authenticate/authenticate";
import Account from "../pages/account/accountPage";
import AccountEdit from "../pages/account/editDetails";
import Champagne from '../pages/alcohol/Champagne/index';
import Wine from '../pages/alcohol/Wine/index';
import Vodka from '../pages/alcohol/Vodka/index';
import NewPost from '../pages/post/newPost';
import UpdatePost from '../pages/post/updatePost';
import CartPage from '../pages/cart/index';
import SearchList from '../pages/searchList/search-list';
import DetailPage from '../pages/detail/detail'
import Payment from '../pages/payment/payment'
import ChatPage from '../pages/Chat/ChatPage'
import ChatRoom from '../pages/Chat/ChatRoom'
import Reviews from '../pages/review/review'
import WriteReviews from '../pages/review/writeReview'
import kakaoLoginPage from '../pages/login/index';

const RouteComponents = () => {
  return (
    <div>
      <Routes>
        <Route path="/authenticate" element={<Authenticate/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/account/edit" element={<AccountEdit/>}/>
        <Route path="/newPost" element={<NewPost></NewPost>}/>
        <Route path="/updatePost/:id" element={<UpdatePost></UpdatePost>}/>
        <Route path="/whiskey" element={<Whiskey></Whiskey>}/>
        <Route path="/champagne" element={<Champagne></Champagne>}/>
        <Route path="/wine" element={<Wine></Wine>}/>
        <Route path="/vodka" element={<Vodka></Vodka>}/>
        <Route path="/cart" element={<div className="cartPage"><CartPage></CartPage></div>}></Route>
        <Route path="/search-list" element={<SearchList></SearchList>}/>
        {/* 상품 상세 페이지 */}
        <Route path="/detail/:id" element={<DetailPage></DetailPage>}></Route>
        <Route path="/payment/:id" element={<Payment></Payment>}></Route>
        <Route path="/chat/:roomName" element={<ChatPage />} />
        <Route path="/chatrooms" element={<ChatRoom />} />
        <Route path="/detail/:id/reviews" element={<Reviews></Reviews>}></Route>
        <Route path="/detail/:id/writeReview" element={<WriteReviews></WriteReviews>}></Route>
        <Route path="*" element={
          <Container>
          <Row>
            <Col>
              <img className="mainImg" src="/image/main_imgs.jpg"></img>
            </Col>
          </Row>
          <Row>
            <Col xs><div className="main_colum_1">Content</div></Col>
            <Col xs><div className="main_colum_2">Event</div></Col>
            <Col xs><div className="main_colum_3">Choice</div></Col>
          </Row>
        </Container>
        } />
      </Routes>
    </div>
  )
}

export default RouteComponents