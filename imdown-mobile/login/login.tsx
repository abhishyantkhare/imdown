import React from "react";
import { View, Image, Text } from "react-native";
import { login_styles } from "./login_styles";
import * as Google from 'expo-google-app-auth';
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';


type User = {
  email: string
}


const Login = ({ navigation }) => {
  const IOS_CLIENT_ID = "1097983281822-8qr8vltrud1hj3rfme2khn1lmbj2s522.apps.googleusercontent.com";
  const ANDROID_CLIENT_ID = "1097983281822-4b63n721lbqllpn7u4cvoqmh0rudquma.apps.googleusercontent.com";
  const LOGIN_SUCCESS = "success"
  const BACKEND_URL = "http://localhost:5000"

  const goToSquads = () => {
    navigation.navigate("Squads", {
      squads: []
    });
  };


  const signInOnBackend = (user: User) => {
    const login_url = BACKEND_URL + '/sign_in'
    const data = {
      user: user
    }
    fetch(login_url, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((resp: Response) => {
      setCookieAndTransition(resp.headers.get("set-cookie"))
    })
  }

  const setCookieAndTransition = (sessionCookie: string) => {
    AsyncStorage.setItem("sessionCookie", sessionCookie).then(() => {
      goToSquads();
    })
  }

  const onPress = () => {
    Google.logInAsync({
      iosClientId: IOS_CLIENT_ID,
      androidClientId: ANDROID_CLIENT_ID
    }).then((resp: Google.LogInResult) => {
      if (resp.type === LOGIN_SUCCESS) {
        const user: User = {
          email: resp.user.email
        }
        signInOnBackend(user)
      }
    });
  };


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
      <View style={login_styles.google_sign_in_button}>
        <TouchableOpacity onPress={onPress}>
          <Image source={require('../assets/img/sign_in_with_google.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
