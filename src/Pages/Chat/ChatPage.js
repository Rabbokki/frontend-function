import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { setRoomName, setRoomId, addMessage, setMessages } from '../../components/redux/chatSlice';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

let globalStompClient = null;
let subscription = null;

function ChatPage() {
  const dispatch = useDispatch();
  const { messages, roomName, roomId } = useSelector(state => state.chat);
  const { userData } = useSelector(state => state.user);
  const { roomName: urlRoomName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const messagesEndRef = useRef(null);

  const { image, title, price, content, sellerEmail, sellerNickname } = location.state || {};

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    let account = userData?.email || localStorage.getItem('userEmail');
    const passedRoomId = location.state?.roomId;
  
    if (!urlRoomName || !accessToken) {
      alert(!urlRoomName ? '채팅방 이름이 누락되었습니다.' : '로그인이 필요합니다.');
      navigate(!urlRoomName ? '/' : '/authenticate');
      return;
    }
  
    if (!account) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      account = payload.sub;
      localStorage.setItem('userEmail', account);
    }
    setSender(account);
    setReceiver(sellerNickname || sellerEmail);
    console.log('location.state:', location.state);
    console.log('sender:', account);
    console.log('sellerNickname:', sellerNickname);
    console.log('receiver:', sellerNickname || sellerEmail);
  
    const fetchChatData = async () => {
      try {
        const roomResponse = await axios.get(`${baseUrl}/chat/${urlRoomName}`, {
          headers: { 'Access_Token': accessToken }
        });
        const roomData = roomResponse.data.data;
        dispatch(setRoomName(roomData.roomName));
        dispatch(setRoomId(passedRoomId || roomData.id));
  
        const messagesResponse = await axios.get(`${baseUrl}/chat/${roomData.roomName}/messages`, {
          headers: { 'Access_Token': accessToken }
        });
        const messages = messagesResponse.data.data || messagesResponse.data;
        dispatch(setMessages(messages));
  
        connectWebSocket(roomData.roomName, account, accessToken);
      } catch (error) {
        console.error("Failed to fetch chat data:", error);
        navigate('/');
      }
    };
    fetchChatData();
  
    return () => {
      if (globalStompClient && globalStompClient.connected) {
        if (subscription) {
          subscription.unsubscribe();
          subscription = null;
        }
        globalStompClient.deactivate();
        globalStompClient = null;
      }
    };
  }, [dispatch, urlRoomName, navigate, location.state, userData, sellerEmail, sellerNickname]);

  const connectWebSocket = (roomName, sender, accessToken) => {
    if (globalStompClient && globalStompClient.connected) {
      if (subscription) subscription.unsubscribe();
    } else {
      const socket = new SockJS(`${baseUrl}/ws`);
      globalStompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: { 'Access_Token': accessToken },
      });

      globalStompClient.onConnect = () => {
        subscription = globalStompClient.subscribe(`/sub/chatroom/${roomName}`, (message) => {
          const msg = JSON.parse(message.body);
          const isDuplicate = messages.some(m => m.timestamp === msg.timestamp && m.sender === msg.sender && m.message === msg.message);
          if (!isDuplicate) {
            dispatch(addMessage(msg));
          }
        });
      };

      globalStompClient.onStompError = (frame) => console.error('WebSocket error:', frame);
      globalStompClient.onDisconnect = () => console.log('WebSocket disconnected');
      globalStompClient.activate();
    }
  };

  const sendMessage = () => {
    if (message.trim() === '' || !globalStompClient || !globalStompClient.connected) return;

    const payload = {
      roomId,
      roomName,
      message,
      sender,
      timestamp: new Date().toISOString(),
    };
    globalStompClient.publish({
      destination: '/pub/chat',
      body: JSON.stringify(payload),
    });
    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollTo(0, messagesEndRef.current.scrollHeight);
  }, [messages]);

  return (
    <div>
      <h2>{receiver || '상대방'}</h2>
      <div>
        {image && title && price && content && (
          <div style={{ borderBottom: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <img src={image} alt={title} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            <h3>{title}</h3>
            <p>{price}원</p>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={`${msg.timestamp}-${msg.sender}-${index}`} style={{ textAlign: msg.sender === sender ? 'right' : 'left', margin: '5px 0' }}>
              <span style={{
                backgroundColor: msg.sender === sender ? '#007bff' : '#e9ecef',
                color: msg.sender === sender ? 'white' : 'black',
                padding: '5px 10px',
                borderRadius: '10px',
                display: 'inline-block',
                maxWidth: '70%',
              }}>
                {msg.sender === sender ? (
                  msg.message // 내가 보낸 메시지: 이메일 생략
                ) : (
                  <>
                    <strong>{msg.sender}:</strong> {msg.message} // 상대방 메시지: 이메일 포함
                  </>
                )}
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
        <button onClick={sendMessage} style={{ padding: '5px 10px', marginLeft: '10px' }}>전송</button>
      </div>
    </div>
  );
}

export default ChatPage;