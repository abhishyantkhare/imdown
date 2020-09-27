import { StyleSheet } from "react-native";
export const AcceptedDeclinedStyles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 20,
    },
    squads_members_container: {
        flexDirection: "row",
        alignContent: 'center',
        alignItems: 'center',
        marginLeft: 20
    },
    users_list: {
        height: "100%"
    },
    user_text: {
        fontFamily: "Ubuntu_400Regular",
        fontSize: 24,
        paddingTop: 10
    },
    user_info_view: {
        flexDirection: "row",
        alignItems: "center",
    },
    user_image: {
        width: 30, 
        height: 30,
        borderRadius: 24/2
    },
});
