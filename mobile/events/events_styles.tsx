import { StyleSheet } from "react-native";
export const event_styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  event_item_outer_box: {
    alignItems: 'center',
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  down_bar: {
    position: "absolute", 
    left: 0, 
    top: 0, 
    bottom: 0, 
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    opacity: .6, 
    paddingVertical: 20,
  },
  event_emoji_box: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  event_emoji: {
    fontSize: 45,
  },
  event_item: {
    flexGrow: 4,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  event_list_container: {
    alignSelf: 'stretch',
    backgroundColor: "rgba(52, 52, 52, 0.15)",
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    marginBottom: 150,
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
  },
  squad_code_container: {
    borderRadius: 15,
    borderColor: "#EEEEEE",
    borderWidth: 2,
    borderStyle: "solid",
    marginTop: 10
  },
  squad_code: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    display: "flex",
    flexDirection: "row"
  },
  squad_code_title_text: {
    color: "#CCCCCC",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 20
  },
  squad_code_value_text: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 20
  }
});
