import { StyleSheet } from "react-native";
export const SquadMembersStyles = StyleSheet.create({
  headerRight: {
    alignItems: "center",
    flexDirection: "row", 
    marginRight: 20 
  },
  editToggle: {
    height: 50,
    width: 85
  },
  titleText: {
    color: "#84D3FF",
    marginBottom: "10%",
    marginLeft: "10%"
  },
  squadsMembersContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20
  },
  userInfoView: {
    marginLeft: "10%",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  deleteIcon: {
    height: 25,
    width: 25
  },
  userImage: {
    width: 30, 
    height: 30,
    borderRadius: 24/2
  }
});