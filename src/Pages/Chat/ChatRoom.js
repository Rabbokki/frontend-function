// src/pages/Chat/ChatRoom.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

const ChatRoom = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const sender = useSelector(state => state.auth.user?.email); // auth 슬라이스에서 이메일 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!sender || !accessToken) {
      alert("로그인이 필요합니다.");
      navigate('/authenticate');
      return;
    }

    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${baseUrl}/chat/rooms`, {
          headers: { 'Access_Token': accessToken }
        });
        setChatRooms(response.data.data);
      } catch (error) {
        console.error("Failed to fetch chat rooms:", error);
        alert("채팅방 목록을 가져올 수 없습니다.");
      }
    };

    fetchChatRooms();
  }, [sender, navigate]);

  const goToChat = (roomName) => {
    navigate(`/chat/${roomName}`);
  };

  return (
    <div>
      <h2>내 채팅방 목록</h2>
      {chatRooms.length === 0 ? (
        <p>참여 중인 채팅방이 없습니다.</p>
      ) : (
        <ul>
          {chatRooms.map((room) => (
            <li key={room.id} onClick={() => goToChat(room.roomName)}>
              {room.roomName} - 최근 메시지: {room.latestChatMessage || "없음"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatRoom;