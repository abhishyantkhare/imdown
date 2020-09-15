import { StyleSheet } from 'react-native';

const EventDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  // styles for event title + pic + event details box
  eventPicAndTitleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20,
  },
  eventTitleContainer: {
    flexGrow: 2,
  },
  eventPicture: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 20,
    paddingLeft: 10,
  },
  eventDescription: {
    color: '#9C9C9C',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 40,
  },
  eventTime: {
    color: '#9C9C9C',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    paddingLeft: 10,
  },
  eventUrl: {
    color: '#9C9C9C',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    paddingTop: 5,
    paddingLeft: 10,
    textDecorationLine: 'underline',
  },

  // styles for list of users who are down for event
  downThresholdText: {
    color: '#9C9C9C',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    paddingLeft: 10,
    paddingTop: 30,
  },
  downListOuterContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    marginBottom: 20,
    marginTop: 20,
  },
  downListInnerContainer: {
    marginTop: 25,
    flexGrow: 5,
  },
  downListEmoji: {
    alignItems: 'center',
    flexGrow: 1,
    paddingTop: 20,
  },
  downListTitle: {
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 30,
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 10,
  },
  rsvpUser: {
    color: '#9C9C9C',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    paddingLeft: 20,
    paddingVertical: 2,
  },
  // styles for row of buttons on bottom
  buttonRowContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    marginTop: 20,
  },
  deleteEventContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  rsvpButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  editEventContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  buttonRowText: {
    alignItems: 'center',
    color: '#9C9C9C',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    justifyContent: 'center',
    paddingVertical: 7,
  },
});

export default EventDetailsStyles;
