import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useSelector } from 'react-redux';  // 로그인한 사용자 정보 가져오기

const ChatRoom = ({ roomName }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  
  // Redux에서 로그인한 사용자 이메일 가져오기
  const sender = useSelector(state => state.auth.userEmail);  // 상태에서 이메일을 가져오는 방식

  useEffect(() => {
    const socket = new SockJS('http://192.168.0.71:8081/ws/chat');
    const stomp = Stomp.over(socket);

    stomp.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      stomp.subscribe(`/sub/chatroom/${roomName}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    });

    setStompClient(stomp);

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [roomName]);

  const sendMessage = () => {
    if (message.trim() && stompClient && sender) {
      stompClient.send('/app/chat', {}, JSON.stringify({
        roomId: roomName,
        sender: sender,  // Redux에서 가져온 이메일
        message: message
      }));
      setMessage('');  // 메시지 전송 후 입력 필드 비우기
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender}:</strong> {msg.message}</p>
        ))}
      </div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="메시지를 입력하세요" 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
