import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Whiskey from "../Pages/Alcohol/Whiskey/index";
import { Routes, Route } from "react-router-dom";
import Authenticate from "../Pages/authenticate/authenticate.js";
import Callback from "../Pages/authenticate/Callback.js";
import Account from "../Pages/Account/accountPage.js";
import AccountEdit from "../Pages/Account/editDetails.js";
import AccountPosts from "../Pages/Account/accountPosts.js";
import AccountLikes from "../Pages/Account/accountLikes.js";
import Champagne from '../Pages/Alcohol/Champagne/index';
import Wine from '../Pages/Alcohol/Wine/index';
import Vodka from '../Pages/Alcohol/Vodka/index';
import NewPost from '../Pages/post/newPost.js';
import UpdatePost from '../Pages/post/updatePost.js';
import CartPage from '../Pages/cart/index';
import SearchList from '../Pages/SearchList/search-list.js';
import DetailPage from '../Pages/detail/detail.js';
import Payment from '../Pages/payment/payment.js';
import PaymentProcess from '../Pages/payment/paymentProcess.js';
import PaymentSuccess from '../Pages/payment/paymentSuccess.js';
import ChatPage from '../Pages/Chat/ChatPage.js';
import ChatRoom from '../Pages/Chat/ChatRoom.js';
import Reviews from '../Pages/review/review.js';
import WriteReviews from '../Pages/review/writeReview.js';
import { useSelector } from 'react-redux';

const RouteComponents = () => {
    const accessToken = useSelector((state) => state.auth.accessToken);
    const userData = useSelector((state) => state.user.userData);

    console.log("accessToken", accessToken);
    console.log("account정보", userData);

    return (
        <div>
            <Routes>
                <Route path="/authenticate" element={<Authenticate />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account/edit" element={<AccountEdit />} />
                <Route path="/account/posts" element={<AccountPosts />} />
                <Route path="/account/likes" element={<AccountLikes />} />
                <Route path="/newPost" element={<NewPost />} />
                <Route path="/updatePost/:id" element={<UpdatePost />} />
                <Route path="/whiskey" element={<Whiskey />} />
                <Route path="/champagne" element={<Champagne />} />
                <Route path="/wine" element={<Wine />} />
                <Route path="/vodka" element={<Vodka />} />
                <Route path="/cart" element={<div className="cartPage"><CartPage /></div>} />
                <Route path="/search-list" element={<SearchList />} />
                <Route path="/detail/:id" element={<DetailPage />} />
                <Route path="/payment/:id" element={<Payment />} />
                <Route path="/paymentProcess" element={<PaymentProcess />} />
                <Route path="/paymentSuccess" element={<PaymentSuccess />} />
                <Route path="/chat/:roomName" element={<ChatPage />} />
                <Route path="/chatrooms" element={<ChatRoom />} />
                <Route path="/detail/:id/reviews" element={<Reviews />} />
                <Route path="/detail/:id/writeReview" element={<WriteReviews />} />
                <Route path="*" element={
                    <Container>
                        <Row>
                            <Col>
                                <img className="mainImg" src="/image/main_imgs.jpg" alt="Main Banner" />
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
    );
};

export default RouteComponents;