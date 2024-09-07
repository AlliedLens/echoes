import { View, ScrollView } from 'react-native';
import { Image, Text, ListItem, Button, Overlay, Input, Avatar } from '@rneui/themed';
import ContactWindow from '../../components/ContactWindow/ContactWindow';
import { useState, useEffect } from 'react';
import { loggedUser } from '../SignInScreen/SignInScreen';

const HomePageScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [userProfile, setUserProfile] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactName, setContactName] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`http://0.0.0.0:5000/view-contact-users/${loggedUser}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const contactData = await response.json();

        setContacts(contactData);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    
      try {
        const response = await fetch(`http://0.0.0.0:5000/view-by-username/${loggedUser}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        })
        const profileData = await response.json()
        setUserProfile(profileData.profilePhotoPath);
      } catch(error)  { 
        console.error("error fetching username", error);
      }
    
    };



    fetchContacts();
  }, [contactModalVisible] );

  const searchPressed = () => {
    const data = fetch(`http://0.0.0.0:5000//add-contact/${contactName}/${loggedUser}`,
      {
        method:"POST",
        headers: {
          'Content-Type' : 'application/json',
        },
      }
    ).then(response  => response.json()
  ).then(
    data =>{
        if (data.message == "contact has been added"){
          setContactModalVisible(false);
          setErrorMessage("");  
        }else{
          setErrorMessage(data.message);
          console.log(errorMessage);
        }
      }
    )
  }


  console.log(userProfile)
  return (
    <View>
      <Text h1>Welcome {loggedUser}</Text>
      <Image   style={{ width: 100, height: 100 }} source={{uri: userProfile}}/> 
      <Overlay isVisible={contactModalVisible} onBackdropPress={ () => setContactModalVisible(false)}>
        <Input placeholder="enter the contact to add" onChangeText={setContactName} errorMessage={errorMessage}/>
        <Button title="Search" onPress={searchPressed} />
      </Overlay>
      <ListItem bottomDivider key={0}>
        <ListItem.Content key={0}>
          <ContactWindow key = {0} label="Koichi"/>
        </ListItem.Content>
      </ListItem>
      {contacts.map((contact, index) => (
        <ListItem bottomDivider key={index}>
          <ListItem.Content key={index}>
            <ContactWindow key = {index} label={contact.username} imagePath={contact.profilePhotoPath}/>
          </ListItem.Content>
        </ListItem>
      ))}
      <Button title="Add Contact" onPress={ () => setContactModalVisible(true)}  />
    </View>
  );
};

export default HomePageScreen;
