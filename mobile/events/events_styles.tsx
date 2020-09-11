import { StyleSheet } from "react-native";
export const event_styles = StyleSheet.create({
  // All styles associated with header and header buttons
  headerRight: {
    alignItems: "center",
    flexDirection: "row", 
    marginRight: 20 
  },
  squadCodeContainer: {
    borderColor: "#84D3FF",
    borderRadius: 7.5,
    borderWidth: 2,
    borderStyle: "solid",
    flexDirection: "row"
  },
  squadCodeDescriptionText: {
    color: "#84D3FF",
    marginVertical: 5,
    marginLeft: 5
  },
  squadCodeValueText: {
    color: "#84D3FF",
    marginVertical: 5,
    marginRight: 5
  },
  squadSettingsButtonImage: {
    marginHorizontal: 10,
    height: 40,
    width: 40,
  },
  container: {
    flex:1
  },
  scrollViewContainer: {
    backgroundColor: "#ffff",
    flexDirection: "column",
    flexGrow: 1,
  },
  squadImageContainer: {
    marginTop: "10%"
  },
  squadImage: {
    height: 200,
    width: 350,
  },
  squadNameEmojiContainer: {
    alignSelf: "flex-start",
    flexDirection: 'row', 
    marginHorizontal: "10%",
    marginTop: 20
  },
  squadTitleName: {
    marginLeft: 20
  },
  eventListContainer: {
    alignSelf: 'stretch',
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 0
  },
  eventList: {
    paddingHorizontal: 20,
    flex:1,
  },
  // All styles for event item in events list
  eventItemOuterBox: {
    backgroundColor: "white",
    borderRadius: 5,
    flexGrow: 1,
    height: 140,
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
    elevation: 2, // Android
    shadowColor: 'rgba(0,0,0, .2)', // IOS
    shadowOffset: { height: 3, width: 3 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 5, //IOS
  },
  eventEmojiBox: {
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  eventEmoji: {
    fontSize: 45,
  },
  eventItem: {
    flexGrow: 4,
    paddingHorizontal: 10,
    paddingTop: 20,
    width: '70%',
  },
  eventTitle: {
    marginBottom: 3,
    width: "80%"
  },
  eventTimeProximity: {
    alignItems: 'center',
    color: "#BEBEBE"
  },
  forwardArrowIcon: {
    alignSelf:"flex-end",
    height: 25, 
    width: 25, 
    position:"absolute",
    right: 20, 
    top: 30, 
  },
  downBarSectionContainer: {
    alignItems: "center", 
    justifyContent:"space-evenly", 
    flexDirection:"row", 
    height:"40%"
  },
  downBarContainer: { 
    height:30, 
    width: "80%", 
    justifyContent:'center'
  },
  downBarEmpty: {
    backgroundColor: "#E7EAF6",
    borderRadius: 5,
    height: 5,
    width: "100%",
    opacity: .6, 
    position: "absolute",
  },
  downBarFilled: {
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    height: 5,
    position: "absolute",
    zIndex: 1
  },
  downThresholdReachedContainer: {
    height:25, 
    width: 25
  },
  downThresholdReachedIcon: {
    height:25, 
    width: 25
  },
  addEventButtonContainer: {
    backgroundColor: "white", 
    borderColor: "#BEBEBE", 
    borderTopWidth:2, 
    elevation: 5,
    height:"15%",
    justifyContent: "center",
    shadowColor: '#000', 
    shadowOffset: { width: 1, height: -1 }, 
    shadowOpacity:  0.4, 
    shadowRadius: 3, 
  }
});
