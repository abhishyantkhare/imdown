import React from "react";
import { View, Image, Text } from "react-native";
import { login_styles } from "./login_styles";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { BACKEND_URL } from "../backend/backend"

type User = {
    email: string,
    photo: string,
    name: string
}


const Login = ({ navigation }) => {
    const IOS_CLIENT_ID = "1097983281822-8qr8vltrud1hj3rfme2khn1lmbj2s522.apps.googleusercontent.com";
    const ANDROID_CLIENT_ID = "1097983281822-4b63n721lbqllpn7u4cvoqmh0rudquma.apps.googleusercontent.com";
    const LOGIN_SUCCESS = "success"

    const goToSquads = (email: string) => {
        navigation.navigate("Squads", {
            squads: [],
            email: email
        });
    };


    const signInOnBackend = (user: User) => {
        const login_url = BACKEND_URL + 'sign_in'
        const data = {
            user: user.email,
            photo: user.photo,
            name: user.name
        }
        fetch(login_url, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((resp: Response) => {
            setCookieAndTransition(resp.headers.get("set-cookie"), user.email)
        })
    }

    const setCookieAndTransition = (sessionCookie: string, email: string) => {
        AsyncStorage.setItem("sessionCookie", sessionCookie).then(() => {
            goToSquads(email);
        })
    }

    const onPress = () => {
        GoogleSignin.signIn().then((resp) => {
            //TODO: Catch error codes here
            const user: User = {
                email: resp.user.email,
                photo: resp.user.photo,
                name: resp.user.name
            }
            signInOnBackend(user)
        });
    };

    GoogleSignin.configure({
        iosClientId: IOS_CLIENT_ID,
    });


    return (
        <View style={login_styles.login_container}>
            <LinearGradient
                colors={["#90BEDE", "#C7F9FF"]}
                style={login_styles.gradient_background}
            />
            <View style={login_styles.title_description_container}>
                <Text style={login_styles.imdown_title}>imdown</Text>
                <Text style={login_styles.imdown_description}>A better way to manage group events.</Text>
            </View>
            <View style={login_styles.google_sign_in_button_container}>
                <GoogleSigninButton
                    style={login_styles.google_sign_in_button}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={onPress} 
                />
            </View>
        </View>
    );
};

export default Login;
