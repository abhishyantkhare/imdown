import { StyleSheet } from "react-native";

export const AddEventStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  from_url_button: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginHorizontal: 5,
  },
  next_button: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10
  },
  add_event_button: {
    paddingTop: 15
  },
  emoji_and_event_name_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"
  },
  emoji: {
    fontSize: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  emoji_picker_container: {
    paddingTop: 60
  },
  event_name: {
    margin: 15,
    borderColor: "white",
    borderBottomColor: "#90BEDE",
    borderWidth: 1,
    color: "#90BEDE",
    fontFamily: "Ubuntu_700Bold",
    fontSize: 32
  }
});
