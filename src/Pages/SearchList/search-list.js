// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { fetchPosts } from "../../components/reducers/post/postThunk";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import "./search-list.css";

// const SearchList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const query = searchParams.get("query")?.toLowerCase() || "";

//   const { posts, loading, error } = useSelector((state) => state.posts);
//   const baseUrl = process.env.REACT_APP_BASE_URL;

//   useEffect(() => {
//     dispatch(fetchPosts());
//   }, [dispatch]);

//   const filteredPosts = query
//     ? posts.filter((post) => post.title.toLowerCase().includes(query))
//     : posts;

//   const handleClick = (id) => {
//     navigate(`/detail/${id}`);
//   };

//   if (loading) return <p>로딩 중...</p>;
//   if (error) return <p>에러: {error}</p>;

//   return (
//     <div className="search-list-container">
//       <div className="row">
//         {filteredPosts.length > 0 ? (
//           filteredPosts.map((liquor, index) => (
//             <div key={index} className="col-md-3">
//               <Container>
//                 <Row>
//                   <Col>
//                     <div className="image-wrapper" onClick={() => handleClick(liquor.id)}>
//                       <img
//                         src={liquor.imageUrls?.[0]}
//                         alt="상품 이미지"
//                         className="img-fluid product-image"
//                       />
//                       <div className="product-info">
//                         <div className="product-title">{liquor.title}</div>
//                         <div className="product-price">
//                           <p>{liquor.price}<span>원</span></p>
//                           <p>{liquor.timeAgo}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//               </Container>
//             </div>
//           ))
//         ) : (
//           <p>상품을 찾을 수 없습니다.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchList;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { fetchPosts } from "../../components/reducers/post/postThunk";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./search-list.css";

const SearchList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";

  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    console.log("Fetching posts...");
    dispatch(fetchPosts()).then((result) => {
      console.log("Fetch result:", result);
    });
  }, [dispatch]);

  console.log("Redux posts:", posts);
  console.log("Query:", query);

  const safePosts = Array.isArray(posts) ? posts : [];
  const filteredPosts = query
    ? safePosts.filter((post) => post?.title?.toLowerCase().includes(query))
    : safePosts;

  console.log("Filtered posts:", filteredPosts);

  const handleClick = (id) => {
    navigate(`/detail/${id}`);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div className="search-list-container">
      <div className="row">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((liquor, index) => (
            <div key={index} className="col-md-3">
              <Container>
                <Row>
                  <Col>
                    <div className="image-wrapper" onClick={() => handleClick(liquor.id)}>
                      <img
                        src={liquor.imageUrls?.[0] || "default-image.jpg"}
                        alt="상품 이미지"
                        className="img-fluid product-image"
                      />
                    </div>
                    <div className="product-info" onClick={() => handleClick(liquor.id)}>
                      <div className="product-title">{liquor.title || "제목 없음"}</div>
                      <div className="product-price">
                        <p>{liquor.price ? `${liquor.price}원` : "가격 미정"}</p>
                        <p>{liquor.timeAgo || "시간 정보 없음"}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          ))
        ) : (
          <p>상품을 찾을 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default SearchList;

