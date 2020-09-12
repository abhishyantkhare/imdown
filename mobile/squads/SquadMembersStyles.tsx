import { StyleSheet } from "react-native";
export const SquadMembersStyles = StyleSheet.create({
  headerRight: {
    alignItems: "center",
    flexDirection: "row", 
    marginRight: 20 
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