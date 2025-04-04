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
            <button onClick={handleClick}
                           className={editting ? "stop-button" : "edit-button"}>
                            {editting ? "제거" : "수정"}
            </button>
        </>
    )
}

export default EditButton