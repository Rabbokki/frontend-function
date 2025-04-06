// import React, { useEffect, useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { setRoomName, setRoomId, addMessage, setMessages } from '../../components/redux/chatSlice';
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import axios from 'axios';

// const baseUrl = process.env.REACT_APP_BASE_URL;

// let globalStompClient = null;
// let subscription = null;

// function ChatPage() {
//   const dispatch = useDispatch();
//   const { messages, roomName, roomId } = useSelector(state => state.chat);
//   const { userData } = useSelector(state => state.user);
//   const { roomName: urlRoomName } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [message, setMessage] = useState('');
//   const [sender, setSender] = useState(null);
//   const [receiver, setReceiver] = useState(null);
//   const messagesEndRef = useRef(null);

//   const { image, title, price, content, sellerEmail, sellerNickname } = location.state || {};

//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     let account = userData?.email || localStorage.getItem('userEmail');
//     const passedRoomId = location.state?.roomId;
  
//     if (!urlRoomName || !accessToken) {
//       alert(!urlRoomName ? '채팅방 이름이 누락되었습니다.' : '로그인이 필요합니다.');
//       navigate(!urlRoomName ? '/' : '/authenticate');
//       return;
//     }
  
//     if (!account) {
//       const payload = JSON.parse(atob(accessToken.split('.')[1]));
//       account = payload.sub;
//       localStorage.setItem('userEmail', account);
//     }
//     setSender(account);
//     setReceiver(sellerNickname || sellerEmail);
//     console.log('location.state:', location.state);
//     console.log('sender:', account);
//     console.log('sellerNickname:', sellerNickname);
//     console.log('receiver:', sellerNickname || sellerEmail);
  
//     const fetchChatData = async () => {
//       try {
//         const roomResponse = await axios.get(`${baseUrl}/chat/${urlRoomName}`, {
//           headers: { 'Access_Token': accessToken }
//         });
//         const roomData = roomResponse.data.data;
//         dispatch(setRoomName(roomData.roomName));
//         dispatch(setRoomId(passedRoomId || roomData.id));
  
//         const messagesResponse = await axios.get(`${baseUrl}/chat/${roomData.roomName}/messages`, {
//           headers: { 'Access_Token': accessToken }
//         });
//         const messages = messagesResponse.data.data || messagesResponse.data;
//         dispatch(setMessages(messages));
  
//         connectWebSocket(roomData.roomName, account, accessToken);
//       } catch (error) {
//         console.error("Failed to fetch chat data:", error);
//         navigate('/');
//       }
//     };
//     fetchChatData();
  
//     return () => {
//       if (globalStompClient && globalStompClient.connected) {
//         if (subscription) {
//           subscription.unsubscribe();
//           subscription = null;
//         }
//         globalStompClient.deactivate();
//         globalStompClient = null;
//       }
//     };
//   }, [dispatch, urlRoomName, navigate, location.state, userData, sellerEmail, sellerNickname]);

//   const connectWebSocket = (roomName, sender, accessToken) => {
//     if (globalStompClient && globalStompClient.connected) {
//       if (subscription) subscription.unsubscribe();
//     } else {
//       const socket = new SockJS(`${baseUrl}/ws`);
//       globalStompClient = new Client({
//         webSocketFactory: () => socket,
//         reconnectDelay: 5000,
//         connectHeaders: { 'Access_Token': accessToken },
//       });

//       globalStompClient.onConnect = () => {
//         subscription = globalStompClient.subscribe(`/sub/chatroom/${roomName}`, (message) => {
//           const msg = JSON.parse(message.body);
//           const isDuplicate = messages.some(m => m.timestamp === msg.timestamp && m.sender === msg.sender && m.message === msg.message);
//           if (!isDuplicate) {
//             dispatch(addMessage(msg));
//           }
//         });
//       };

//       globalStompClient.onStompError = (frame) => console.error('WebSocket error:', frame);
//       globalStompClient.onDisconnect = () => console.log('WebSocket disconnected');
//       globalStompClient.activate();
//     }
//   };

//   const sendMessage = () => {
//     if (message.trim() === '' || !globalStompClient || !globalStompClient.connected) return;

//     const payload = {
//       roomId,
//       roomName,
//       message,
//       sender,
//       timestamp: new Date().toISOString(),
//     };
//     globalStompClient.publish({
//       destination: '/pub/chat',
//       body: JSON.stringify(payload),
//     });
//     setMessage('');
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollTo(0, messagesEndRef.current.scrollHeight);
//   }, [messages]);

