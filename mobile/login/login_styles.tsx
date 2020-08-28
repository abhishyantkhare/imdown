import { StyleSheet } from "react-native";
export const login_styles = StyleSheet.create({
  login_container: {
    flex: 1,
    flexDirection: "column",
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
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: "10%",
  },
  imdown_title: {
    color: "#fff",
    fontFamily: "SourceSansPro_700Bold",
    fontSize: 70,
    marginBottom: 30,
  },
  imdown_description: {
    color: "#fff",
    fontFamily: "SourceSansPro_700Bold",
    fontSize: 24,
  },
  google_sign_in_button: {
    width: 192, 
    height: 48,
    marginTop: 100
  }
});
