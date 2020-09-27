import { StyleSheet } from 'react-native';

const AcceptedDeclinedStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },
  squadsMembersContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  userText: {
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 24,
    paddingTop: 10,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 24 / 2,
  },
});

export default AcceptedDeclinedStyles;
