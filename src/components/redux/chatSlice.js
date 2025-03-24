// src/components/redux/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomName: '',
  roomId: null,
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setRoomName: (state, action) => {
      state.roomName = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => { // 초기 메시지 설정
      state.messages = action.payload;
    },
  },
});

export const { setRoomName, setRoomId, addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;