import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setRoom, addMessage, setSender, setConnectionStatus } from './chatSlice';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { fetchUserData } from '../../components/reducers/user/userThunk';

const baseUrl = process.env.REACT_APP_BASE_URL;

function ChatPage() {
  const dispatch = useDispatch();
  const { messages, roodId, roomName, sender, isConnected } = useSelector(state => state.chat);
  
  const { roomName: urlRoomName } = useParams();
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  
  useEffect(() => {
    const account = prompt("사용자 이메일을 입력하세요.");
    const accessToken = localStorage.getItem("accessToken");

    if (!account) return;
    dispatch(setSender(account));  // 이메일을 설정

    const fetchData = async () => {
      if (accessToken) {
        console.log("Fetching user data with token:", accessToken);
        await dispatch(fetchUserData(accessToken));
      } else {
        console.log("No access token found");
      }

      try {
        // 방 정보 가져오기 (서버에서 채팅방 정보 가져오기)
        const response = await axios.get(`${baseUrl}/chat/${urlRoomName}`);
        const data = response.data.data;
        
        dispatch(setRoom({ roodId: data.id, roomName: data.roomName }));
        connectWebSocket(data.roomName, account);  // WebSocket 연결
      } catch (error) {
        alert("채팅방 정보를 가져올 수 없습니다.");
      }
    };

    fetchData();

    return () => {
      if (stompClient) {
        stompClient.disconnect();  // 컴포넌트 언마운트 시 WebSocket 연결 종료
      }
    };
  }, [dispatch, urlRoomName, stompClient]);

  // WebSocket 연결 및 구독 함수
  const connectWebSocket = (roomName, sender) => {
    const socket = new SockJS(`${baseUrl}/ws`);
    const stomp = Stomp.over(socket);
    stomp.connect({}, () => {
      dispatch(setConnectionStatus(true));  // 연결 상태 변경
      stomp.subscribe(`/sub/chatroom${roomName}`, (message) => {
        const msg = JSON.parse(message.body);
        dispatch(addMessage(msg));  // 받은 메시지 Redux 상태에 추가
      });
    });
    setStompClient(stomp);
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (message.trim() === '' || !stompClient) return;
    stompClient.send(
      '/pub/chat',
      {},
      JSON.stringify({
        roodId,
        message,
        sender,
      })
    );
    setMessage('');  // 메시지 전송 후 입력창 비우기
  };

  return (
    <div>
      <h2>채팅방: {roomName}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

export default ChatPage;
