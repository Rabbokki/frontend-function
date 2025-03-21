import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRoom, addMessage, setSender, setConnectionStatus } from './chatSlice';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';

const baseUrl = 'http://192.168.0.71:8081';

function ChatPage(){
    const dispatch = useDispatch();
    const { messages, roodId, roomName, sender, isConnected } = useSelector(state => state.chat);

    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    
    useEffect(() => {
        const account = prompt("사용자 이메일")
    })
}