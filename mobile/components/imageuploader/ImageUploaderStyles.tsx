import { StyleSheet } from "react-native"

const ImageUploaderStyles = StyleSheet.create({
    imageUploadBox: {
        width: "100%",
        height: 75,
        borderColor: "#84D3FF",
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 5,
        justifyContent: "center"
    },
    uploadLabelRow: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "5%",
        alignItems: "center"
    }
})

export default ImageUploaderStyles