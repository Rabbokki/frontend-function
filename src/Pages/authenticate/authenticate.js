import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../components/reducers/authenticate/authThunk";
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

    useEffect(() => {
        if (loggedIn) {
            navigate('/account');
        }
    }, [loggedIn, navigate]);

    const loginHandler = (event) => {
        event.preventDefault();
        const loginData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        dispatch(login(loginData));
    };

    const handleKakaoLogin = () => {
        window.location.href = 'https://dopaminex.kro.kr:8443/oauth2/authorization/kakao';
    };
    const handleGoogleLogin = () => {
        window.location.href = 'https://dopaminex.kro.kr:8443/oauth2/authorization/google';
    };

    const handleNaverLogin = () => {
        window.location.href = 'https://dopaminex.kro.kr:8443/oauth2/authorization/naver';
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
                                <AuthenticateButton onClick={loginHandler} showLogin={showLogin} />
                                <motion.div
                                    className="social-login-container"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.8 }}
                                >
                                    <div className="social-login-buttons">
                                        <GoogleLoginButton onClick={handleGoogleLogin} />
                                        <NaverLoginButton onClick={handleNaverLogin} />
                                        <KakaoLoginButton onClick={handleKakaoLogin} />
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
                </div>
            )}
        </div>
    );
};

const RegisterMenu = ({ emailRef, passwordRef, nicknameRef, birthdayRef, showLogin, setShowLogin }) => {
    const dispatch = useDispatch();
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
                        <form onSubmit={registerHandler}>
                            <input type="text" placeholder="이메일" ref={emailRef} className="auth-input" /><br />
                            <input type="text" placeholder="유저네임" ref={nicknameRef} className="auth-input" /><br />
                            <input type="password" placeholder="비밀번호" ref={passwordRef} className="auth-input" /><br />
                            <input type="date" placeholder="생일" ref={birthdayRef} className="auth-input" /><br />
                            <label className="form-label">이미지 업로드</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} /><br />
                            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Uploaded" className="uploaded-image" />}
                            <p className="login-link" onClick={() => setShowLogin(true)}>로그인</p>
                            <AuthenticateButton clickEvent={registerHandler} showLogin={showLogin} />
                            {loading && <p>Loading...</p>}
                            {error && <p style={{ color: 'red' }}>에러: {error}</p>}
                        </form>
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