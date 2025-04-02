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
import ChatPage from '../pages/Chat/ChatPage'
import ChatRoom from '../pages/Chat/ChatRoom'
import Reviews from '../pages/review/review'
import WriteReviews from '../pages/review/writeReview'
import { useEffect, useState } from "react";
import axios from "axios";

const RouteComponents = () => {
  const [userKakaoToken , setUserKakaoToken] = useState([])
  const [userData , setUserData] =useState([]);
  const code = new URL(window.location.href).searchParams.get("code")
  const REST_API_KEY = '59863455ad799376c5e0310b92c4e537';
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://192.168.0.71:8081";
  const kakaoUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&code=${code}`
  console.log(code)
  useEffect(()=>{
    if(code){
      axios.post(`${baseUrl}/user`, {code: code})
      .then((res)=>{
        console(res.data)
      })
      .catch((err)=>{
        console.log("요청 실패", err)
      })
    }
  })

  // useEffect(()=>{
  //   if(code){
  //     axios.post(`${kakaoUrl}`)
  //     .then((res)=>(
  //       setUserKakaoToken(res.data.access_token)
  //       .axios.get("https://kapi.kakao.com/v2/user/me" , {
  //         Auth: {bearerToken : userKakaoToken}
  //       })
  //       .then((res)=>(
  //         setUserData(res.data)
  //         .console.log(userData)
  //       ))
  //     ))
  //     .catch((err)=>{
  //     })
  //   }
  // },[code])
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