import { StyleSheet } from 'react-native';
import { EVENT_PIC_HEIGHT, EVENT_PIC_WIDTH } from '../constants';

const EditEventStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.05)',
    flex: 1,
  },
  eventPicContainer: {
    marginBottom: 10,
    marginTop: 20,
  },
  eventPictureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  eventPicture: {
    borderColor: '#aaaaaa',
    borderWidth: 1,
    width: EVENT_PIC_WIDTH,
    height: EVENT_PIC_HEIGHT,
    borderRadius: EVENT_PIC_WIDTH / 2,
  },
  eventTitleContainer: {
    backgroundColor: '#ffff',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: '#aaaaaa',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20,
    paddingVertical: 15,
  },
  eventTitle: {
    color: 'black',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 30,
    paddingBottom: 10,
    paddingTop: 20,
    paddingLeft: 10,
  },
  eventDetailsEditContainer: {
    backgroundColor: '#ffff',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: '#aaaaaa',
    marginBottom: 20,
    marginTop: 20,
  },
  eventTime: {
    color: 'black',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    paddingLeft: 10,
    paddingVertical: 15,
  },
  eventUrl: {
    color: 'blue',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    paddingLeft: 10,
    paddingVertical: 15,
  },
  eventDescription: {
    color: 'black',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    paddingBottom: 40,
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  additionalFieldsContainer: {
    backgroundColor: '#ffff',
    borderColor: '#aaaaaa',
    borderWidth: 0.5,
    marginVertical: 20,
  },
  emojiContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 15,
  },
  eventEmojiText: {
    alignItems: 'center',
    color: 'gray',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    margin: 15,
  },
  emoji: {
    fontSize: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downThresholdText: {
    alignItems: 'center',
    color: 'gray',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    margin: 15,
    paddingTop: 20,
  },
  downThresholdSlider: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#90BEDE',
    borderColor: '#90BEDE',
    borderRadius: 30,
    borderWidth: 1,
    height: 75,
    width: 150,
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 30,
    color: 'white',
  },
});

export default EditEventStyles;
