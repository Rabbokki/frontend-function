import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Whiskey from "../Pages/Whiskey";
import { Routes, Route, Navigate } from "react-router-dom";
import Authenticate from "../Pages/authenticate/authenticate";
import MyPage from "../Pages/MyPage/my-page";
import Champagne from '../Pages/Champagne/index';
import Wine from '../Pages/Wine/index';
import Vodka from '../Pages/Vodka/index';
import CartPage from '../Pages/CartPage/index';

const RouteComponents = ({currentUser, setCurrentUser, loggedIn, setLoggedIn}) => {
  return (
    <div>
      <Routes>
        <Route path="/authenticate" element={<Authenticate loggedIn={loggedIn}setLoggedIn={setLoggedIn}/>}/>
        <Route path="/myPage" element={<MyPage loggedIn={loggedIn}setLoggedIn={setLoggedIn}/>}/>
        <Route path="/whiskey" element={<Whiskey></Whiskey>}/>
        <Route path="/champagne" element={<Champagne></Champagne>}/>
        <Route path="/wine" element={<Wine></Wine>}/>
        <Route path="/vodka" element={<Vodka></Vodka>}/>
        <Route path="/cart" element={<div className="cartPage"><CartPage></CartPage></div>}></Route>
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
            <Col xs><div className="main_colum_3">Chice</div></Col>
          </Row>
        </Container>
        } />
      </Routes>
    </div>
  )
}

export default RouteComponents