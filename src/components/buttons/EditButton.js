import { motion } from "framer-motion";
import "./button.css";

const EditButton = ({clickEventEdit, clickEventDone, fieldName, editField}) => {
    const editting = fieldName === editField

    const handleClick = (event) => {
        event.preventDefault()
        editting ? clickEventDone() : clickEventEdit()
        console.log(editting)
    }

    return (
        <>
            <motion.button onClick={handleClick}
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           className={editting ? "stop-button" : "edit-button"}>
                            {editting ? "제거" : "수정"}
            </motion.button>
        </>
    )
}

export default EditButton