import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const MessageWindow = ({ value, sender, loggedUser }) => {
  const isSentByLoggedUser = sender === loggedUser;

  return (
    <View
      style={[
        styles.messageContainer,
        isSentByLoggedUser ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={isSentByLoggedUser ? styles.sentText : styles.receivedText}>
        {value}
      </Text>
    </View>
  );
};

export default MessageWindow;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
  },

  sentMessage: {
    alignSelf: "flex-end", 
    backgroundColor: "#DCF8C6", 
  },

  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA", 
  },

  sentText: {
    color: "#000", 
  },

  receivedText: {
    color: "#000", 
  },
});
