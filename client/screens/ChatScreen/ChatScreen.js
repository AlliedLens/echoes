import { Text } from "@rneui/themed";
import React from "react";
import { View } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { chatWithUser } from "../HomePageScreen/HomePageScreen";
import { loggedUser } from "../SignInScreen/SignInScreen";

const ChatScreen = () =>{
    return (
        <Text>
            {chatWithUser} and {loggedUser} 
        </Text>
    )
}

export default ChatScreen;
