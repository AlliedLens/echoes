import React, { useState, useEffect } from "react";
import { Header, Avatar, Text } from "@rneui/themed";
import { chatWithUser } from "../HomePageScreen/HomePageScreen";
import { loggedUser } from "../SignInScreen/SignInScreen";
import { View } from "react-native";
import ChatInput from "../../components/ChatInput";
import MessageWindow from "../../components/MessageWindow";
import { ngrokServer } from "../../config";

const ChatScreen = () => {
  const [contactProfile, setContactProfile] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatsSent, setChatsSent] = useState(0);

  //used to get the profile picture of the user
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = { user: chatWithUser };
        const response = await fetch(`${ngrokServer}/view-by-username`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const profileData = await response.json();
        setContactProfile(profileData.profilePhotoPath);

      } catch (error) {
        console.error('Error fetching username', error);
      }
      fetchMessages();
      const interval = setInterval(()=>{
        fetchMessages();
      }, 100);

      return () => clearInterval(interval);

    fetchUserProfile();
  }, [loggedUser]);

  //used to get the conversation
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = { sender: loggedUser, receiver: chatWithUser };
        const response = await fetch(`${ngrokServer}/view-messages-in-chat`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const messageData = await response.json();
        setMessages(messageData);
      } catch (error) {
        console.error('error fetching conversation', error);
      }
    };
    fetchMessages();
  }, [chatsSent]);

  const sendMessage = () => {
    const data = { sender: loggedUser, receiver: chatWithUser, message: message };
    setMessage('');
    fetch(`${ngrokServer}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    setChatsSent(chatsSent + 1);
  };

  return (
    <View>
      <Header
        barStyle="default"
        centerComponent={{
          text: `${chatWithUser}`
        }}
        leftComponent={
          <Avatar rounded source={{ uri: contactProfile }} />
        }
        placement="center"
      />

      {messages.map((msg, index) => (
        <MessageWindow key={index} value={msg.message} sender={msg.sender} loggedUser={loggedUser} />
      ))}

      <ChatInput message={message} setMessage={setMessage} labelText={`${loggedUser} has to send a message...`} sendMessage={sendMessage} />
    </View>
  );
};

export default ChatScreen;
