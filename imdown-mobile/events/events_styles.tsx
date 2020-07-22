import { StyleSheet } from "react-native";
export const event_styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  event_item: {
    backgroundColor: "#FFF",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 15
  },
  event_list_container: {
    backgroundColor: "#EFEFEF",
    borderRadius: 15,
    padding: 20,
    marginTop: 30
  },
  event_list: {
    flexGrow: 0
  },
  group_title: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 35,
    paddingTop: 10
  },
  event_title: {
    fontFamily: "Inter_400Regular",
    fontSize: 15
  }
});
