import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Whiskey from "../Pages/Alcohol/Whiskey";
import { Routes, Route } from "react-router-dom";
import Authenticate from "../Pages/authenticate/authenticate";
import Callback from "../Pages/authenticate/Callback";
import Account from "../Pages/Account/accountPage";
import AccountEdit from "../Pages/Account/editDetails";
import Champagne from '../Pages/Alcohol/Champagne/index';
import Wine from '../Pages/Alcohol/Wine/index';
import Vodka from '../Pages/Alcohol/Vodka/index';
import NewPost from '../Pages/post/newPost';
import UpdatePost from '../Pages/post/updatePost';
import CartPage from '../Pages/cart/index';
import SearchList from '../Pages/SearchList/search-list';
import DetailPage from '../Pages/detail/detail'
import ChatPage from '../Pages/Chat/ChatPage'
import ChatRoom from '../Pages/Chat/ChatRoom'
import Reviews from '../Pages/review/review'
import WriteReviews from '../Pages/review/writeReview'

const RouteComponents = () => {
  return (
    <div>
      <Routes>
        <Route path="/authenticate" element={<Authenticate/>}/>
        <Route path="/callback" element={<Callback />} />
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