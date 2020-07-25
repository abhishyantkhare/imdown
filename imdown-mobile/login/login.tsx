import React from "react";
import { View, TextInput, Image } from "react-native";
import { login_styles } from "./login_styles";
import * as Google from 'expo-google-app-auth';
import { TouchableHighlight } from "react-native-gesture-handler";

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
      resp.text()
    }).then(result => { console.log(result) })
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
      <TextInput placeholder="Please sign in with Google" style={login_styles.text_input} />
      <TouchableHighlight onPress={onPress}>
        <Image source={require('../assets/img/btn_google_light_normal_ios.png')} />
      </TouchableHighlight>

    </View>
  );
};

export default Login;
