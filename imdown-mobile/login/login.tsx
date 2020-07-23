import React from "react";
import { View, TextInput, Button } from "react-native";
import { login_styles } from "./login_styles";
import * as Google from 'expo-google-app-auth';



const Login = ({ navigation }) => {
  const IOS_CLIENT_ID = '1097983281822-8qr8vltrud1hj3rfme2khn1lmbj2s522.apps.googleusercontent.com'
  const LOGIN_SUCCESS = "success"


  const goToSquads = () => {
    navigation.navigate("Squads", {
      squads: ["SEP", "CodeBase", "BangerBrozz"]
    });
  };



  const onPress = () => {
    Google.logInAsync({
      iosClientId: IOS_CLIENT_ID,
    }).then((resp: Google.LogInResult) => {
      if (resp.type === LOGIN_SUCCESS) {
        goToSquads()
      }
    });
  };


  return (
    <View style={login_styles.login_container}>
      <TextInput placeholder="Please sign in" style={login_styles.text_input} />
      <View style={login_styles.button}>
        <Button
          title={"sign in"}
          onPress={onPress}
        />
      </View>
    </View>
  );
};

export default Login;
