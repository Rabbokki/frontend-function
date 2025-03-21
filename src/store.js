import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Components/reducers/authenticate/authSlice';
import userReducer from './Components/reducers/user/userSlice';
import postReducer from "./Components/reducers/post/postSlice";
import likeReducer from "./Components/reducers/likes/likeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    likes: likeReducer
  },
});

export default store;