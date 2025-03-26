import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { useDispatch, useSelector } from 'react-redux';
import { login } from "../../components/reducers/authenticate/authThunk.js"
import { setPasswordLength } from "../../components/reducers/user/userSlice.js";
import { registerUser } from '../../components/reducers/user/userThunk.js';

import "./authenticate.css";
import AuthenticateButton from "../../components/buttons/AuthenticateButton.js";

const LoginMenu = ({ emailRef, passwordRef, showLogin, setShowLogin }) => {
    const dispatch = useDispatch()
    const { loggedIn, loading, error } = useSelector(state => state.auth)
  
    const loginHandler = (event) => {
      event.preventDefault()
      const loginData = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }
  
      dispatch(login(loginData))
      dispatch(setPasswordLength(passwordRef.current.value.length));
    }
  
    return (
      <div className="auth-background">
        {!loggedIn ? (
          <div className="auth-container">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="login-box">
              <h2 className="auth-title">로그인</h2>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
                <input type="text" placeholder="이메일" ref={emailRef} className="login-input" /><br />
                <input type="password" placeholder="비밀번호" ref={passwordRef} className="login-input" /><br />
                <p className="auth-footer">
                  <AuthenticateButton clickEvent={loginHandler} showLogin={showLogin} />
                </p>
                <button onClick={() => setShowLogin(!showLogin)} className="toggle-auth-button">{showLogin ? '회원가입' : '로그인'}</button>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div>
            <p>로그인 했습니다! 환영합니다.</p>
            <button onClick={() => localStorage.clear()}>로그아웃</button>
          </div>
        )}
      </div>
    )
  }

  const RegisterMenu = ({ emailRef, passwordRef, nicknameRef, birthdayRef, imgUrlRef, showLogin, setShowLogin }) => {
    const dispatch = useDispatch();
    const { registered, loading, error } = useSelector(state => state.user);
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
      <>
        {!registered ? (
          <div className="auth-container">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="register-box">
              <h2 className="auth-title">회원 가입</h2>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
                <input type="text" placeholder="이메일" ref={emailRef} className="register-input" /><br />
                <input type="text" placeholder="유저내임" ref={nicknameRef} className="register-input" /><br />
                <input type="password" placeholder="비밀번호" ref={passwordRef} className="register-input" /><br />
                <input type="date" placeholder="생일" ref={birthdayRef} className="register-input" /><br />
                <label className="form-label">이미지 업로드</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} /><br />
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Uploaded" className="uploaded-image" />} {/* Display uploaded image */}
                <p className="auth-footer">
                  <AuthenticateButton clickEvent={registerHandler} showLogin={showLogin} />
                  {loading && <p>Loading...</p>}
                  {error && <p>{error}</p>}
                </p>
                <button onClick={() => setShowLogin(!showLogin)} className="toggle-auth-button">{showLogin ? '회원가입' : '로그인'}</button>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div>
            <p>회원가입이 완료되었습니다! 이제 로그인할 수 있습니다.</p>
            <a href="/login">로그인 페이지로 가기</a>
          </div>
        )}
      </>
    );
  };
  
  const Authenticate = () => {
    const [showLogin, setShowLogin] = useState(true);
  
    const emailRef = useRef();
    const nicknameRef = useRef();
    const passwordRef = useRef();
    const birthdayRef = useRef();
    const imgUrlRef = useRef();
  
    return (
      <div>
        <div>
          {showLogin ? (
            <LoginMenu emailRef={emailRef} passwordRef={passwordRef}
                       showLogin={showLogin} setShowLogin={setShowLogin} />
          ) : (
            <RegisterMenu emailRef={emailRef} 
                          nicknameRef={nicknameRef} 
                          passwordRef={passwordRef}
                          birthdayRef={birthdayRef}
                          imgUrlRef={imgUrlRef}
                          showLogin={showLogin} setShowLogin={setShowLogin} />
          )}
        </div>
      </div>
    );
  };
  
  export default Authenticate;
  
