import { motion } from 'framer-motion';

const SaveChangesButton = ({ editing }) => {
  return (
    <>
      {editing && (
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="save-changes-button"
          initial={{ opacity: 0 }} // Initially invisible
          animate={{ opacity: 1 }} // Fade in to fully visible
          transition={{ duration: 0.8 }} // Duration of the fade-in
        >
          수정하기
        </motion.button>
      )}
    </>
  );
};

export default SaveChangesButton;