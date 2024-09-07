import { View, ScrollView } from 'react-native';
import { Image, Text, ListItem, Button, Overlay, Input } from '@rneui/themed';
import ContactWindow from '../../components/ContactWindow/ContactWindow';
import { useState, useEffect } from 'react';
import { loggedUser } from '../SignInScreen/SignInScreen';

const HomePageScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [userProfile, setUserProfile] = useState('');
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
        const data = await response.json();

        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    
      // try {
      //   const response = await fetch("http://0.0.0.0:5000/view-by-username/<username>")
      // }
    
    };



    fetchContacts();
  }, []);

  const searchPressed = () => {
    setContactModalVisible(false);
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
        console.log(data.message);
      }
    )
  }


  return (
    <View>
      <Text>Welcome {loggedUser}</Text>
      <Button title="Add Contact" onPress={ () => setContactModalVisible(true)} />
      <Overlay isVisible={contactModalVisible} onBackdropPress={ () => setContactModalVisible(false)}>
        <Input placeholder="enter the contact to add, which is in the system" onChangeText={setContactName}/>
        <Button title="Search" onPress={searchPressed} />
      </Overlay>
      
      <ScrollView>
        {contacts.map((contact, index) => (
          <ContactWindow key = {index} label={contact.username} imagePath={contact.profilePhotoPath}/>
        ))}
        <ContactWindow label="Koichi" imagePath={"/home/davidjijo/dev-tutorials/echoesChat/assets/defaultProfile.jpg"}/>
      </ScrollView>

    </View>
  );
};

export default HomePageScreen;
