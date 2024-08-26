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

    const onRegisterPressed = () => {
        const data = {username: username, password: password};
        console.log(data);
        fetch("http://localhost:5000/register", {
            method:"POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        navigation.navigate("SignIn");
    }

    return (
        <SafeAreaView>
            <Text h1>Sign Up</Text>
            <Input placeholder="New Username" leftIcon={{ type: 'font-awesome', name: 'chevron-left' }} onChangeText={setUsername} ></Input>
            <Input placeholder="New Password" leftIcon={{ type: 'font-awesome', name: 'chevron-left' }} onChangeText={setPassword} ></Input>
            <Button title="Register" onPress={onRegisterPressed}></Button>

        </SafeAreaView>

    )
}

export default SignUpScreen;
