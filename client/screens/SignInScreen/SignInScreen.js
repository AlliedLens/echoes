import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Input, Text, Header } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { ngrokServer } from '../../config';

export let loggedUser = "";

const SignInScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onSignUpPressed = () => {
        navigation.navigate("SignUp");
    };

    const onSignInPressed = () => {
        const data = { username: username, password: password };
        fetch(`${ngrokServer}/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.value === "user_found") {
                setUsername(username);
                loggedUser = username;
                navigation.navigate("HomePage");
            } else {
                setErrorMessage(data.value);
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <Header
                barStyle="default"
                centerComponent={{
                    text: "Sign In",
                    style: styles.headerText,
                }}
                containerStyle={styles.headerContainer}
                placement="center"
            /> */}
            
            <View style={styles.box}>
                <Input 
                    placeholder='Username' 
                    onChangeText={setUsername} 
                    errorMessage={errorMessage ? errorMessage : null} 
                    containerStyle={styles.input}
                />
                
                <Input 
                    placeholder='Password' 
                    onChangeText={setPassword} 
                    errorMessage={errorMessage ? errorMessage : null} 
                    secureTextEntry={true} 
                    containerStyle={styles.input}
                />
                
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <View style={styles.buttonWrapper}>
                    <Button 
                        title="Login" 
                        onPress={onSignInPressed} 
                        buttonStyle={styles.button} 
                    />
                    
                    <Button 
                        title="Sign Up" 
                        onPress={onSignUpPressed} 
                        buttonStyle={[styles.button, styles.signUpButton]} 
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f0f0f0',
    },
    headerContainer: {
        backgroundColor: '#2089dc',
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    box: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        marginBottom: 15,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        width: 100,
        backgroundColor: '#2089dc',
    },
    signUpButton: {
        backgroundColor: '#2089dc',
    },
});

export default SignInScreen;
