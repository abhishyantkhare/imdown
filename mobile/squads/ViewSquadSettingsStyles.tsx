import { StyleSheet } from 'react-native';
export const ViewSquadSettingsStyles = StyleSheet.create({
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row', 
    marginRight: 20,
  },
  editSquadButtonImage: {
    marginHorizontal: 10,
    height: 40,
    width: 40,
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  squadImageContainer: {
    alignSelf: 'center',
    marginTop: '10%',
  },
  squadImage: {
    height: 200,
    width: 350,
  },
  squadAttributeName: {
    color:'#BEBEBE',
    marginBottom: '5%',
  },
  squadTitleContainer: {
    backgroundColor: '#ffff',
    marginBottom: 20,
    marginTop: 20,
    paddingVertical: 15,
    paddingLeft: '10%',
  },
  emojiContainer: {
    backgroundColor: '#ffff',
    marginVertical: '5%',
    paddingLeft: '10%',
  },
  squadCodeContainer: {
    backgroundColor: '#ffff',
    marginVertical: '5%',
    paddingLeft: '10%',
  },
  additionalActionContainer: {
    backgroundColor: '#ffff',
    marginHorizontal: '10%',
    marginVertical: 20,
  },
  additionalActionButton: {
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  actionSectionImage: {
    height: 30, 
    width: 30,
  },
  viewMembersText: {
    marginLeft: '3%',
  },
  forwardArrowIcon: {
    height: 25, 
    width: 25, 
    position:'absolute', 
    right:0,
  },
  leaveSquadIcon: {
    height: 60,
    width: 60,
    marginBottom: '10%',
    marginTop: '20%',
  },
  leaveSquadText: {
    color:'#FC6E5E',
    marginLeft: '3%',
  },
  leaveSquadModalButtonRow: {
    flexDirection: 'row',
    justifyContent:'space-around',
    marginVertical: '15%',
  },
  leaveSquadModalCancelButton: {
    backgroundColor: '#ffffff', 
    borderColor: '#84D3FF', 
    borderWidth: 2,
    width: 125,
  },
  leaveSquadModalLeaveButton: {
    backgroundColor: '#FC6E5E',
    width: 125,
  },
});
