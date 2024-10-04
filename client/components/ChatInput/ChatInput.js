import { Button, Text } from "@rneui/themed";
import { Input } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { View } from "react-native";

const ChatInput = ({message, setMessage, labelText, sendMessage}) => {

    return (
      <View>
        <Input
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

export default ChatInput;
