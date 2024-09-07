import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { Button, Avatar } from '@rneui/themed';

const ContactWindow = ({ label, imagePath }) => {
  return (
    <Button type="outline" style={styles.container}>
      {
        label === "Koichi" ? (
          <Avatar
            rounded
            ImageComponent={() => (
              <Image
                source={require("/home/davidjijo/dev-tutorials/echoesChat/assets/echoesJojo.jpg")}
                style={styles.avatarImage} 
              />
            )}
            size="medium" 
          />
        ) : (
          <Avatar
            rounded
            ImageComponent={() => (
              <Image
                source={{ uri: imagePath }}
                style={styles.avatarImage} 
              />
            )}
            size="medium"
          />
        )
      }
      <Text style={styles.label}>{label}</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%', 
    height: '100%', 
    alignSelf: 'center', 
    resizeMode: 'cover', 
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ContactWindow;
