import { StyleSheet } from "react-native";
export const AddSquadStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  add_container: {
    marginTop: "50%",
    alignItems: "center",
    flexDirection: "column",
  },
  add_title: {
    fontFamily: "Roboto_400Regular",
    fontSize: 20,
    paddingBottom: 60
  },
  or_text: {
    paddingVertical: 20,
    fontFamily: "Ubuntu_700Bold",
    fontSize: 30,
  },
  emoji_and_squad_name_container: {
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emojiBox: {
    alignItems:"center", 
    justifyContent:"center", 
    backgroundColor:"#E7EAF6", 
    borderRadius: 5,
    height:60,
    width:60, 
  },
  emoji: {
    fontSize: 40,
    alignItems: "center",
    justifyContent: "center",
    width: 45,
  },
  add_squad_button: {
    backgroundColor: "#90BEDE",
    borderWidth: 10,
    borderRadius: 20,
    borderColor: "#90BEDE",
    padding: 5,
    justifyContent: "center"
  },
  add_squad_text: {
    fontFamily: "Ubuntu_700Bold",
    color: "white",
    fontSize: 18
  },
  squad_emoji: {
    alignSelf: "center"
  },
  squadCodeText: {
    margin: 15,
    borderColor: "white",
    borderBottomColor: "#BEBEBE",
    borderWidth: 1,
    color: "#333333",
    fontFamily: "SourceSansPro_700Bold",
    fontSize: 60,
    textAlign: "center",
    width: 300,
  },
  squadNameText: {
    borderColor: "white",
    color: "#333333",
    fontFamily: "SourceSansPro_700Bold",
    fontSize: 30,
    marginTop: 30,
    textAlign: "left",
    width: 300,
  },
  modalBackgroundBlur: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(100,100,100, 0.5)',
    flex:1, 
  },
  modalVisibleContainer: {
    alignItems: "center",
    justifyContent:"center",
    backgroundColor: "white",
    borderRadius: 10, 
    width: "80%"
  },
  successIcon: {
    height: 60,
    width: 60,
    marginBottom: 15,
    marginTop: 40
  },
  successText: {
    fontFamily: "SourceSansPro_700Bold",
    fontSize: 25,
    color: "#84D3FF",
    marginBottom: 20,
    textAlign: "center", 
  },
  squadCreateModalText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center", 
    width: 250,
  },
  squadCodeValueText: {
    color: "#84D3FF",
    fontFamily: "SourceSansPro_700Bold",
    fontSize: 30,
    margin: 10
  },
  squadCodeContainer: {
    borderRadius: 15,
    borderColor: "#84D3FF",
    borderWidth: 2,
    borderStyle: "solid",
    marginBottom: 50,
    marginTop: 20
  },
});
