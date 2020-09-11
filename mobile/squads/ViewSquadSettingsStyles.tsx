import { StyleSheet } from "react-native";
export const ViewSquadSettingsStyles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  squadTitleContainer: {
    backgroundColor: "#ffff",
    marginBottom: 20,
    marginTop: 20,
    paddingVertical: 15,
    paddingLeft: "10%"
  },
  emojiContainer: {
    backgroundColor: "#ffff",
    marginVertical: "5%",
    paddingLeft: "10%"
  },
  squadCodeContainer: {
    backgroundColor: "#ffff",
    marginVertical: "5%",
    paddingLeft: "10%"
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
  editSquadButtonImage2: {
    marginTop: -40,
    marginLeft: 300,
    height: 40,
    width: 40,
  },
  additionalActionContainer: {
    backgroundColor: "#ffff",
    marginHorizontal: "10%",
    marginVertical: 20,
  },
  additionalActionButton: {
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
  squadImageContainer: {
    alignSelf: "center",
    marginTop: "10%",
  },
  squadImage: {
    height: 200,
    width: 350,
  },
  squadAttributeName: {
    color:"#BEBEBE",
    marginBottom: "5%"
  },
  actionSectionImage: {
    height: 30, 
    width: 30
  },
  viewMembersText: {
    marginLeft: "3%"
  },
  leaveSquadText: {
    color:"#FC6E5E",
    marginLeft: "3%",
  },
  forwardArrowIcon: {
    height: 25, 
    width: 25, 
    position:"absolute", 
    right:0
  }
});