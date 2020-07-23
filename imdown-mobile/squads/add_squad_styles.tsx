import { StyleSheet } from "react-native";
export const AddSquadStyles = StyleSheet.create({
  nameEmojiContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingLeft: 20
    
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
  add_squad_emoji: {
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