//   return (
//     <div>
//       <h2>{receiver || '상대방'}</h2>
//       <div>
//         {image && title && price && content && (
//           <div style={{ borderBottom: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//             <img src={image} alt={title} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
//             <h3>{title}</h3>
//             <p>{price}원</p>
//           </div>
//         )}
//       </div>
//       <div ref={messagesEndRef} style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
//         {messages.length > 0 ? (
//           messages.map((msg, index) => (
//             <div key={`${msg.timestamp}-${msg.sender}-${index}`} style={{ textAlign: msg.sender === sender ? 'right' : 'left', margin: '5px 0' }}>
//               <span style={{
//                 backgroundColor: msg.sender === sender ? '#007bff' : '#e9ecef',
//                 color: msg.sender === sender ? 'white' : 'black',
//                 padding: '5px 10px',
//                 borderRadius: '10px',
//                 display: 'inline-block',
//                 maxWidth: '70%',
//               }}>
//                 {msg.sender === sender ? (
//                   msg.message // 내가 보낸 메시지: 이메일 생략
//                 ) : (
//                   <>
//                     <strong>{msg.sender}:</strong> {msg.message} // 상대방 메시지: 이메일 포함
//                   </>
//                 )}
//               </span>
//             </div>
//           ))
//         ) : (
//           <p>아직 메시지가 없습니다.</p>
//         )}
//       </div>
//       <div style={{ marginTop: '10px' }}>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//           style={{ width: '80%', padding: '5px' }}
//         />
//         <button onClick={sendMessage} style={{ padding: '5px 10px', marginLeft: '10px' }}>전송</button>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;

// 이게 원래꺼
// import React, { useEffect, useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { setRoomName, setRoomId, addMessage, setMessages } from '../../components/redux/chatSlice';
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import axios from 'axios';

// const baseUrl = process.env.REACT_APP_BASE_URL;

// let globalStompClient = null;
// let subscription = null;

// function ChatPage() {
//   const dispatch = useDispatch();
//   const { messages, roomName, roomId } = useSelector(state => state.chat);
//   const { userData } = useSelector(state => state.user);
//   const { roomName: urlRoomName } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [message, setMessage] = useState('');
//   const [sender, setSender] = useState(null);
//   const [receiver, setReceiver] = useState(null);
//   const [chatRooms, setChatRooms] = useState([]);
//   const [selectedRoomName, setSelectedRoomName] = useState(urlRoomName);
//   const messagesEndRef = useRef(null);

//   const { image, title, price, content, sellerEmail, sellerNickname } = location.state || {};

//   // 채팅방 목록 가져오기
//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     const account = userData?.email || localStorage.getItem('userEmail');

//     if (!accessToken) {
//       alert('로그인이 필요합니다.');
//       navigate('/authenticate');
//       return;
//     }

//     if (!account) {
//       const payload = JSON.parse(atob(accessToken.split('.')[1]));
//       localStorage.setItem('userEmail', payload.sub);
//     }
//     setSender(account);

//     const fetchChatRooms = async () => {
//       console.log('Fetching chat rooms with token:', accessToken);
//       console.log('Current user email:', account);
//       try {
//           const response = await axios.get(`${baseUrl}/chat/rooms`, {
//               headers: { 'Access_Token': accessToken },
//           });
//           console.log('Chat rooms full response:', response.data);
//           const rooms = response.data.content || response.data.data || [];
//           setChatRooms(rooms);
//           console.log('Chat room details:', rooms.map(room => ({
//               id: room.id,
//               roomName: room.roomName,
//               sender: room.sender,
//               receiver: room.receiver,
//               postId: room.postId || 'N/A',
//               nickname: room.userResponseDto?.data?.nickname || 'Unknown',
//           })));
//           console.log('Contains 10_admin@gmail.com:', rooms.some(room => room.roomName === '10_admin@gmail.com'));
//       } catch (error) {
//           console.error('Failed to fetch chat rooms:', error);
//           setChatRooms([]);
//           alert('채팅방 목록을 불러오지 못했습니다.');
//       }
//   };
//     fetchChatRooms();
//   }, [navigate, userData]);

//   // 선택된 채팅방 데이터 가져오기 및 WebSocket 연결
//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     if (!selectedRoomName || !accessToken) return;

//     setReceiver(sellerNickname || sellerEmail);

//     const fetchChatData = async () => {
//       try {
//         const roomResponse = await axios.get(`${baseUrl}/chat/${selectedRoomName}`, {
//           headers: { 'Access_Token': accessToken },
//         });
//         const roomData = roomResponse.data.data;
//         dispatch(setRoomName(roomData.roomName));
//         dispatch(setRoomId(roomData.id));

