// src/pages/Chat/ChatPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { setRoomName, setRoomId, addMessage, setMessages } from '../../components/redux/chatSlice';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

function ChatPage() {
  const dispatch = useDispatch();
  const { messages, roomName, roomId } = useSelector(state => state.chat);
  const { userData } = useSelector(state => state.user);
  const { roomName: urlRoomName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [sender, setSender] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;
    console.log('ChatPage useEffect - urlRoomName:', urlRoomName, 'roomId:', location.state?.roomId);

    const accessToken = localStorage.getItem('accessToken');
    let account = userData?.email || localStorage.getItem('userEmail');
    const passedRoomId = location.state?.roomId;

    if (!urlRoomName) {
      alert('채팅방 이름이 누락되었습니다.');
      navigate('/');
      return;
    }

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate('/authenticate');
      return;
    }

    if (!account) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      account = payload.sub;
      localStorage.setItem('userEmail', account);
    }
    setSender(account);

    const fetchChatData = async () => {
      try {
        const roomResponse = await axios.get(`${baseUrl}/chat/${urlRoomName}`, {
          headers: { 'Access_Token': accessToken }
        });
        const roomData = roomResponse.data.data;
        console.log('Chat room data:', roomData);
        dispatch(setRoomName(roomData.roomName));
        dispatch(setRoomId(passedRoomId || roomData.id));
    
        const messagesResponse = await axios.get(`${baseUrl}/chat/${roomData.roomName}/messages`, {
          headers: { 'Access_Token': accessToken }
        });
        console.log('Fetched messages:', messagesResponse.data.data);
        dispatch(setMessages(messagesResponse.data.data));
    
        connectWebSocket(roomData.roomName, account, accessToken);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch chat data:", error.response ? error.response.data : error.message);
        alert("채팅방 정보를 가져올 수 없습니다: " + (error.response?.data?.error || error.message));
        navigate('/');
      }
    };

    fetchChatData();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
        console.log("WebSocket disconnected");
      }
    };
  }, [dispatch, urlRoomName, navigate, location.state, userData]);

  const connectWebSocket = (roomName, sender, accessToken) => {
    const socket = new SockJS(`${baseUrl}/ws`);
    const stomp = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        'Access_Token': accessToken
      },
    });

    stomp.onConnect = () => {
      console.log('WebSocket connected');
      stomp.subscribe(`/sub/chatroom/${roomName}`, (message) => {
        const msg = JSON.parse(message.body);
        dispatch(addMessage(msg));
      });
    };

    stomp.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
    };

    stomp.activate();
    setStompClient(stomp);
  };

  const sendMessage = () => {
    if (message.trim() === '' || !stompClient || !stompClient.connected) return;
    const payload = {
      roomId,
      message,
      sender
    };
    console.log('Sending message:', payload);
    stompClient.publish({
      destination: '/pub/chat',
      body: JSON.stringify(payload),
    });
    setMessage('');
  };

  return (
    <div>
      <h2>채팅방: {roomName}</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.sender === sender ? 'right' : 'left',
                margin: '5px 0',
              }}
            >
              <span
                style={{
                  backgroundColor: msg.sender === sender ? '#007bff' : '#e9ecef',
                  color: msg.sender === sender ? 'white' : 'black',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  display: 'inline-block',
                  maxWidth: '70%',
                }}
              >
                <strong>{msg.sender}:</strong> {msg.message}
              </span>
            </div>
          ))
        ) : (
          <p>아직 메시지가 없습니다.</p>
        )}
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{ width: '80%', padding: '5px' }}
        />
        <button onClick={sendMessage} style={{ padding: '5px 10px', marginLeft: '10px' }}>
          전송
        </button>
      </div>
    </div>
  );
}

export default ChatPage;