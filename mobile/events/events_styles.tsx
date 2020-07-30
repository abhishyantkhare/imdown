import { StyleSheet } from "react-native";
export const event_styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  event_emoji_box: {
    alignItems: 'center',
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  event_emoji: {
    fontSize: 45,
  },
  event_item: {
    backgroundColor: "#FFF",
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    flexGrow: 4,
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  event_list_container: {
    alignSelf:'stretch',
    backgroundColor: "#C7F9FF",
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    marginBottom: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1
  },
  event_list: {
    flexGrow: 1
  },
  event_time: {
    fontFamily: "Inter_400Regular",
    fontSize: 10
  },
  event_time_proximity: {
    alignItems: 'center',
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    textAlign: "right",
  },
  group_title: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 35,
    paddingTop: 10
  },
  event_title: {
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  }
});
