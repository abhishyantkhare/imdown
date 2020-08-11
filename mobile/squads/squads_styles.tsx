import { StyleSheet } from "react-native";
export const squad_styles = StyleSheet.create({
  squads_container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    paddingLeft: 50,
    justifyContent: "center"
  },
  squad_item: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  squad_text: {
    color: "#90BEDE",
    fontFamily: "Ubuntu_700Bold",
    fontSize: 32
  },
  deleteText: {
    color: '#FFF',
  },
  rowFront: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      
  },
  rowBack: {
      alignItems: 'center',
      backgroundColor: '#fff',
      flex: 1,
      flexDirection: 'row',
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
      right: 75,
  },
  deleteBtn: {
      backgroundColor: 'red',
      right: 0,
  },
});
