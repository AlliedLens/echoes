import { Text} from '@rneui/themed';
import { Input } from '@rneui/themed'; 
import { Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react';
import { Image } from '@rneui/themed';
import { Avatar } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';

import React from 'react';



const SignUpScreen = () =>{
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled){
          setImage(result.assets[0].uri)
        }
        
        console.log(image);
    
    };
    
    const onRegisterPressed = () => {
        const data = {username: username, password: password, profilePhotoPath: image};
        fetch("http://0.0.0.0:5000/register", {
            method:"POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(
            response => response.json()
        ).then(
            data => {
                console.log(data.value)
                if (data.value == "new_account_success"){
                    setErrorMessage("")
                    navigation.navigate("SignIn")
                }else{
                    setErrorMessage(data.value)
                }
            }
        )
    }

    const onBackToSignInPressed = () =>{
        navigation.navigate("SignIn")
    }

    return (
        <SafeAreaView>
            <Text h1>Sign Up</Text>
            <Input placeholder="New Username" leftIcon={{ type: 'font-awesome', name: 'chevron-left' }} onChangeText={setUsername} errorMessage={errorMessage}></Input>
            <Input placeholder="New Password" leftIcon={{ type: 'font-awesome', name: 'chevron-left' }} onChangeText={setPassword} errorMessage={errorMessage}></Input>
            <Button title="Upload a Profile" onPress={pickImage}/>
            <Avatar rounded source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }}/>
            <Button title="Register" onPress={onRegisterPressed}></Button>
            <Button title="Back To Sign In" onPress={onBackToSignInPressed}></Button>

        </SafeAreaView>

    )
}

export default SignUpScreen;
