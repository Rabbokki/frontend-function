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
          <p><span className="label">Email</span><br />{userData.email}</p>
          <p><span className="label">Password</span><br />********</p>
          <div className="button-group">
            <button onClick={handleLogout} className="btn black">Log Out</button>
            <button onClick={() => navigate("/account/edit")} className="btn">Edit</button>
          </div>
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
  const { userData, userPosts } = useSelector((state) => state.user);
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      console.log("Fetching user data with token:", accessToken);
      dispatch(fetchUserData(accessToken));
    }
    else console.log("No access token found");
    }, [dispatch]);

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
