import { motion } from "framer-motion";
import "./button.css";

const SignUpButton = ({clickEvent}) => {
    return (
        <>
            <motion.button onClick={clickEvent} whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }} className="signup-button">
                            회원가입
            </motion.button>
        </>
    )
}

export default SignUpButton