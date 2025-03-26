import { configureStore } from '@reduxjs/toolkit';
import authReducer from './components/reducers/authenticate/authSlice'; // Ensure authSlice.js exists
import chatReducer from './components/redux/chatSlice';
import userReducer from './components/reducers/user/userSlice';
import postReducer from "./components/reducers/post/postSlice";
import likeReducer from "./components/reducers/likes/likeSlice";
import reviewReducer from "./components/reducers/review/reviewSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
    posts: postReducer,
    likes: likeReducer,
    reviews: reviewReducer
  },
});

export default store;