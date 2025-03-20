import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { io } from 'socket.io-client';

const chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const handleJoinRoom = async () => {
    if (!name || !room) {
      alert('Please enter both name and room.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.103:5000/join-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room, name }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        const newSocket = io('http://192.168.0.103:5000', {
          transports: ['websocket'],
          withCredentials: true,
        });

        setSocket(newSocket);
        setJoined(true);

        newSocket.on('connect', () => {
          console.log('Socket connected');
        });

        newSocket.on('message', (data) => {
          console.log('Message received:', data);
          const newMsg = {
            _id: new Date().getTime() + Math.random(),
            text: data.message,
            createdAt: new Date(),
            user: { _id: data.name === name ? 1 : 2, name: data.name },
          };
          setMessages((previous) => GiftedChat.append(previous, [newMsg]));
        });

        newSocket.on('disconnect', () => {
          console.log('Socket disconnected');
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error joining room');
    }
  };

  const onSend = useCallback(
    (msgs = []) => {
      if (socket) {
        const text = msgs[0].text;
        socket.emit('message', { message: text });
        const myMsg = {
          _id: new Date().getTime(),
          text,
          createdAt: new Date(),
          user: { _id: 1, name: name },
        };
        setMessages((previous) => GiftedChat.append(previous, [myMsg]));
      }
    },
    [socket]
  );

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <View>
      {!joined ? (
        <View className="flex-1 justify-center p-5">
          <Text className="text-2xl mb-5 text-center">Join Chat Room</Text>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            className="border border-gray-400 rounded-md my-2 p-2"
          />
          <TextInput
            placeholder="Enter room code"
            value={room}
            onChangeText={setRoom}
            className="border border-gray-400 rounded-md my-2 p-2"
          />
          <Button title="Join Room" onPress={handleJoinRoom} />
        </View>
      ) : (
        <GiftedChat
          messages={messages}
          onSend={(msgs) => onSend(msgs)}
          user={{ _id: 1, name: name }}
        />
      )}
    </View>
  );
}

export default chat;
