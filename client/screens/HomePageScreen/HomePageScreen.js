import { View, ScrollView, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image, Text, ListItem, Button, Overlay, Header, Input, Avatar } from '@rneui/themed';
import ContactWindow from '../../components/ContactWindow/ContactWindow';
import { useState, useEffect } from 'react';
import { loggedUser } from '../SignInScreen/SignInScreen';
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native';
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
    <View style={{flex: 1}}>
      <Header
        barStyle="default"
        leftComponent={
          <Avatar rounded source={{uri: userProfile}} style={{width: 50, height: 50}} />
        }
        centerComponent={{
          text: `Welcome ${loggedUser}`,
          style: { color: "#fff" }
        }}
        placement="center"
      />
      <Overlay isVisible={contactModalVisible} onBackdropPress={() => setContactModalVisible(false)}>
        <Input placeholder="enter the contact to add" onChangeText={setContactName} errorMessage={errorMessage} />
        <Button title="Search" onPress={searchPressed} />
      </Overlay>

      <Pressable onPress={() => onContactPressed("Koichi")} style={{}}>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ContactWindow label="Koichi" />
          </ListItem.Content>
        </ListItem>
      </Pressable>
      {contacts.map((contact, index) => (
        <Pressable onPress={() => onContactPressed(contact.username)} key={index}>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ContactWindow label={contact.username} imagePath={contact.profilePhotoPath} />
            </ListItem.Content>
          </ListItem>
        </Pressable>
      ))}

      <Button title="Add Contact" onPress={() => setContactModalVisible(true)} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default HomePageScreen;
