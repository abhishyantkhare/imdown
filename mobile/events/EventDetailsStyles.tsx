import { StyleSheet } from 'react-native';

const EventDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
    marginTop: 20,
  },
  editEventContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },

  // styles for event image
  eventImageContainer: {
    marginTop: 20,
  },
  eventPicture: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  eventImage: {
    height: 200,
    width: 400,
  },

  // styles for Event name, emoji
  eventScheduledNoticeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#84D3FF',
    width: '80%',
    padding: 20,
    backgroundColor: '#84D3FF',
    marginBottom: 20,
  },
  eventExpiredNoticeTextContainer: {
    paddingLeft: 10,
  },
  eventExpiredNoticeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#BEBEBE',
    width: '80%',
    padding: 20,
    backgroundColor: '#BEBEBE',
    marginBottom: 20,
  },
  eventNoticeTextContainer: {
    paddingLeft: 10,
  },
  eventNoticeHeader: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SourceSansPro_700Bold',
  },
  eventNoticeText: {
    color: 'white',
    fontSize: 15,
    paddingTop: 5,
    fontFamily: 'Roboto_400Regular',
  },
  eventNameEmojiContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  eventNameAcceptedDeclinedContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingBottom: 20,
  },

  // styles for accepted/declined container#
  acceptedDeclinedText: {
    color: 'black',
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    paddingTop: 10,
  },
  acceptedDeclinedNumber: {
    color: '#84D3FF',
    fontFamily: 'SourceSansPro_700Bold',
    fontSize: 30,
  },
  acceptedDeclinedButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#84D3FF',
    width: '60%',
    padding: 10,
    backgroundColor: 'white',
  },

  // styles for event description
  eventDescriptionAbout: {
    color: '#9C9C9C',
    fontFamily: 'Roboto_400Regular',
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  eventDescriptionContainer: {
    flexDirection: 'column',
    alignContent: 'flex-start',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingTop: 20,
  },

  // styles for event time, address, and down threshold
  otherEventDetailsContainer: {
    flexDirection: 'column',
    alignContent: 'flex-start',
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  eventTime: {
    color: 'black',
    fontFamily: 'Roboto_400Regular',
    fontSize: 20,
    paddingLeft: 10,
  },
  downThresholdText: {
    color: 'black',
    fontFamily: 'Roboto_400Regular',
    fontSize: 20,
    paddingLeft: 10,
  },

  // styles for buton row
  acceptDeclineButtonText: {
    fontSize: 20,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 20,
    marginLeft: 20,
  },
  acceptButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#84D3FF',
    width: 120,
    height: 60,
  },
  declineButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#FC6E5E',
    width: 120,
    height: 60,
    marginRight: 80,
  },
});

export default EventDetailsStyles;
