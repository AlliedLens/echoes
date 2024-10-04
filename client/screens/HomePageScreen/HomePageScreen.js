import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Image, Text, ListItem, Button, Overlay, Header, Input, Avatar } from '@rneui/themed';
import ContactWindow from '../../components/ContactWindow/ContactWindow';
import { loggedUser } from '../SignInScreen/SignInScreen';
import { useNavigation } from '@react-navigation/native';
import { ngrokServer } from '../../config';

export let chatWithUser = "";

const HomePageScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [userProfile, setUserProfile] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactName, setContactName] = useState('');
  const navigation = useNavigation();

  console.log(`${loggedUser} is the user...`);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log(`${ngrokServer}/view-contact-users`);
        const data = { user: loggedUser };  
        const response = await fetch(`${ngrokServer}/view-contact-users`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),  
        });
        const contactData = await response.json();
        setContacts(contactData);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    
      try {
        console.log(`${ngrokServer}/view-by-username`);
        const data = { user: loggedUser };  
        const response = await fetch(`${ngrokServer}/view-by-username`, {
          method: 'POST',  
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),  
        });
        const profileData = await response.json();
        setUserProfile(profileData.profilePhotoPath);
      } catch (error) {
        console.error('Error fetching username', error);
      }

    };

    fetchContacts();
  }, [contactModalVisible]);

  const searchPressed = () => {
    console.log(`${ngrokServer}/add-contact`);
    const data = { contactName: contactName, loggedUser: loggedUser }; 
    fetch(`${ngrokServer}/add-contact`, {
      method: "POST",  
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),  
    })
    .then(response => response.json())
    .then(
      data => {
        if (data.message == "contact has been added") {
          setContactModalVisible(false);
          setErrorMessage("");
        } else {
          setErrorMessage(data.message);
          console.log(errorMessage);
        }
      }
    );
  };

  const onContactPressed = (title) => {
    console.log(title + " is pressed");
    chatWithUser = title;
    navigation.navigate("ChatScreen");
  };

  return (
    <View style={styles.container}>
      <Header
        barStyle="default"
        leftComponent={
          <Avatar rounded source={{ uri: userProfile }} />
        }
        centerComponent={{
          text: `Welcome ${loggedUser}`,
          style: styles.headerText
        }}
        placement="center"
        containerStyle={styles.headerContainer}
      />
      
      <Overlay isVisible={contactModalVisible} onBackdropPress={() => setContactModalVisible(false)} overlayStyle={styles.overlay}>
        <Input 
          placeholder="Enter the contact to add" 
          onChangeText={setContactName} 
          errorMessage={errorMessage} 
          containerStyle={styles.inputContainer}
        />
        <Button title="Search" onPress={searchPressed} buttonStyle={styles.searchButton} />
      </Overlay>

      <ScrollView>
        <Pressable onPress={() => onContactPressed("Koichi")} style={styles.contactItem}>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ContactWindow label="Koichi" />
            </ListItem.Content>
          </ListItem>
        </Pressable>

        {contacts.map((contact, index) => (
          <Pressable onPress={() => onContactPressed(contact.username)} key={index} style={styles.contactItem}>
            <ListItem bottomDivider>
              <ListItem.Content>
                <ContactWindow label={contact.username} imagePath={contact.profilePhotoPath} />
              </ListItem.Content>
            </ListItem>
          </Pressable>
        ))}
      </ScrollView>

      <Button title="Add Contact" onPress={() => setContactModalVisible(true)} buttonStyle={styles.addButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#2089dc',
    paddingTop: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlay: {
    width: '90%',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: '#2089dc',
  },
  contactItem: {
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: '#2089dc',
    marginTop: 20,
  },
});

export default HomePageScreen;
