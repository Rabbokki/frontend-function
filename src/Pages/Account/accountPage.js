import { useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../components/reducers/authenticate/authSlice';
import { fetchUserData } from '../../components/reducers/user/userThunk';
import './accountPage.css';

const AccountDetails = ({userData, handleLogout, navigate}) => {
  const passwordLength = useSelector((state) => state.user.passwordLength);

  return (
    <>
      <div className="account-grid">
      <h2 className="card-title">프로필</h2>
        <div className="profile-card">
          <img src={userData.imgUrl} alt="Profile" />
          <p><span className="label">Nickname</span><br />{userData.nickname}</p>
          <p><span className="label">Email</span><br />{userData.email}</p>
          <p><span className="label">Password</span><br />{"*".repeat(passwordLength)}</p>
          <div className="button-group">
            <button onClick={() => navigate("/account/edit")} className="btn edit">수정</button>
            <button onClick={handleLogout} className="btn logout">로그아옷</button>
          </div>
        </div>

        <h2 className="card-title">상품</h2>
          <div className="posts-card">
            {userData.postList?.length > 0 ? (
              <ul>
                {userData.postList
                  .slice(-8)
                  .reverse()
                  .map(post => (
                    <li key={post.id}
                        onClick={() => navigate(`/detail/${post.id}`)} 
                        style={{ cursor: "pointer" }}
                    >
                      {post.imgUrl && <img src={post.imgUrl} alt={post.title} className="post-image" />}
                      <p><strong>{post.title}</strong></p>
                      <p>{post.price}원</p>
                      <p><small>{new Date(post.createdAt).toLocaleString()}</small></p>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>등록한 상품이 없습니다.</p>
            )}
            <button onClick={() => navigate("/account/posts")} className="btn all-posts">모든 상품 보기</button>
          </div>


        <div className="reviews-card">
          <h2>상품 후기</h2>
          {userData.reviews?.length > 0 ? (
            <ul>
              {userData.reviews.map(review => (
                <li key={review.id}>
                  <p>{review.content}</p>
                  <p><small>{new Date(review.createdAt).toLocaleString()}</small></p>
                </li>
              ))}
            </ul>
          ) : (
            <p>등록된 후기가 없습니다.</p>
          )}
          <button onClick={() => navigate("/account/reviews")} className="btn black">See All Reviews</button>
        </div>

        <div className="bookmarks-card">
          <h2>찜</h2>
          {userData.bookMarks?.length > 0 ? (
            <ul>
              {userData.bookMarks.map(bookMark => (
                <li key={bookMark.id}>
                  <p><strong>{bookMark.postTitle}</strong> (Post ID: {bookMark.postId})</p>
                  <p><small>{new Date(bookMark.createdAt).toLocaleString()}</small></p>
                </li>
              ))}
            </ul>
          ) : (
            <p>찜한 상품이 없습니다.</p>
          )}
          <button onClick={() => navigate("/account/bookmarks")} className="btn black">See All Bookmarks</button>
        </div>
      </div>
    </>
  )
}

export default function AccountPage() {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("AccountPage - Access Token from localStorage:", accessToken);
    if (!accessToken) {
      console.log("No access token found");
      navigate('/authenticate');
    } else if (!userData && !loading) {
      console.log("Fetching user data with token:", accessToken);
      dispatch(fetchUserData(accessToken))
        .unwrap()
        .catch((err) => {
          console.error("Fetch user data failed:", err);
          navigate('/authenticate');
        });
    }

    console.log(userData)
  }, [dispatch, navigate, userData, loading]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    navigate('/authenticate');
  };

  if (loading) {
    return <p>사용자 데이터를 불러오는 중...</p>;
  }

  if (error) {
    return <p>오류: {error}</p>;
  }

  if (!userData) {
    return <p>사용자 데이터를 불러오는 중입니다...</p>;
  }

  return (
    <div>
      <div className="account-container">
        <AccountDetails userData={userData} handleLogout={handleLogout} navigate={navigate} />
      </div>
    </div>
  );
}

// const ProductsListing = ({userPosts, navigate}) => {
//   return (
//     <div className="user-products-section">
//       <h2>Your Products</h2>
//       <div className="products-grid">
//         {userPosts.slice(0, 8).map((product) => (
//           <div key={product.id} className="product-card">
//             <img src={product.imageUrl} alt={product.title} className="product-image" />
//             <div className="product-info">
//               <p className="product-title">{product.title}</p>
//               <p className="product-price">{product.price}원</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       {userPosts.length > 8 && (
//         <button className="btn see-more" onClick={() => navigate("/account/products")}>
//           See More
//         </button>
//       )}
//     </div>
//   )
// }