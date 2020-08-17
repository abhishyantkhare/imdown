import { StyleSheet } from "react-native";
export const AddSquadStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  add_container: {
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 20
  },
  add_title: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 20,
    paddingBottom: 5
  },
  or_text: {
    paddingVertical: 20,
    fontFamily: "Ubuntu_700Bold",
    fontSize: 30,
  },
  emoji_and_squad_name_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 40,
    alignItems: "center",
    justifyContent: "center",
    width: 45,
  },
  add_squad_button: {
    backgroundColor: "#90BEDE",
    borderWidth: 10,
    borderRadius: 20,
    borderColor: "#90BEDE",
    padding: 5,
    justifyContent: "center"
  },
  add_squad_text: {
    fontFamily: "Ubuntu_700Bold",
    color: "white",
    fontSize: 18
  },
  squad_emoji: {
    alignSelf: "center"
  },
  squad_name: {
    margin: 15,
    borderColor: "white",
    borderBottomColor: "#90BEDE",
    borderWidth: 1,
    color: "#90BEDE",
    fontFamily: "Ubuntu_700Bold",
    fontSize: 32
  },
  
});
