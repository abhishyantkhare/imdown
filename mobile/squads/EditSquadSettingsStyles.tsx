import { StyleSheet } from "react-native";
export const EditSquadSettingsStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewableContainer: {
    backgroundColor: "#ffffff",
    flex: 1
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
    position:"absolute",
    right: 5
  },
  uploadButtonText: {
    color: "#ffffff"
  },
  squadAttributeName: {
    color:"#BEBEBE",
    marginBottom: "5%"
  },
  squadTitleContainer: {
    backgroundColor: "#ffff",
    marginVertical: "5%",
    marginHorizontal: "10%",
  },
  squadTitleTextInput: {
    borderColor:"#BEBEBE", 
    borderRadius: 5,
    borderWidth: 1, 
    paddingHorizontal:20,  
    paddingVertical:20, 
  },
  emojiContainer: {
    backgroundColor: "#ffff",
    marginHorizontal: "10%",
    marginVertical: "5%",
  },
  squadCodeContainer: {
    backgroundColor: "#ffff",
    marginLeft: "10%",
    marginVertical: "5%"
  },
  editMembersContainer: {
    backgroundColor: "#ffff",
    marginHorizontal: "10%",
    marginVertical: 20,
  },
  editMembersButton: {
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
  headerRight: {
    alignItems: "center",
    flexDirection: "row", 
    marginRight: 20 
  },
  editSquadButtonImage: {
    marginHorizontal: 10,
    height: 40,
    width: 40,
  },
  emojiBox: {
    alignItems:"center", 
    justifyContent:"center", 
    backgroundColor:"#E7EAF6", 
    borderRadius: 5,
    height:60,
    width:60, 
  },
  squadImageContainer: {
    alignSelf: "center",
    marginTop: "10%",
  },
  actionSectionImage: {
    height: 30, 
    width: 30
  },
  forwardArrowIcon: {
    height: 25, 
    width: 25, 
    position:"absolute", 
    right:0
  },
  editMembersText: {
    marginLeft: "3%"
  },
});

