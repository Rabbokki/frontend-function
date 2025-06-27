import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { setRoomName, setRoomId, addMessage, setMessages } from '../../components/redux/chatSlice';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8080';

let globalStompClient = null;
let subscription = null;

function ChatPage() {
  const dispatch = useDispatch();
  const { messages, roomId } = useSelector(state => state.chat);
  const { loggedIn } = useSelector(state => state.auth);
  const { roomName: urlRoomName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomName, setSelectedRoomName] = useState(urlRoomName || '');
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const { image, title, price, content, sellerEmail, sellerNickname } = location.state || {};

  const connectWebSocket = useCallback((roomName, sender, accessToken) => {
    if (!roomName) {
      console.error('Room name is undefined, cannot connect WebSocket');
      return;
    }
    if (!accessToken) {
      console.error('Access token is missing, cannot connect WebSocket');
      return;
    }
    console.log('Attempting WebSocket connection for room:', roomName, 'with Access_Token:', accessToken.substring(0, 20) + '...');

    if (globalStompClient && globalStompClient.connected) {
      console.log('Existing WebSocket connection found, checking subscription');
      if (subscription && subscription.destination !== `/sub/chatroom/${roomName}`) {
        console.log('Unsubscribing previous subscription:', subscription.destination);
        subscription.unsubscribe();
        subscription = null;
      }
    }

    if (!globalStompClient || !globalStompClient.connected) {
      const socket = new SockJS(`${baseUrl}/ws`);
      globalStompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: { Access_Token: accessToken },
        debug: str => console.log('STOMP Debug:', str),
      });

      globalStompClient.onConnect = frame => {
        console.log('WebSocket connected:', frame);
        if (!subscription) {
          subscription = globalStompClient.subscribe(`/sub/chatroom/${roomName}`, message => {
            console.log('Received message:', message.body);
            try {
              const msg = JSON.parse(message.body);
              const isDuplicate = messages.some(
                m => m.timestamp === msg.timestamp && m.sender === msg.sender && m.message === msg.message
              );
              if (!isDuplicate) {
                dispatch(addMessage({
                  roomId: msg.roomId,
                  roomName: msg.roomName,
                  message: msg.message,
                  sender: msg.sender,
                  timestamp: msg.timestamp || msg.createAt,
                  createAt: msg.createAt,
                }));
              }
            } catch (e) {
              console.error('Failed to parse message:', e, message.body);
            }
          });
          console.log('Successfully subscribed to:', `/sub/chatroom/${roomName}`);
        }
      };

      globalStompClient.onStompError = frame => {
        console.error('WebSocket error:', frame.headers['message'], frame.body);
        if (frame.headers['message'].includes('Invalid Access_Token')) {
          alert('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
          navigate('/authenticate');
        } else if (frame.headers['message'].includes('Already immutable')) {
          alert('서버에서 메시지 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          alert(`WebSocket 오류: ${frame.headers['message']}`);
        }
      };

      globalStompClient.onDisconnect = () => {
        console.log('WebSocket disconnected');
        subscription = null;
      };

      globalStompClient.onWebSocketClose = event => {
        console.log('WebSocket closed:', event);
      };

      globalStompClient.activate();
    }
  }, [dispatch, messages, navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    let account = localStorage.getItem('userEmail');

    if (!loggedIn || !accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/authenticate');
      return;
    }

    if (!account) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        account = payload.sub;
        localStorage.setItem('userEmail', account);
      } catch (e) {
        console.error('Invalid token:', e);
      }
    }
    setSender(account);

    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${baseUrl}/chat/rooms`, {
          headers: { Access_Token: accessToken },
        });
        const rooms = response.data.content || response.data.data || [];
        setChatRooms(rooms);
        console.log('Raw chat rooms response:', response.data);
      } catch (error) {
        console.error('Failed to fetch chat rooms:', error.response?.data, error.message);
        setChatRooms([]);
        alert('채팅방 목록을 불러오지 못했습니다.');
      }
    };
    fetchChatRooms();
  }, [navigate, loggedIn, dispatch]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!selectedRoomName || !accessToken || !sender) {
      console.log('Missing selectedRoomName, accessToken, or sender:', { selectedRoomName, accessToken, sender });
      return;
    }

    setReceiver(sellerNickname || sellerEmail);

    const fetchChatData = async () => {
      try {
        console.log('Fetching chat data for room:', selectedRoomName);
        const roomResponse = await axios.get(`${baseUrl}/chat/${selectedRoomName}`, {
          headers: { Access_Token: accessToken },
        });
        const roomData = roomResponse.data.data;
        console.log('Fetched room data:', roomData);
        if (!roomData || !roomData.roomName) {
          console.error('Invalid room data:', roomData);
          alert('채팅방 정보를 불러오지 못했습니다.');
          return;
        }
        dispatch(setRoomName(roomData.roomName));
        dispatch(setRoomId(roomData.roomId || roomData.id));

        const messagesResponse = await axios.get(`${baseUrl}/chat/${selectedRoomName}/messages`, {
          headers: { Access_Token: accessToken },
        });
        const messages = messagesResponse.data.data || [];
        dispatch(setMessages(messages));

        connectWebSocket(roomData.roomName, sender, accessToken);
      } catch (error) {
        console.error('Failed to fetch chat data:', error.response?.data, error.message);
        alert('채팅 데이터를 불러오지 못했습니다.');
      }
    };
    fetchChatData();

    return () => {
      if (globalStompClient && globalStompClient.connected && subscription) {
        console.log('Cleaning up: Unsubscribing from', subscription.destination);
        subscription.unsubscribe();
        subscription = null;
        globalStompClient.deactivate();
        globalStompClient = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [dispatch, selectedRoomName, navigate, sellerEmail, sellerNickname, sender, connectWebSocket]);

  const sendMessage = () => {
    if (message.trim() === '') {
      console.log('Empty message, not sending');
      return;
    }
    if (!selectedRoomName) {
      console.error('selectedRoomName is undefined, cannot send message');
      alert('채팅방을 선택해주세요.');
      return;
    }
    if (!globalStompClient || !globalStompClient.connected) {
      console.error('WebSocket not connected, attempting to reconnect');
      alert('WebSocket 연결이 끊어졌습니다. 재연결을 시도합니다.');
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket(selectedRoomName, sender, localStorage.getItem('accessToken'));
      }, 1000);
      return;
    }

    const payload = {
      roomId: roomId,
      roomName: selectedRoomName,
      message: message,
      sender: sender,
      timestamp: new Date().toISOString(),
    };
    console.log('Sending message:', payload);
    globalStompClient.publish({
      destination: '/pub/chat',
      body: JSON.stringify(payload),
      headers: { Access_Token: localStorage.getItem('accessToken') },
    });
    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollTo(0, messagesEndRef.current.scrollHeight);
  }, [messages]);

  const handleRoomClick = roomName => {
    const room = chatRooms.find(r => r.roomName === roomName);
    if (!room) {
      console.error('Room not found:', roomName);
      return;
    }
    setSelectedRoomName(roomName);
    const opponent = room.sender === sender ? room.receiver : room.sender;
    navigate(`/chat/${roomName}`, {
      state: {
        postId: room.postId,
        sellerEmail: opponent,
        sellerNickname: room.userData?.nickname || opponent,
        image,
        title,
        price,
        content,
      },
    });
  };

  const getOpponentNickname = room => {
    const opponent = room.sender === sender ? room.receiver : room.sender;
    return room.userData?.nickname || opponent || 'Unknown';
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
        <h2>전체 대화</h2>
        {chatRooms.length === 0 ? (
          <p>참여 중인 채팅방이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {chatRooms.map(room => (
              <li
                key={room.id || room.roomName}
                onClick={() => handleRoomClick(room.roomName)}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  backgroundColor: selectedRoomName === room.roomName ? '#e9ecef' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img
                  src={room.userData?.imgUrl || 'https://via.placeholder.com/30'}
                  alt={`${getOpponentNickname(room)} 프로필`}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    marginRight: '10px',
                    objectFit: 'cover',
                  }}
                />
                <span>
                  {getOpponentNickname(room)} {room.postId ? `(Post #${room.postId})` : ''} (
                  {room.latestChatMessage || '없음'})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ width: '70%', padding: '10px' }}>
        {selectedRoomName ? (
          <>
            <h2>{receiver || '상대방'}</h2>
            {image && title && price && (
              <div style={{ borderBottom: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <img src={image} alt={title} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                <h3>{title}</h3>
                <p>{price}원</p>
              </div>
            )}
            <div
              ref={messagesEndRef}
              style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}
            >
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={`${msg.timestamp}-${msg.sender}-${index}`}
                    style={{ textAlign: msg.sender === sender ? 'right' : 'left', margin: '5px 0' }}
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
                      {msg.sender === sender ? msg.message : <><strong>{msg.sender}:</strong> {msg.message}</>}
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
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                style={{ width: '80%', padding: '5px' }}
              />
              <button onClick={sendMessage} style={{ padding: '5px 10px', marginLeft: '10px' }}>
                전송
              </button>
            </div>
          </>
        ) : (
          <p>채팅방을 선택하세요.</p>
        )}
      </div>
    </div>
  );
}

export default ChatPage;