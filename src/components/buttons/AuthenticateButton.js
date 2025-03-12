import { motion } from "framer-motion";
import "./button.css";

const LoginButton = ({clickEvent, showLogin}) => {
    return (
        <>
            <motion.button onClick={clickEvent} whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }} className={showLogin ? "login-button" : "signup-button"}>
                            {showLogin ? '로그인' : '회원가입'}
            </motion.button>
        </>
    )
}

export default LoginButton