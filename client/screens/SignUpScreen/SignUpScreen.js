import { Text, Input, Button, Avatar, Header } from '@rneui/themed';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { ngrokServer } from '../../config';

const SignUpScreen = () => {
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

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onRegisterPressed = () => {
        const data = { username: username, password: password, profilePhotoPath: image };
        fetch(`${ngrokServer}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.value == "new_account_success") {
                setErrorMessage("");
                navigation.navigate("SignIn");
            } else {
                setErrorMessage(data.value);
            }
        });
    };

    const onBackToSignInPressed = () => {
        navigation.navigate("SignIn");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                <Input
                    placeholder="New Username"
                    onChangeText={setUsername}
                    errorMessage={errorMessage ? errorMessage : null}
                    containerStyle={styles.input}
                />
                <Input
                    placeholder="New Password"
                    onChangeText={setPassword}
                    errorMessage={errorMessage ? errorMessage : null}
                    secureTextEntry={true}
                    containerStyle={styles.input}
                />

                {/* Profile Picture Upload */}
                <Button title="Upload a Profile Picture" onPress={pickImage} buttonStyle={styles.uploadButton} />
                {image ? (
                    <Avatar
                        rounded
                        size="xlarge"
                        source={{ uri: image }}
                        containerStyle={styles.avatar}
                    />
                ) : (
                    <Text style={styles.placeholderText}>No Image Selected</Text>
                )}

                <View style={styles.buttonWrapper}>
                    <Button title="Register" onPress={onRegisterPressed} buttonStyle={styles.button} />
                    <Button title="Back To Sign In" onPress={onBackToSignInPressed} buttonStyle={styles.button} />
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
    box: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center',
    },
    input: {
        width: '100%',
        marginBottom: 15,
    },
    uploadButton: {
        marginBottom: 10,
        backgroundColor: '#2089dc',
        width: '100%',
    },
    avatar: {
        marginTop: 10,
        marginBottom: 20,
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
        marginBottom: 20,
    },
    buttonWrapper: {
        alignItems: 'center', // Center buttons vertically
        width: '100%',
    },
    button: {
        width: '100%', // Full width for buttons
        backgroundColor: '#2089dc',
        marginVertical: 10, // Add margin for spacing between buttons,
        justifyContent: 'center'
    },
});

export default SignUpScreen;
