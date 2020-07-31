import { StyleSheet } from "react-native";
export const squad_members_styles = StyleSheet.create({
  squads_members_container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center"
    padding: 20
  },
  users_list: {
    height: "100%"
  },
  user_text: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 24,
    paddingTop: 10
  },
  user_info_view: {
    flexDirection: "row",
    alignItems: "center",
  },
  user_image: {
    width: 30, 
    height: 30,
    borderRadius: 24/2
  }
});
