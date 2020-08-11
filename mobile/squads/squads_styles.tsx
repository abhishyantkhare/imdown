import { StyleSheet } from "react-native";
export const squad_styles = StyleSheet.create({
  squads_container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    paddingLeft: 50,
    justifyContent: "center"
  },
  squad_item: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  squad_list: {
    height: "100%"
  },
  squad_text: {
    color: "#90BEDE",
    fontFamily: "Ubuntu_700Bold",
    fontSize: 32
  }
});
