import { StyleSheet } from "react-native";

export const EmojiPickerStyles = StyleSheet.create({
    emoji: {
        fontSize: 40,
        alignItems: "center",
        justifyContent: "center",
        width: 45,
    },
    modalContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    headerContainer: {
        flex: .05,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    titleContainer: {
        flex: 1
    },
    titleText: {
        fontSize: 20,
        fontFamily: "Ubuntu_700Bold",
    },
    buttonContainer: {
        flex: .6,
    },
    emojiPicker: {
        flex: .95,
        marginTop: "5%"
    },
    emojiContainer: {
        height: 55,
        width: 55,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "#E7EAF6"
    }
})