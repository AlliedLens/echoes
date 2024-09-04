import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button, Image } from '@rneui/themed';
import { Avatar } from '@rneui/themed';
const ContactWindow = ({ label, imagePath }) => {
  
   return (
    <Button type="outline" style={styles.container}>
        <Image
          source={require(imagePath)}
          style={styles.image}
        />
        {/* <Avatar rounded source ={require("../../../assets/defaultProfile.jpg")}/> */}
        <Text style={styles.label}>{label}</Text>
    </Button>  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ContactWindow;
