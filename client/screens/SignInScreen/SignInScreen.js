import React from 'react';
import { Button } from '@rneui/base';
import { Input } from '@rneui/themed';
import {SafeAreaView} from 'react-native';
import { Text, Header} from '@rneui/themed';
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react';

export let loggedUser = "";

const SignInScreen = () => {

    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const onSignUpPressed = () => {
        navigation.navigate("SignUp")
    }

    const onSignInPressed = () =>{
        const data = {username: username, password: password};
        fetch("http://0.0.0.0:5000/login", {
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(
            data => {
                // console.log(data.value);
                if (data.value == "user_found"){
                    setUsername(username)
                    loggedUser = username;
                    navigation.navigate("HomePage")
                }else{
                    setErrorMessage(data.value)
                    navigation.navigate("HomePage")
                }
            }
        )
    }
    
    return (
        <SafeAreaView>
            <Header
                barStyle="default"
                centerComponent={{
                text: "Sign In",
                style: { color: "#fff" }
                }}
                placement="center"
            />      
            <Input placeholder='Username' leftIcon={{ type: 'font-awesome', name: 'chevron-left' }} onChangeText={setUsername} errorMessage={errorMessage}></Input>
            <Input placeholder='Password' leftIcon={{ type: 'font-awesome', name: 'chevron-left' }} onChangeText={setPassword} errorMessage={errorMessage} secureTextEntry={true}></Input>
            <Button title="Login" onPress={onSignInPressed}/>
            <Button title="Sign Up" onPress={onSignUpPressed}/>
        </SafeAreaView>
    );
};

export default SignInScreen;