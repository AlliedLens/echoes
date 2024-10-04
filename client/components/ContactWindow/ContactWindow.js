
import React from 'react';
import { Text, Image, View } from 'react-native';
import { Avatar } from '@rneui/themed';

const ContactWindow = ({ label, imagePath }) => {
  return (
    <View>
      {label === "Koichi" ? (
        <View>
          <Image source={require('../../../assets/echoesJojo.jpg')} />
        </View>
      ) : (
        <Avatar rounded source={{ uri: imagePath }} />
      )}
      <Text>{label}</Text>
    </View>
  );
};

export default ContactWindow;
