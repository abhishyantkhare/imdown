import { StyleSheet } from "react-native";
export const event_styles = StyleSheet.create({
  // All styles associated with header and header buttons
  headerRight: {
    alignItems: "center",
    flexDirection: "row", 
    marginRight: 20, 
    marginTop:20,
  },
  squadCodeContainer: {
    borderColor: "#84D3FF",
    borderRadius: 7.5,
    borderWidth: 2,
    borderStyle: "solid",
  },
  squadCodeValueText: {
    color: "#84D3FF",
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    margin: 5
  },
  squadSettingsButtonImage: {
    marginHorizontal: 10,
    height: 40,
    width: 40,
  },
  container: {
    backgroundColor: "#ffff",
    flexDirection: "column",
    flexGrow: 1,
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
    fontFamily: "SourceSansPro_700Bold",
    fontSize: 30,
    marginLeft: 20
  },
  squadTitleEmoji: {
    fontFamily: "SourceSansPro_700Bold",
    fontSize: 30
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
    shadowColor: 'rgba(0,0,0, .2)', // IOS
    shadowOffset: { height: 3, width: 3 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 5, //IOS
  },
  eventEmojiBox: {
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
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
    fontFamily: "Roboto_400Regular",
    fontSize: 20,
    marginBottom: 3,
    width: "80%"
  },
  eventTimeProximity: {
    alignItems: 'center',
    color: "#BEBEBE",
    fontFamily: "Roboto_400Regular",
    fontSize: 15
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
    height:"15%",
    justifyContent: "center"
  }
});
