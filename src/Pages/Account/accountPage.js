import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../components/reducers/authenticate/authSlice';
import { fetchUserData } from '../../components/reducers/user/userThunk';
import { motion } from 'framer-motion';
import './accountPage.css';

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.5 } }) 
};

const AccountDetails = ({ userData, handleLogout, navigate }) => {
  const passwordLength = localStorage.getItem("passwordLength");

  return (
    <motion.div className="account-grid" initial="hidden" animate="visible">
      
      {/* Profile Section - First to fade in */}
      <motion.div className="profile-card" custom={0} variants={fadeInVariant}>
        <h2 className="card-title">프로필</h2>
        <img src={userData.imgUrl} alt="Profile" />
        <p><span className="label">Nickname</span><br />{userData.nickname}</p>
        <p><span className="label">Email</span><br />{userData.email}</p>
        <p><span className="label">Password</span><br />{"*".repeat(passwordLength)}</p>
        <div className="button-group">
          <button onClick={handleLogout} className="btn logout">로그아웃</button>
          <button onClick={() => navigate("/account/edit")} className="btn">Edit</button>
        </div>
      </motion.div>

      {/* Posts Section - Fades in after Profile */}
      <motion.div className="posts-card" custom={1} variants={fadeInVariant}>
        <h2 className="card-title">상품</h2>
        {userData.postList?.length > 0 ? (
          <ul>
            {userData.postList.slice(-8).reverse().map((post) => (
              <li key={post.id} onClick={() => navigate(`/detail/${post.id}`)} style={{ cursor: "pointer" }}>
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
      </motion.div>

      {/* Likes Section - Fades in after Posts */}
      <motion.div className="likes-card" custom={2} variants={fadeInVariant}>
        <h2 className="card-title">찜</h2>
        {userData.likeList?.length > 0 ? (
          <ul>
            {userData.likeList.slice(-8).reverse().map((like) => (
              <li key={like.id} onClick={() => navigate(`/detail/${like.postId}`)} style={{ cursor: "pointer" }}>
                {like.imgUrl && <img src={like.imgUrl} alt={like.postTitle} className="post-image" />}
                <p><strong>{like.postTitle}</strong></p>
                <p><small>{new Date(like.createdAt).toLocaleString()}</small></p>
              </li>
            ))}
          </ul>
        ) : (
          <p>찜한 상품이 없습니다.</p>
        )}
        <button onClick={() => navigate("/account/likes")} className="btn black">모든 찜 보기</button>
      </motion.div>

    </motion.div>
  );
};

export default function AccountPage() {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate('/authenticate');
    } else if (!userData && !loading) {
      dispatch(fetchUserData(accessToken)).unwrap().catch(() => navigate('/authenticate'));
    }
  }, [dispatch, navigate, userData, loading]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/authenticate');
  };

  if (loading) return <p>사용자 데이터를 불러오는 중...</p>;
  if (error) return <p>오류: {error}</p>;
  if (!userData) return <p>사용자 데이터를 불러오는 중입니다...</p>;

  return (
    <div className="account-container">
      <AccountDetails userData={userData} handleLogout={handleLogout} navigate={navigate} />
    </div>
  );
}
