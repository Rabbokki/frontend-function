// src/components/redux/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    roomName: '',
    roomId: null,
  },
  reducers: {
    setRoomName(state, action) {
      state.roomName = action.payload;
    },
    setRoomId(state, action) {
      state.roomId = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload; // 기존 메시지를 덮어씌움
    },
    addMessage(state, action) {
      state.messages.push(action.payload); // 새 메시지 추가
    },
    // 초기화 방지를 위해 필요 시 추가
    clearChat(state) {
      state.messages = [];
      state.roomName = '';
      state.roomId = null;
    },
  },
});

export const { setRoomName, setRoomId, setMessages, addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;