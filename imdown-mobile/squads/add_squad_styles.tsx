import { StyleSheet } from "react-native";
export const AddSquadStyles = StyleSheet.create({
  nameEmojiContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: 40
    
  },
  emoji: {
    fontSize: 40,
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#90BEDE"
  },
  add_squad_button: {
    // paddingTop: 15,
    backgroundColor: "#90BEDE",
    borderWidth: 10,
    borderRadius: 20,
    borderColor: "#90BEDE",
    padding: 5
  },
  add_squad_text: {
    fontFamily: "Ubuntu_700Bold",
    color: "white",
    fontSize: 18
  },
  add_squad_emoji: {
    // paddingTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  squad_name: {
    margin: 15,
    height: 40,
    borderColor: "white",
    borderBottomColor: "#90BEDE",
    borderWidth: 1,
    color: "#90BEDE",
    fontFamily: "Ubuntu_700Bold",
    fontSize: 32
  }
});
