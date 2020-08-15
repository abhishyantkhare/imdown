import React, { useState } from "react";
import { Text, View } from "react-native";
import { login_styles } from "./login_styles";
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { BACKEND_URL } from "../backend/backend"
import { User } from "../types/user"
import PushNotificationIOS, { PushNotificationPermissions } from '@react-native-community/push-notification-ios';


const Login = ({ navigation }) => {
    const [isSigninInProgress, setIsSigninInProgress] = useState(false);
    const IOS_CLIENT_ID = "1097983281822-8qr8vltrud1hj3rfme2khn1lmbj2s522.apps.googleusercontent.com";
    const WEB_ID = "1097983281822-8k2kede3hrgrqi15r869mf3u5at6q6ib.apps.googleusercontent.com"


    const goToSquads = (email: string) => {
        navigation.navigate("Squads", {
            squads: [],
            email: email
        });
    };

    const signInOnBackend = (user: User, googleServerCode: string) => {
        const login_url = BACKEND_URL + 'sign_in'
        const data = {
            email: user.email,
            name: user.name,
            photo: user.photo,
            googleServerCode: googleServerCode
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


    const signIn = async () => {
        try {
          setIsSigninInProgress(true);
          await GoogleSignin.hasPlayServices();
          const resp = await GoogleSignin.signIn();
          const user: User = {
            email: resp.user.email,
            name: resp.user.name,
            photo: resp.user.photo
          };
          setIsSigninInProgress(false);
          signInOnBackend(user, resp.serverAuthCode);
        } catch (error) {
          setIsSigninInProgress(false);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            console.log("Error signing into Google account. User cancelled the login flow. Error is " + error);
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            console.log("Error signing into Google account. User is already in the process of logging in. Error is " + error);
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            console.log("Error signing into Google account. Play services are not available. Error is " + error);
          } else {
            console.log("Error signing into Google account. Unidentified error. It is " + error);
          }
        }
    };

    PushNotificationIOS.addEventListener('register', (token) => console.log(`TOKEN: ${token})`))

    PushNotificationIOS.requestPermissions({ alert: true, badge: true });


    GoogleSignin.configure({
        iosClientId: IOS_CLIENT_ID,
        webClientId: WEB_ID,
        offlineAccess: true,
        scopes: ['https://www.googleapis.com/auth/calendar.events']
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
                    onPress={signIn}
                    disabled={isSigninInProgress} />
            </View>
        </View>
    );
};

export default Login;
