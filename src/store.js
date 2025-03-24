import { configureStore } from '@reduxjs/toolkit';
<<<<<<< HEAD
import authReducer from './components/reducers/authenticate/authSlice'; // Ensure authSlice.js exists
import userReducer from './components/reducers/user/userSlice'; // Import userReducer
import chatReducer from './components/redux/chatSlice';
=======
import authReducer from './Components/reducers/authenticate/authSlice';
import userReducer from './Components/reducers/user/userSlice';
import postReducer from "./Components/reducers/post/postSlice";
import likeReducer from "./Components/reducers/likes/likeSlice";
>>>>>>> feature-you-three

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
<<<<<<< HEAD
    chat: chatReducer
=======
    posts: postReducer,
    likes: likeReducer
>>>>>>> feature-you-three
  },
});

export default store;