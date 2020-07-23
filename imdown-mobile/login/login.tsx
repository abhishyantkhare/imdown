import React from "react";
import { View, TextInput, Button } from "react-native";
import { login_styles } from "./login_styles";

const Login = ({navigation}) => {
  const goToSquads = () => {
    navigation.navigate("Squads", {
      squads: []
    });
  };

  return (
    <View style={login_styles.login_container}>
      <TextInput placeholder="Please sign in" style={login_styles.text_input} />
      <View style={login_styles.button}>
        <Button title="Sign In" onPress={goToSquads} />
      </View>
    </View>
  );
};

export default Login;
