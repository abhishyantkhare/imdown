import { StyleSheet } from "react-native"

const ButtonBottomSheetStyles = StyleSheet.create({
  headerTop: {
    overflow: 'hidden', 
    paddingTop: 5 
  },  
  headerBar: {
    alignSelf: "center",
    width: 100,
    height: 5,
    borderRadius: 2,
    backgroundColor: "#C4C4C4"
  },
  header: {
    height: 40, 
    backgroundColor:"white", 
    justifyContent: "center", 
    shadowColor: '#000', 
    shadowOffset: { width: 1, height: -1 }, 
    shadowOpacity:  0.4, 
    shadowRadius: 3, 
    elevation: 5,
  },
  body: {
    backgroundColor: "white", 
    height: "100%"
  }
})

export default ButtonBottomSheetStyles