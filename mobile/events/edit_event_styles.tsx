import { StyleSheet } from "react-native";
export const EditEventStyles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(52, 52, 52, 0.05)",
    flex: 1
  },
  event_pic_container: {
    marginBottom: 10,
    marginTop: 20,
  },
  event_picture: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  event_title_container: {
    backgroundColor: "#ffff",
    borderBottomWidth: .5,
    borderTopWidth: .5,
    borderColor: "#aaaaaa",
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20,
    paddingVertical: 15
  },
  event_title: {
    color: "black",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 30,
    paddingBottom: 10,
    paddingTop: 20,
    paddingLeft: 10
  },
  event_details_edit_container: {
    backgroundColor: "#ffff",
    borderBottomWidth: .5,
    borderTopWidth: .5,
    borderColor: "#aaaaaa",
    marginBottom: 20,
    marginTop: 20,
  },
  event_time: {
    color: "black",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    paddingLeft: 10,
    paddingVertical: 15,
  },
  event_url: {
    color: "blue",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    paddingLeft: 10,
    paddingVertical: 15,
  },
  event_description: {
    color: "black",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    paddingBottom: 40,
    paddingTop: 15,
    paddingLeft: 10,
  },
  additional_fields_container: {
    backgroundColor: "#ffff",
    borderColor: "#aaaaaa",
    borderWidth: .5,
    marginVertical: 20,
  },
  emoji_container: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  event_emoji_text: {
    alignItems: "center",
    color: "gray",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    margin: 15,
    paddingVertical: 15
  },
  emoji: {
    fontSize: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji_picker_container : {
    paddingTop: 60
  },
  down_threshold_text: {
    alignItems: "center",
    color: "gray",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    margin: 15,
    paddingTop: 20
  },
  save_button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#68EDC6",
    borderColor: "#aaaaaa",
    borderRadius: 30,
    borderWidth: 1,
    height: 75,
    width: 150,
    marginTop: 20,
    marginBottom: 40,
  },
  save_button_text: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 30,
  }
});