//         const messagesResponse = await axios.get(`${baseUrl}/chat/${roomData.roomName}/messages`, {
//           headers: { 'Access_Token': accessToken },
//         });
//         const messages = messagesResponse.data.data || messagesResponse.data;
//         dispatch(setMessages(messages));

//         connectWebSocket(roomData.roomName, sender, accessToken);
//       } catch (error) {
//         console.error('Failed to fetch chat data:', error);
//       }
//     };
//     fetchChatData();

//     return () => {
//       if (globalStompClient && globalStompClient.connected) {
//         if (subscription) {
//           subscription.unsubscribe();
//           subscription = null;
//         }
//         globalStompClient.deactivate();
//         globalStompClient = null;
//       }
//     };
//   }, [dispatch, selectedRoomName, navigate, sellerEmail, sellerNickname]);

//   const connectWebSocket = (roomName, sender, accessToken) => {
//     if (globalStompClient && globalStompClient.connected) {
//       if (subscription) subscription.unsubscribe();
//     } else {
//       const socket = new SockJS(`${baseUrl}/ws`);
//       globalStompClient = new Client({
//         webSocketFactory: () => socket,
//         reconnectDelay: 5000,
//         connectHeaders: { 'Access_Token': accessToken },
//       });

//       globalStompClient.onConnect = () => {
//         subscription = globalStompClient.subscribe(`/sub/chatroom/${roomName}`, (message) => {
//           const msg = JSON.parse(message.body);
//           const isDuplicate = messages.some(
//             m => m.timestamp === msg.timestamp && m.sender === msg.sender && m.message === msg.message
//           );
//           if (!isDuplicate) {
//             dispatch(addMessage(msg));
//           }
//         });
//       };

//       globalStompClient.onStompError = frame => console.error('WebSocket error:', frame);
//       globalStompClient.onDisconnect = () => console.log('WebSocket disconnected');
//       globalStompClient.activate();
//     }
//   };

//   const sendMessage = () => {
//     if (message.trim() === '' || !globalStompClient || !globalStompClient.connected) return;

//     const payload = {
//       roomId,
//       roomName: selectedRoomName,
//       message,
//       sender,
//       timestamp: new Date().toISOString(),
//     };
//     globalStompClient.publish({
//       destination: '/pub/chat',
//       body: JSON.stringify(payload),
//     });
//     setMessage('');
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollTo(0, messagesEndRef.current.scrollHeight);
//   }, [messages]);

//   const handleRoomClick = roomName => {
//     setSelectedRoomName(roomName);
//     const room = chatRooms.find(r => r.roomName === roomName);
//     navigate(`/chat/${roomName}`, { state: { postId: room.postId, sellerEmail: room.userResponseDto.data.email } });
// };
//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       {/* 왼쪽: 채팅방 목록 */}
//       <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
//         <h2>전체 대화</h2>
//         {chatRooms.length === 0 ? (
//           <p>참여 중인 채팅방이 없습니다.</p>
//         ) : (
//           <ul style={{ listStyle: 'none', padding: 0 }}>
//             {chatRooms.map(room => (
//               <li
//               key={room.id || room.roomName}
//               onClick={() => handleRoomClick(room.roomName)}
//               style={{
//                   padding: '10px',
//                   cursor: 'pointer',
//                   backgroundColor: selectedRoomName === room.roomName ? '#e9ecef' : 'transparent',
//               }}
//           >
//               Post #{room.postId || 'N/A'} - {room.userResponseDto?.data?.nickname || room.receiver || 'Unknown'} ({room.latestChatMessage || '없음'})
//           </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* 오른쪽: 선택된 채팅창 */}
//       <div style={{ width: '70%', padding: '10px' }}>
//         {selectedRoomName ? (
//           <>
//             <h2>{receiver || '상대방'}</h2>
//             {image && title && price && (
//               <div style={{ borderBottom: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//                 <img src={image} alt={title} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
//                 <h3>{title}</h3>
//                 <p>{price}원</p>
//               </div>
//             )}
//             <div
//               ref={messagesEndRef}
//               style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}
//             >
//               {messages.length > 0 ? (
//                 messages.map((msg, index) => (
//                   <div
//                     key={`${msg.timestamp}-${msg.sender}-${index}`}
//                     style={{ textAlign: msg.sender === sender ? 'right' : 'left', margin: '5px 0' }}
//                   >
//                     <span
//                       style={{
//                         backgroundColor: msg.sender === sender ? '#007bff' : '#e9ecef',
//                         color: msg.sender === sender ? 'white' : 'black',
//                         padding: '5px 10px',
//                         borderRadius: '10px',
//                         display: 'inline-block',
//                         maxWidth: '70%',
//                       }}
//                     >
//                       {msg.sender === sender ? msg.message : <><strong>{msg.sender}:</strong> {msg.message}</>}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <p>아직 메시지가 없습니다.</p>
//               )}
//             </div>
//             <div style={{ marginTop: '10px' }}>
//               <input
//                 type="text"
//                 value={message}
//                 onChange={e => setMessage(e.target.value)}
//                 onKeyPress={e => e.key === 'Enter' && sendMessage()}
//                 style={{ width: '80%', padding: '5px' }}
//               />
//               <button onClick={sendMessage} style={{ padding: '5px 10px', marginLeft: '10px' }}>
//                 전송
//               </button>
//             </div>
//           </>
//         ) : (
//           <p>채팅방을 선택하세요.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ChatPage;

