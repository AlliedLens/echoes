import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from "../screens/SignUpScreen"
import SignInScreen from "../screens/SignInScreen"
import HomePageScreen from '../screens/HomePageScreen';
import ChatScreen from '../screens/ChatScreen';
const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="HomePage" component={HomePageScreen} />
                <Stack.Screen name="ChatScreen" component={ChatScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
