import { StyleSheet } from 'react-native';

const SquadMembersStyles = StyleSheet.create({
  squadsMembersContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },
  usersList: {
    height: '100%',
  },
  userText: {
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 24,
    paddingTop: 10,
  },
  userInfoView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 24 / 2,
  },
  deleteText: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  deleteBtn: {
    backgroundColor: 'red',
    right: 0,
  },
});

export default SquadMembersStyles;