import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const { messages, roomId } = useSelector(state => state.chat);
  const { loggedIn, user } = useSelector(state => state.auth);
  const { roomName: urlRoomName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomName, setSelectedRoomName] = useState(urlRoomName);
  const messagesEndRef = useRef(null);

  const { image, title, price, content, sellerEmail, sellerNickname } = location.state || {};

  const connectWebSocket = useCallback((roomName, sender, accessToken) => {
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
          const isDuplicate = messages.some(
            m => m.timestamp === msg.timestamp && m.sender === msg.sender && m.message === msg.message
          );
          if (!isDuplicate) {
            dispatch(addMessage(msg));
          }
        });
      };

      globalStompClient.onStompError = frame => console.error('WebSocket error:', frame);
      globalStompClient.onDisconnect = () => console.log('WebSocket disconnected');
      globalStompClient.activate();
    }
  }, [dispatch, messages]);

  // 채팅방 목록 가져오기
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    let account = user?.email || localStorage.getItem('userEmail');

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
          headers: { 'Access_Token': accessToken },
        });
        const rooms = response.data.content || response.data.data || [];
        setChatRooms(rooms);
        console.log('Raw chat rooms response:', response.data);
      } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
        setChatRooms([]);
        alert('채팅방 목록을 불러오지 못했습니다.');
      }
    };
    fetchChatRooms();
  }, [navigate, user, loggedIn, dispatch]);

  // 선택된 채팅방 데이터 가져오기 및 WebSocket 연결
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!selectedRoomName || !accessToken || !sender) return;

    setReceiver(sellerNickname || sellerEmail);

    const fetchChatData = async () => {
      try {
        const roomResponse = await axios.get(`${baseUrl}/chat/${selectedRoomName}`, {
          headers: { 'Access_Token': accessToken },
        });
        const roomData = roomResponse.data.data;
        dispatch(setRoomName(roomData.roomName));
        dispatch(setRoomId(roomData.id));

        const messagesResponse = await axios.get(`${baseUrl}/chat/${roomData.roomName}/messages`, {
          headers: { 'Access_Token': accessToken },
        });
        const messages = messagesResponse.data.data || messagesResponse.data;
        dispatch(setMessages(messages));

        connectWebSocket(roomData.roomName, sender, accessToken);
      } catch (error) {
        console.error('Failed to fetch chat data:', error);
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
  }, [dispatch, selectedRoomName, navigate, sellerEmail, sellerNickname, sender, connectWebSocket]);

  const sendMessage = () => {
    if (message.trim() === '' || !globalStompClient || !globalStompClient.connected) return;

    const payload = {
      roomId,
      roomName: selectedRoomName,
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
  }, [messages,connectWebSocket]);

  const handleRoomClick = roomName => {
    const room = chatRooms.find(r => r.roomName === roomName);
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

  const getOpponentNickname = (room) => {
    const opponent = room.sender === sender ? room.receiver : room.sender;
    return room.userData?.nickname || opponent || 'Unknown';
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 왼쪽: 채팅방 목록 */}
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
                  display: 'flex', // 이미지와 텍스트를 수평 배치
                  alignItems: 'center', // 수직 중앙 정렬
                }}
              >
                {/* 프로필 이미지 */}
                <img
                  src={room.userData?.imgUrl || 'https://via.placeholder.com/30'} // 기본 이미지 설정
                  alt={`${getOpponentNickname(room)} 프로필`}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%', // 원형 이미지
                    marginRight: '10px', // 닉네임과의 간격
                    objectFit: 'cover',
                  }}
                />
                {/* 닉네임 및 정보 */}
                <span>
                  {getOpponentNickname(room)} {room.postId ? `(Post #${room.postId})` : ''} (
                  {room.latestChatMessage || '없음'})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
  
      {/* 오른쪽: 선택된 채팅창 */}
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