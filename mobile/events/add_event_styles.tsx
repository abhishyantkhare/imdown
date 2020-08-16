import { StyleSheet } from "react-native";

export const AddEventStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  textInput: {
    margin: 15,
    borderColor: "white",
    borderWidth: 1,
    fontFamily: "Ubuntu_400Regular",
    fontSize: 16
  },
  largeTextInput: {
    margin: 15,
    borderColor: "white",
    borderBottomColor: "#90BEDE",
    borderWidth: 1,
    color: "#90BEDE",
    fontFamily: "Ubuntu_700Bold",
    fontSize: 32
  },
  optionalTextInput: {
    margin: 15,
    borderColor: "white",
    borderWidth: 1,
    color: "gray",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 16
  },
  nextButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10
  },
  topRightButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginHorizontal: 5,
  },
  emoji: {
    fontSize: 40,
  },
  dateAndIcon: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  downSliderText: {
    color: "gray",
    fontFamily: "Ubuntu_400Regular",
    textAlign: "center"
  },
  downSlider: {
    margin: 20
  }
});
