import { StyleSheet } from "react-native";
import { EVENT_PIC_HEIGHT, EVENT_PIC_WIDTH } from "../constants"

export const AddEventStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  event_pic_container: {
    marginBottom: 10,
    marginTop: 20,
  },
  event_picture_button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  event_picture: {
    borderColor: "#aaaaaa",
    borderWidth: 1,
    width: EVENT_PIC_WIDTH,
    height: EVENT_PIC_HEIGHT,
    borderRadius: EVENT_PIC_WIDTH / 2
  },
  textInput: {
    margin: 15,
    borderColor: "white",
    borderWidth: 1,
    fontFamily: "Ubuntu_400Regular",
    fontSize: 35
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
  dateView: {
    flexDirection: "column",
  },
  startDatePickerView: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15
  },
  endDatePickerView: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
    marginTop: -15
  },
  emojiAndNameView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  downSliderText: {
    color: "gray",
    fontFamily: "Ubuntu_400Regular",
    textAlign: "center"
  },
  downSlider: {
    margin: 20
  },
  startEndText: {
    fontSize: 16,
  },
  downThresholdAndIcon: {
    flexDirection: "row",
    justifyContent: "center",
  },
  toolTipText: {
    fontSize: 16,
    color: "white"
  },
  infoIcon: {
    fontSize: 18,
    color: "#90BEDE"
  },
  addEndTimeBtn: {
    width: "100%",
    height: "40px",
    marginTop: "5%"
  }
});
