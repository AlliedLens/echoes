import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {StyleSheet} from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from "../screens/SignUpScreen"
import SignInScreen from "../screens/SignInScreen"
import HomePageScreen from '../screens/HomePageScreen';
const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="HomePage" component={HomePageScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
