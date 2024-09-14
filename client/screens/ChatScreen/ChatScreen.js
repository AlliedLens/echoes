import React, { useState } from "react";
import { Header, Avatar, Text } from "@rneui/themed";
import { chatWithUser } from "../HomePageScreen/HomePageScreen";
import { loggedUser } from "../SignInScreen/SignInScreen";
import { View } from "react-native";
import { useEffect } from "react";
import ChatInput from "../../components/ChatInput";
import MessageWindow from "../../components/MessageWindow";

const ChatScreen = () => {

    const [contactProfile, setContactProfile] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatsSent, setChatsSent] = useState(0);


    //used to get the profile picture of the user
    useEffect(() => {
        const fetchContacts = async () => {        
          try {
            const response = await fetch(`http://0.0.0.0:5000/view-by-username/${chatWithUser}`, {
              method: 'GET',
              headers: {
                'Content-type': 'application/json',
              }
            })
            const profileData = await response.json()
            setContactProfile(profileData.profilePhotoPath);
          } catch(error)  { 
            console.error("error fetching username", error);
          }
        }
        fetchContacts();


    }, []);


    //used to get the conversation
    useEffect(() =>{
      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://0.0.0.0:5000/view-messages-in-chat/${chatWithUser}/${loggedUser}`, {
            method: "GET",
            headers: {
              'Content-type' : 'application/json'
            }
          })
          const messageData = await response.json()
          setMessages(messageData)
        } catch(error){
          console.error('error fetching conversation', error);
        }
      }
      fetchMessages();
    }, [chatsSent])



    const sendMessage = (event) => {
      if (event.key == "Enter"){
        const data = {sender: loggedUser, receiver: chatWithUser, message: message};
        setMessage('');
        fetch("http://0.0.0.0:5000/send-message", {
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify(data)
        })

        setChatsSent(chatsSent+1);
      }
    }

    return (
        <View>

            <Header
                barStyle="default"
                centerComponent={{
                text: `${chatWithUser}`,
                style: { color: "#fff" }
                }}
                leftComponent={
                    <Avatar rounded source={{uri:contactProfile}} style={{width:30, height:30}}/>
                }
                placement="center"
            /> 

            {messages.map((msg, index) => (
              <MessageWindow key={index} value={msg.message} sender={msg.sender} loggedUser={loggedUser}/>
            ))}


            
            <ChatInput message={message} setMessage={setMessage} labelText={`${loggedUser} has to send a message...`} sendMessage={sendMessage}/>

        </View>    
    )        
}

export default ChatScreen;