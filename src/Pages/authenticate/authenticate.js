import { useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import "./authenticate.css";
import LoginButton from "../../components/buttons/LoginButton";
import SignUpButton from "../../components/buttons/SignUpButton";

const LoginMenu = ({emailRef, passwordRef, login, loggedIn, setLoggedIn}) => {
    return (
        <div>
            {!loggedIn ? (
                <div className="auth-container">
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }} className="login-box">
                        <h2 className="auth-title">로그인</h2>
                        <motion.div initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}>
                            <input type="text" placeholder="이매일" ref={emailRef} className="login-input" /><br />
                            <input type="password" placeholder="비밀번호" ref={passwordRef} className="login-input" /><br />
                            <p className="auth-footer">
                                <LoginButton clickEvent={(event) => login(event)} />
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            ) : (
                <div>
                    <p>로그인 했습니다! 환영합니다.</p>
                    <a href="/">매인 페이지로 가기</a><br />
                    <button onClick={() => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        setLoggedIn(false);
                    }}>로그아웃</button>
                </div>
            )}
        </div>
    )
}

const RegisterMenu = ({registered, saveUser, emailRef, passwordRef, nicknameRef}) => {
    return (
        <div>
          {!registered ? (
            <div className="auth-container">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }} className="register-box">
                    <h2 className="auth-title">회원 가입</h2>
                    <motion.div initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}>
                            <input type="text" placeholder="이매일" ref={emailRef} className="register-input" /><br />
                            <input type="text" placeholder="유저내임" ref={nicknameRef} className="register-input" /><br />
                            <input type="password" placeholder="비밀번호" ref={passwordRef} className="register-input" /><br />
                            <p className="auth-footer">
                                <SignUpButton clickEvent={(event) => saveUser(event)} />
                            </p>
                        </motion.div>
              </motion.div>
            </div>
          ) : (
            <div>
              <p>회원가입이 완료되었습니다! 이제 로그인할 수 있습니다.</p>
              <a href="/login">로그인 페이지로 가기</a>
            </div>
          )}
        </div>
      );
}

const Authenticate = (props) => {
    const { loggedIn, setLoggedIn } = props;

    const [showLogin, setShowLogin] = useState(true);
    const [registered, setRegistered] = useState(false)

    const emailRef = useRef();
    const nicknameRef = useRef();
    const passwordRef = useRef();

    const login = (event) => {
        event.preventDefault();

        if (emailRef.current.value === "" || passwordRef.current.value === "") {
            alert("모든 필드를 작성해야 합니다.")
            return;
          }
        
        const loginData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        axios.post("/account/login", loginData)
        .then((response) => {
            console.log(response);
            const accessToken = response.headers['access_token']; 
            const refreshToken = response.headers['refresh_token'];
            if (accessToken) {
                console.log("Success");
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                setLoggedIn(true);
            }
        })
        .catch((error) => {
            console.error(error);
            alert("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.");
        });
    }

    const saveUser = (event) => {
        event.preventDefault();
        if (emailRef.current.value === "" || nicknameRef.current.value === "" || passwordRef.current.value === "") {
          alert("모든 필드를 작성해야 합니다.")
          return;
        }
    
        const newUser = {
          email: emailRef.current.value,
          nickname: nicknameRef.current.value,
          password: passwordRef.current.value,
        }
    
        axios.post("/account/signup", newUser)
             .then((response => {
                if (response.data.success) setRegistered(true);
                else alert("회원가입 실패");
             }))
             .catch((error) => {
                console.error("There was an error!", error);
                alert("회원가입 중 오류 발생");
              });
    
        setRegistered(true);
      }

    return (
        <div>
            <div>
                {showLogin ? (
                    <LoginMenu emailRef={emailRef} passwordRef={passwordRef}
                    login={login} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
                ) : ( <RegisterMenu registered={registered} saveUser={saveUser} emailRef={emailRef} 
                                    nicknameRef={nicknameRef} passwordRef={passwordRef}/>
                )}
            </div>
            <button onClick={() => setShowLogin(!showLogin)}>{showLogin ? '회원가입' : '로그인'}</button>
        </div>

    );
};

export default Authenticate;
