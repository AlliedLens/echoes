import { Button, Text } from "@rneui/themed";
import { Input } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-web";

const ChatInput = ({message, setMessage, labelText, sendMessage}) => {

    return (
      <View styles={styles.container}>
        <Input
            styles = {styles.input}
            disabledInputStyle={{ background: "#ddd" }}
            label={labelText}
            value={message}
            rightIcon={<Icon name="chevron-right" size={20} />}
            onChangeText={setMessage}
            placeholder="Enter Message"
          />
          <Button title=">" onPress={sendMessage}/>
      </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1, // takes up all available space, except what the button takes
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
  },
});

export default ChatInput;