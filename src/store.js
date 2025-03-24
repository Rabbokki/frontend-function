import { configureStore } from '@reduxjs/toolkit';
import authReducer from './components/reducers/authenticate/authSlice';
import userReducer from './components/reducers/user/userSlice';
import postReducer from "./components/reducers/post/postSlice";
import likeReducer from "./components/reducers/likes/likeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    likes: likeReducer
  },
});

export default store;