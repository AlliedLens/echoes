import {  View } from 'react-native';
import { Image } from '@rneui/themed';
import { Text } from '@rneui/themed';
import ContactWindow from '../../components/ContactWindow/ContactWindow';
import { ScrollView } from 'react-native';



const HomePageScreen = () => {

 
  return (
    <View>
      <ContactWindow label="Koichi"/>   
    </View>
  );
};

export default HomePageScreen;
