import { Text} from '@rneui/themed';
import { Input } from '@rneui/themed'; 
import { Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-web';
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react';

import React from 'react';

const SignUpScreen = () =>{
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterPressed = () => {
        const data = {username: username, password: password};
        fetch("http://localhost:5000/register", {
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
            <Button title="Register" onPress={onRegisterPressed}></Button>
            <Button title="Back To Sign In" onPress={onBackToSignInPressed}></Button>

        </SafeAreaView>

    )
}

export default SignUpScreen;
