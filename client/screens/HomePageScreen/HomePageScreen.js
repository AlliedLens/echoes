import { View, ScrollView } from 'react-native';
import { Image, Text, ListItem } from '@rneui/themed';
import ContactWindow from '../../components/ContactWindow/ContactWindow';
import { useState, useEffect } from 'react';
import { loggedUser } from '../SignInScreen/SignInScreen';

const HomePageScreen = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/view-contacts-by-owner/${loggedUser}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();

        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <View>
      <Text>Welcome {loggedUser}</Text>
      <ScrollView>
        {contacts.map((contact, index) => (
          <ContactWindow label={contact.contactName} imagePath={"/home/davidjijo/dev-tutorials/echoesChat/assets/defaultProfile.jpg"}/>
        ))}
        <ContactWindow label="Koichi" imagePath={"/home/davidjijo/dev-tutorials/echoesChat/assets/defaultProfile.jpg"}/>
      </ScrollView>
    </View>
  );
};

export default HomePageScreen;
