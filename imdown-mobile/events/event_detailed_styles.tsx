import { StyleSheet } from "react-native";
export const EventDetailedStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
//   styles for event title + pic + event details box
  event_pic_and_title_container: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20,
  },
  event_title_container: {
    flexGrow: 2,
  },
  event_picture: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  event_title: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 20,
    paddingLeft: 10,
  },
  event_description: {
    color: "#9C9C9C",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    paddingLeft: 10,
    paddingVertical: 40,
  },
  event_time: {
    color: "#9C9C9C",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    paddingLeft: 10,
    paddingTop: 10,
  },
  event_url: {
    color: "#9C9C9C",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    paddingTop: 5,
    paddingLeft: 10,
    textDecorationLine: 'underline'
  },

//   styles for list of users who are down for event
  down_list_outer_container: {
    flexDirection: 'row',
    flexGrow: 1,
    marginBottom: 20,
    marginTop: 20,
  },
  down_list_inner_container: {
    marginTop: 25,
    flexGrow: 5,
  },
  down_list_emoji: {
    alignItems: 'center',
    flexGrow: 1,
    paddingTop: 20
  },
  down_list_title: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 30,
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 10,
  },
  rsvp_user: {
    color: "#9C9C9C",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    paddingLeft: 20,
    paddingVertical: 2
  },
//   styles for row of buttons on bottom
  button_row_container: {
    flexDirection: 'row',
    marginBottom: 40,
    marginTop: 20,
  },
  delete_event_container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  decline_rsvp_container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  edit_event_container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  button_row_text: {
    alignItems: 'center',
    color: "#9C9C9C",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 15,
    justifyContent: 'center',
    paddingVertical: 7
  }
});
