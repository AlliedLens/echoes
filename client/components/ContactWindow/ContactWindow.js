import React from 'react';
import { Text, StyleSheet, Image, View } from 'react-native';
import { Avatar, Button } from '@rneui/themed';

const ContactWindow = ({ label, imagePath }) => {
  return (
    <View style={styles.container}>
      {label === "Koichi" ? (
        <View style={styles.avatarContainer}>
          <Image source={require('../../../assets/echoesJojo.jpg')} style={styles.avatarImage} />
        </View>
      ) : (
        <Avatar rounded source={{ uri: imagePath }} size="medium" />
      )}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden', // Ensure the image is cropped properly
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ContactWindow;
