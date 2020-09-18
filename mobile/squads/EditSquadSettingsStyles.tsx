import { StyleSheet } from 'react-native';

const EditSquadSettingsStyles = StyleSheet.create({
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
  },
  saveButton: {
    height: 50,
    width: 85,
  },
  container: {
    flex: 1,
  },
  viewableContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    paddingBottom: '10%',
  },
  squadImageContainer: {
    alignSelf: 'center',
    marginTop: '10%',
  },
  squadImage: {
    height: 200,
    width: 350,
  },
  uploadButtonContainer: {
    borderRadius: 5,
    bottom: 5,
    height: 40,
    width: 70,
    position: 'absolute',
    right: 5,
  },
  uploadButtonText: {
    color: '#ffffff',
  },
  squadAttributeName: {
    color: '#BEBEBE',
    marginBottom: '5%',
  },
  squadTitleContainer: {
    backgroundColor: '#ffff',
    marginVertical: '5%',
    marginHorizontal: '10%',
  },
  squadTitleTextInput: {
    borderColor: '#BEBEBE',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  emojiContainer: {
    backgroundColor: '#ffff',
    marginHorizontal: '10%',
    marginVertical: '5%',
  },
  emojiBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7EAF6',
    borderRadius: 5,
    height: 60,
    width: 60,
  },
  squadCodeContainer: {
    backgroundColor: '#ffff',
    marginLeft: '10%',
    marginVertical: '5%',
  },
  editMembersContainer: {
    backgroundColor: '#ffff',
    marginHorizontal: '10%',
    marginVertical: 20,
  },
  editMembersButton: {
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  editSquadButtonImage: {
    marginHorizontal: 10,
    height: 40,
    width: 40,
  },
  actionSectionImage: {
    height: 30,
    width: 30,
  },
  forwardArrowIcon: {
    height: 25,
    width: 25,
    position: 'absolute',
    right: 0,
  },
  editMembersText: {
    marginLeft: '3%',
  },
  deleteSquadButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FC6E5E',
    marginLeft: 0,
    marginTop: '15%',
    width: 150,
  },
  deleteSquadIcon: {
    height: 60,
    width: 60,
    marginBottom: '10%',
    marginTop: '20%',
  },
  deleteSquadModalTextContainer: {
    width: '80%',
  },
  deleteSquadModalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: '15%',
  },
  deleteSquadModalCancelButton: {
    backgroundColor: '#ffffff',
    borderColor: '#84D3FF',
    borderWidth: 2,
    width: 125,
  },
  deleteSquadModalDeleteButton: {
    backgroundColor: '#FC6E5E',
    width: 125,
  },
});

export default EditSquadSettingsStyles;
