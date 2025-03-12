import { motion } from "framer-motion";
import "./button.css";

const LoginButton = ({clickEvent}) => {
    return (
        <>
            <motion.button onClick={clickEvent} whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }} className="login-button">
                            로그인
            </motion.button>
        </>
    )
}

export default LoginButton