import React, { useState, useEffect } from "react";
import { Header, Avatar } from "@rneui/themed";
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

  // Fetch the user's profile picture
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
    };

    fetchUserProfile();
  }, []);

  // Fetch messages
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
        console.error('Error fetching conversation', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000); 

    return () => clearInterval(interval); 
  }, [chatsSent]);

  // Function to send a message
  const sendMessage = async () => {
    const data = { sender: loggedUser, receiver: chatWithUser, message };
    setMessage('');
    
    try {
      await fetch(`${ngrokServer}/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      setChatsSent(prev => prev + 1); // Update chatsSent
    } catch (error) {
      console.error('Error sending message', error);
    }
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

      <ChatInput 
        message={message} 
        setMessage={setMessage} 
        labelText={`${loggedUser} has to send a message...`} 
        sendMessage={sendMessage} 
      />
    </View>
  );
};

export default ChatScreen;
