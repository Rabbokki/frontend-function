import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Components/reducers/authenticate/authSlice'; // Ensure authSlice.js exists
import userReducer from './Components/reducers/user/userSlice'; // Import userReducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export default store;