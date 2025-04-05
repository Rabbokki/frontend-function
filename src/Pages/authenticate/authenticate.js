import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../../components/reducers/authenticate/authThunk";
import { registerUser } from "../../components/reducers/user/userThunk";
import "./authenticate.css";
import AuthenticateButton from "../../components/buttons/AuthenticateButton";
import GoogleLoginButton from "./GoogleLoginButton";
import NaverLoginButton from "./NaverLoginButton";
import KakaoLoginButton from "./KakaoLoginButton";

const LoginMenu = ({ emailRef, passwordRef, showLogin, setShowLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, loading, error } = useSelector((state) => state.auth);

  const loginHandler = (event) => {
    event.preventDefault();
    const loginData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    dispatch(login(loginData));
  };

  //네이버 로그인
  const NAVER_CLIENT_ID = 'SoCGXgkbeenb0805p8BQ'; // 네이버 개발자 센터에서 발급받은 클라이언트 ID
  const NAVER_REDIRECT_URI = 'http://52.79.225.242/callback'; // 또는 사용 중인 도메인 
  const naverUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=STATE_STRING`;
  
  
  //카카오 로그인
  const REST_API_KEY = '59863455ad799376c5e0310b92c4e537';
  const REDIRECT_URI = 'http://localhost:3000';
  const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`
  const handleKakaoLogin = ()=>{
    window.location.href = kakaoUrl
  }
  
  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };
  
  const handleNaverLogin = () => {
    window.location.href = 'http://52.79.225.242:8081/oauth2/authorization/naver';
  };

  return (
    <div className="auth-background">
      {!loggedIn ? (
        <div className="auth-container">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="auth-box"
          >
            <h2 className="auth-title">로그인</h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
              <form onSubmit={loginHandler}>
                <input type="text" placeholder="이메일" ref={emailRef} className="auth-input" />
                <br />
                <input type="password" placeholder="비밀번호" ref={passwordRef} className="auth-input" />
                <br />
                <p className="register-link" onClick={() => setShowLogin(false)}>
                  회원가입
                </p>
                <AuthenticateButton onClick={loginHandler}  showLogin={showLogin} />
                <motion.div
                  className="social-login-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                >
                  <div className="social-login-buttons">
                    <GoogleLoginButton onClick={handleGoogleLogin} />
                    <NaverLoginButton onClick={handleNaverLogin} />
                    <KakaoLoginButton onClick={handleKakaoLogin}/>
                  </div>
                </motion.div>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
              </form>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div>
          <p>로그인 했습니다! 환영합니다.</p>
          {navigate('/account')}
        </div>
      )}
    </div>
  );
};

const RegisterMenu = ({ emailRef, passwordRef, nicknameRef, birthdayRef, showLogin, setShowLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registered, loading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const registerHandler = (event) => {
    event.preventDefault();
    const newUser = {
      email: emailRef.current.value,
      nickname: nicknameRef.current.value,
      password: passwordRef.current.value,
      birthday: birthdayRef.current.value,
      imgUrl: imageFile,
    };
    dispatch(registerUser(newUser));
  };

  return (
    <div className="auth-container">
      {!registered ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="auth-box">
          <h2 className="auth-title">회원 가입</h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <input type="text" placeholder="이메일" ref={emailRef} className="auth-input" /><br />
            <input type="text" placeholder="유저네임" ref={nicknameRef} className="auth-input" /><br />
            <input type="password" placeholder="비밀번호" ref={passwordRef} className="auth-input" /><br />
            <input type="date" placeholder="생일" ref={birthdayRef} className="auth-input" /><br />
            <label className="form-label">이미지 업로드</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} /><br />
            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Uploaded" className="uploaded-image" />}
            <p className="login-link" onClick={() => setShowLogin(true)}>
                  로그인
                </p>
            <p className="auth-footer">
              <AuthenticateButton clickEvent={registerHandler} showLogin={showLogin} />
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
            </p>
            <button onClick={() => setShowLogin(!showLogin)} className="toggle-auth-button">
              {showLogin ? "회원가입" : "로그인"}
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <div>
          <p>회원가입이 완료되었습니다! 이제 로그인할 수 있습니다.</p>
      </div>
      )}
    </div>
  );
};

// const RegisterMenu = ({ emailRef, passwordRef, nicknameRef, birthdayRef, showLogin, setShowLogin }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const { registered, loading, error } = useSelector((state) => state.user);
//   const [imageFile, setImageFile] = useState(null);

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     setImageFile(file);
//   };

//   const handleRemoveImage = () => {
//     setImageFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const registerHandler = (event) => {
//     event.preventDefault();
//     const newUser = {
//       email: emailRef.current.value,
//       nickname: nicknameRef.current.value,
//       password: passwordRef.current.value,
//       birthday: birthdayRef.current.value,
//       imgUrl: imageFile,
//     };
//     dispatch(registerUser(newUser));
//   };

//   return (
//     <div className="auth-container">
//       {!registered ? (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="auth-box">
//           <h2 className="auth-title">회원 가입</h2>
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
//             <input type="text" placeholder="이메일" ref={emailRef} className="auth-input" /><br />
//             <input type="text" placeholder="유저네임" ref={nicknameRef} className="auth-input" /><br />
//             <input type="password" placeholder="비밀번호" ref={passwordRef} className="auth-input" /><br />
//             <input type="date" placeholder="생일" ref={birthdayRef} className="auth-input" /><br />

//             <label className="form-label">이미지 업로드</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               ref={fileInputRef}
//             /><br />

//             {imageFile && (
//               <div className="image-thumbnail">
//                 <img src={URL.createObjectURL(imageFile)} alt="Uploaded" className="uploaded-image" />
//                 <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
//                   ✖
//                 </button>
//               </div>
//             )}

//             <AuthenticateButton onClick={registerHandler} showLogin={showLogin} />
//             <p className="login-link" onClick={() => setShowLogin(true)}>로그인</p>
//             {loading && <p>Loading...</p>}
//             {error && <p>{error}</p>}
//           </motion.div>
//         </motion.div>
//       ) : (
//         <div>
//           <p>회원가입이 완료되었습니다! 이제 로그인할 수 있습니다.</p>
//           {navigate('/account')}
//         </div>
//       )}
//     </div>
//   );
// };

const Authenticate = () => {
  const [showLogin, setShowLogin] = useState(true);
  const emailRef = useRef();
  const nicknameRef = useRef();
  const passwordRef = useRef();
  const birthdayRef = useRef();

  return (
    <div>
      {showLogin ? (
        <LoginMenu emailRef={emailRef} passwordRef={passwordRef} showLogin={showLogin} setShowLogin={setShowLogin} />
      ) : (
        <RegisterMenu
          emailRef={emailRef}
          nicknameRef={nicknameRef}
          passwordRef={passwordRef}
          birthdayRef={birthdayRef}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
        />
      )}
    </div>
  );
};

export default Authenticate;

