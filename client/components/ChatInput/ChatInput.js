import { Button, Input } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

const ChatInput = ({ message, setMessage, labelText, sendMessage }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
      <Input
        containerStyle={{ flex: 1 }} // Makes the input field take up available space
        disabledInputStyle={{ backgroundColor: "#ddd" }}
        label={labelText}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter Message"
      />
      <Button
        title="💅"
        onPress={sendMessage}
        buttonStyle={{ minWidth: 50, paddingHorizontal: 10 }} // Adjust button size
      />
    </View>
  );
};

export default ChatInput;
