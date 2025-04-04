import { motion } from "framer-motion";
import "./button.css";

const AuthenticateButton = ({clickEvent, showLogin}) => {
    return (
        <>
            <motion.button onClick={clickEvent} whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }} className='auth-button'>
                            {showLogin ? 'DopamineX 로그인' : '회원가입'}
            </motion.button>
        </>
    )
}

export default AuthenticateButton