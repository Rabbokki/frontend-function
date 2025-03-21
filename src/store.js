import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Components/reducers/authenticate/authSlice'; // Ensure authSlice.js exists
import userReducer from './Components/reducers/user/userSlice'; // Import userReducer
import chatReducer from './Components/redux/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer
  },
});

export default store;