import React from "react";
import { View, Text } from "react-native";

export const MessageWindow = ({ value, sender, loggedUser }) => {
  const isSentByLoggedUser = sender === loggedUser;

  return (
    <View>
      <Text>{value}</Text>
    </View>
  );
};

export default MessageWindow;
