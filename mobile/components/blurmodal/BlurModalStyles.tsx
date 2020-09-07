import { StyleSheet } from "react-native"

const BlurModalStyles = StyleSheet.create({
    modalBackgroundBlur: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'rgba(100,100,100, 0.5)',
        flex: 1,
    },
    modalVisibleContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 10,
        width: "80%"
    },
    exitButtonContainer: {
        marginBottom: 25,
        marginTop: 25,
        marginHorizontal: 20,
    },
    exitButton: {
        alignSelf: 'flex-end',
        height: 40,
        width: 40,
    },
})

export default BlurModalStyles