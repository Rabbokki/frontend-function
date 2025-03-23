import { configureStore } from '@reduxjs/toolkit';
import authReducer from './components/reducers/authenticate/authSlice'; // Ensure authSlice.js exists
import userReducer from './components/reducers/user/userSlice'; // Import userReducer
import chatReducer from './components/redux/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer
  },
});

export default store;