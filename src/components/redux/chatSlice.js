// src/Components/reducers/chat/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomName: null,
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setRoomName: (state, action) => {
      state.roomName = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.roomName = null;
      state.messages = [];
    },
  },
});

export const { setRoomName, addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;