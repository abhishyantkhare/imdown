import { StyleSheet } from 'react-native';

const SquadsStyles = StyleSheet.create({
  squadsContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  searchButtonContainer: {
    justifyContent: 'flex-end',
    marginRight: '10%',
    marginTop: 20,
  },
  searchButtonIcon: {
    alignSelf: 'flex-end',
    height: 40,
    width: 40,
  },
  squadsTitleContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: '10%',
    marginBottom: 35,
    marginTop: 40,
  },
  squadsTitleText: {
    color: '#84D3FF',
  },
  addSquadContainer: {
    justifyContent: 'flex-end',
  },
  addSquadButton: {
    alignSelf: 'flex-end',
    height: 40,
    width: 40,
  },
  exitButtonContainer: {
    marginBottom: 25,
    marginTop: 25,
    marginHorizontal: 20,
  },
  exitButton: {
    alignSelf: 'flex-end',
    height: 40,
    width: 40,
  },
  squadItem: {
    flex: 1,
    paddingBottom: 15,
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  squadText: {
    color: '#333333',
    fontFamily: 'SourceSansPro_400Regular',
    fontSize: 25,
    paddingLeft: 20,
  },
  deleteText: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#E7EAF6',
    borderRadius: 10,
    justifyContent: 'center',
    marginHorizontal: 40,
    marginVertical: 7.5,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 40,
    marginVertical: 7.5,
    paddingLeft: 15,
  },
  editText: {
    color: '#FFF',
  },
  backRightBtns: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  editBtn: {
    backgroundColor: 'blue',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    right: 75,
  },
  deleteBtn: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  noSquadViewWave: {
    fontSize: 50,
    marginBottom: 50,
    marginTop: 50,
    marginLeft: '10%',
  },
  noSquadViewText: {
    marginBottom: 50,
    marginHorizontal: '10%',
  },
});

export default SquadsStyles;
