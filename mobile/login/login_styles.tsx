import { StyleSheet } from "react-native";
export const login_styles = StyleSheet.create({
  login_container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  gradient_background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  title_description_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  imdown_title: {
    color: "#fff",
    fontFamily: "Ubuntu_700Bold",
    fontSize: 72,
  },
  imdown_description: {
    margin: 10,
    color: "#fff",
    fontFamily: "Ubuntu_400Regular_Italic",
    fontSize: 18,
  },
  google_sign_in_button_container: {
    flex: 1,
  },
  google_sign_in_button: {
    width: 192, 
    height: 48
  }
});
