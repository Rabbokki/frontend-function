import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  roomId: null,
  roomName: null,
  sender: "",
  isConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSender: (state, action) => {
      state.sender = action.payload;
    },
    setRoom: (state, action) => {
      state.roomId = action.payload.roomId;
      state.roomName = action.payload.roomName;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setSender, setRoom, addMessage, clearMessages, setConnectionStatus } = chatSlice.actions;
export default chatSlice.reducer;
