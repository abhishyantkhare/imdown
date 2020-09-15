import { StyleSheet } from 'react-native';

const EditSquadStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.05)',
    flex: 1,
  },
  squadTitleContainer: {
    backgroundColor: '#ffff',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: '#aaaaaa',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20,
    paddingVertical: 15,
  },
  squadTitle: {
    color: 'black',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 30,
    paddingBottom: 10,
    paddingTop: 20,
    paddingLeft: 10,
  },
  emojiContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  squadEmojiText: {
    alignItems: 'center',
    color: 'gray',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 15,
    margin: 15,
    paddingVertical: 15,
  },
  emoji: {
    fontSize: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiPickerContainer: {
    paddingTop: 60,
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
  additionalFieldsContainer: {
    backgroundColor: '#ffff',
    borderColor: '#aaaaaa',
    borderWidth: 0.5,
    marginVertical: 20,
  },
});

export default EditSquadStyles;
