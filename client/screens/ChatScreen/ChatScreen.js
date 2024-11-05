import React, { useState, useEffect } from "react";
import { Header, Avatar, Text } from "@rneui/themed";
import { chatWithUser } from "../HomePageScreen/HomePageScreen";
import { loggedUser } from "../SignInScreen/SignInScreen";
import { ScrollView, View } from "react-native";
import ChatInput from "../../components/ChatInput";
import MessageWindow from "../../components/MessageWindow";
import { ngrokServer } from "../../config";
import { Audio } from "expo-av";
import { Pressable } from "react-native";

const ChatScreen = () => {
  const [contactProfile, setContactProfile] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatsSent, setChatsSent] = useState(0);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Track audio playing state

  // Play the audio message
  const playSound = async (text) => {
    try {
      const response = await fetch(`${ngrokServer}/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to convert text to speech:', data.error);
        return;
      }
  
      if (sound) {
        await sound.unloadAsync();
      }
  
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('/home/davidjijo/dev-tutorials/echoes/client/screens/ChatScreen/tts.mp3')         
      );        
      setSound(newSound);
      setIsPlaying(true);

      await newSound.playAsync();
      // newSound.setOnPlaybackStatusUpdate((status) => {
      //   console.log(status)
      //   if (status.didJustFinish && !status.isLooping) {
      //     setIsPlaying(false);
      //   }
      // });
      setIsPlaying(false);      
      
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
    }
  };

  // Fetch the profile picture of the user
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
  }, [loggedUser]); 

  // Fetch the conversation messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = { sender: loggedUser, receiver: chatWithUser };
        const response = await fetch(`${ngrokServer}/view-messages-in-chat`, {
          method: "POST",
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const messageData = await response.json();
        setMessages(messageData);
      } catch (error) {
        console.error('Error fetching conversation', error);
      }
    };

    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = (event) => {
    const data = { sender: loggedUser, receiver: chatWithUser, message: message };
    setMessage('');
    fetch(`${ngrokServer}/send-message`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setChatsSent(chatsSent + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        barStyle="default"
        centerComponent={{
          text: `${chatWithUser}`,
          style: { color: "#fff" },
        }}
        leftComponent={
          <Avatar rounded source={{ uri: contactProfile }} style={{ width: 30, height: 30 }} />
        }
        placement="center"
      />

      {isPlaying && (
        <View style={{
          backgroundColor: 'rgba(0, 150, 255, 0.8)',
          padding: 10,
          borderRadius: 5,
          marginHorizontal: 20,
          marginTop: 10,
          alignItems: 'center'
        }}>
          <Text style={{ color: 'white', fontSize: 16 }}>🎶 Audio is playing...</Text>
        </View>
      )}

      <ScrollView style={{ flex: 1 }}>
        {messages.map((msg, index) => (
          <Pressable key={index} onPress={() => playSound(msg.message)}>
            <MessageWindow value={msg.message} sender={msg.sender} loggedUser={loggedUser} />
          </Pressable>
        ))}
      </ScrollView>

      <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </View>
  );
};

export default ChatScreen;
