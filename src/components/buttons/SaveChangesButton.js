import { motion } from "framer-motion";
import "./button.css";

const SaveChangesButton = ({editing}) => {
    return (
        <>
            <motion.button type="submit" whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }} className={`save-changes-button ${editing ? 'show' : ''}`}>
                            수정하기
            </motion.button>
        </>
    )
}

export default SaveChangesButton;