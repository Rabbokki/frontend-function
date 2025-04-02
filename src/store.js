import { configureStore } from '@reduxjs/toolkit';
import authReducer from './components/reducers/authenticate/authSlice';
import chatReducer from './components/redux/chatSlice';
import userReducer from './components/reducers/user/userSlice';
import postReducer from './components/reducers/post/postSlice';
import paymentReducer from './components/reducers/payment/paymentSlice';
import likeReducer from './components/reducers/likes/likeSlice';
import reviewReducer from './components/reducers/review/reviewSlice';

const rootReducer = {
  auth: authReducer,
  user: userReducer,
  chat: chatReducer,
  posts: postReducer,
  payment: paymentReducer,
  likes: likeReducer,
  reviews: reviewReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export default store; 