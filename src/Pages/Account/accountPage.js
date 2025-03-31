import { useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../components/reducers/authenticate/authSlice';
import { fetchUserData } from '../../components/reducers/user/userThunk';
import './accountPage.css';

const AccountDetails = ({userData, handleLogout, navigate}) => {
  return (
    <>
      <h1 className="account-title">Account</h1>
      <div className="account-grid">
        <div className="profile-card">
          <h2>Profile</h2>
          <p><span className="label">Nickname</span><br />{userData.nickname}</p>
          <img src={userData.imgUrl} alt="Profile" />
          <div className="button-group">
            <button onClick={handleLogout} className="btn black">Log Out</button>
            <button onClick={() => navigate("/account/edit")} className="btn">Edit</button>
          </div>
        </div>

        <div className="posts-card">
          <h2>상품</h2>
          {userData.postList?.length > 0 ? (
            <ul>
              {userData.postList.map(post => (
                <li key={post.id}>
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
          <button onClick={() => navigate("/account/posts")} className="btn black">See All Posts</button>
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

        <div className="address-card">
          <h2>Address Book</h2>
          <button className="btn black">Add New</button>
        </div>

        <div className="payment-card">
          <h2>Payment</h2>
          <button className="btn black">Manage</button>
        </div>

        <div className="wishlist-card">
          <h2>Your Wishlist Is Empty</h2>
          <p>Total items: 0</p>
          <div className="button-group">
            <button className="btn black">Details</button>
            <button className="btn grey">Share 🔗</button>
          </div>
        </div>
      </div>
    </>
  )
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

export default function AccountPage() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      console.log("Fetching user data with token:", accessToken);
      dispatch(fetchUserData(accessToken));
    }
    else console.log("No access token found");
    }, [dispatch]);

  useEffect(() => {
    console.log(userData)
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout()); // Reset auth state
    dispatch({ type: 'user/logout' }); // Reset user data
    navigate('/'); // Redirect to home
  };


    return (
      <div>
        {userData ? (
          <div className="account-container">
            <AccountDetails userData={userData} handleLogout={handleLogout} navigate={navigate}/>
            {/* <ProductsListing userPosts={userPosts} navigate={navigate}/> */}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    );
  }