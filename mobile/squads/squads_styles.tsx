import { StyleSheet } from "react-native";
export const squad_styles = StyleSheet.create({
  squads_container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  searchButtonContainer: {
    justifyContent: 'flex-end',
    marginRight: "10%",
    marginTop: 20,
  },
  searchButtonIcon: {
    alignSelf: 'flex-end',
    height: 40,
    width: 40,
  },
  squadsTitleContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: "10%",
    marginBottom: 35,
    marginTop: 40,
  },
  squadsTitleText: {
    color: "#84D3FF",
    fontFamily: "SourceSansPro_700Bold",
    fontSize: 40,
  },
  addSquadContainer: {
    justifyContent: 'flex-end'
  },
  addSquadButton: {
    alignSelf: 'flex-end',
    height: 40,
    width: 40,
  },
  modalBackgroundBlur: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(100,100,100, 0.5)',
    flex:1, 
  },
  modalVisibleContainer: {
    backgroundColor: "white",
    borderRadius: 10, 
    justifyContent:"center",
    width:"80%", 
    paddingHorizontal: "5%"
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
  squad_item: {
    flex: 1,
    paddingBottom: 15,
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  squad_text: {
    color: "#333333",
    fontFamily: "SourceSansPro_400Regular",
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
    borderBottomRightRadius: 10
  },
  noSquadViewWave: {
    fontSize: 50,
    marginBottom: 50,
    marginTop: 50,
    marginLeft: "10%"
  },
  noSquadViewText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 20,
    marginBottom: 50,
    marginHorizontal: "10%"
  },
});
