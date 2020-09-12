import React, { useCallback, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, _View } from "react-native";
import { ViewSquadSettingsStyles } from "./ViewSquadSettingsStyles";
import Divider from '../components/divider/divider'
import { callBackend, deleteUser } from "../backend/backend"
import { TextStyles } from "../TextStyles";
import { useFocusEffect } from "@react-navigation/native";
import BlurModal from "../components/blurmodal/BlurModal"
import { StandardButton } from "../components/button/Button"

const ViewSquadSettings = (props) => {
    const userId = props.route.params.userId;
    const [squadId, setSquadId] = useState(props.route.params.squadId);
    const [squadAdminId, setSquadAdminId] = useState();
    const [squadName, setSquadName] = useState(props.route.params.squadName);
    const [squadEmoji, setSquadEmoji] = useState(props.route.params.squadEmoji);
    const [squadCode, setSquadCode] = useState(props.route.params.squadCode);
    const [squadImage, setSquadImage] = useState(props.route.params.squadImage);
    const [leaveSquadModalVisible, setLeaveSquadModalVisible] = useState(false);

    const getSquadDetails = () => {
        const endpoint = 'get_squad?squad_id=' + squadId
        const init: RequestInit = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
        }
        callBackend(endpoint, init).then(response => {
          return response.json();
        }).then(data => {
            setSquadAdminId(data.admin_id)
            setSquadName(data.name)
            setSquadEmoji(data.squad_emoji)
            setSquadImage(data.image)
            props.navigation.setOptions({
                headerRight: () => (
                <View style={ViewSquadSettingsStyles.headerRight}>
                    { renderEditSquadSettingsButton(squadId, data.name, data.squad_emoji, data.image, data.admin_id) }
                </View>
                ),
            });
        });
    }

    useFocusEffect(useCallback(getSquadDetails, []))

    const goToEditSquad = (squadId: number, squadName: string, squadEmoji: string, squadImage: string, squadAdminId: number) => {
        props.navigation.navigate("Edit Squad Settings", {
            squadId: squadId,
            squadAdminId: squadAdminId,
            squadName: squadName,
            squadEmoji: squadEmoji,
            squadCode: squadCode,
            squadImage: squadImage,
            userId: userId
        });
    } 

    const renderEditSquadSettingsButton = (squadId: number, squadName: string, squadEmoji: string, squadImage: string, squadAdminId: number) => {
        return (
            <TouchableOpacity onPress={() => goToEditSquad(squadId, squadName, squadEmoji, squadImage, squadAdminId)} style={ViewSquadSettingsStyles.editSquadButtonImage} >
                <Image source={require('../assets/pencil_button.png')} style={ViewSquadSettingsStyles.editSquadButtonImage} />
            </TouchableOpacity>
        );
      }
    
    const renderSquadImage = () => {
        return(
            <View style = {ViewSquadSettingsStyles.squadImageContainer}>
            { squadImage ? <Image source={{ uri: squadImage }} style = {ViewSquadSettingsStyles.squadImage} /> : <View></View> }
            </View> 
        )
    };

    const renderSquadTitleSection = () => {
        return (
            <View style={ViewSquadSettingsStyles.squadTitleContainer}>
                <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.squadAttributeName]}>Name</Text>
                <Text style={[TextStyles.paragraph]}>{squadName}</Text>
            </View>
        );
    }

    const renderEmojiSection = () => {
        return (
            <View style={ViewSquadSettingsStyles.emojiContainer}>
                <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.squadAttributeName]}>Emoji</Text>
                <Text style={{fontSize: 40}}>{squadEmoji}</Text>
            </View>
        );
    }

    const renderSquadCodeSection = () => {
        return (
            <View style={ViewSquadSettingsStyles.squadCodeContainer}>
                <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.squadAttributeName]}>Code</Text>
                <Text style={[TextStyles.paragraph]}>{squadCode}</Text>
            </View>
        );
    }

    const goToViewSquadMembers = () => {
        props.navigation.navigate("Squad Members", {
            userId: userId,
            squadId: squadId,
            isInEditView: false
        });
      }
    
    const renderActionsSection = () => {
        return (
          <View style={ViewSquadSettingsStyles.additionalActionContainer}>
            <Divider />
            <TouchableOpacity style={ViewSquadSettingsStyles.additionalActionButton} onPress={goToViewSquadMembers}>
              <Image source={require('../assets/user_button.png')} style={ViewSquadSettingsStyles.actionSectionImage} />
              <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.viewMembersText]}>View members</Text>
              <Image source={require('../assets/arrow_forward_gray.png')} style={ViewSquadSettingsStyles.forwardArrowIcon} />
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity style={ViewSquadSettingsStyles.additionalActionButton} onPress={() => setLeaveSquadModalVisible(true)} >
              <Image source={require('../assets/exit_icon.png')} style={ViewSquadSettingsStyles.actionSectionImage} />
              <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.leaveSquadText]}>Leave squad</Text>
              <Image source={require('../assets/arrow_forward_gray.png')} style={ViewSquadSettingsStyles.forwardArrowIcon} />
            </TouchableOpacity>
            <Divider />
          </View>
      );
    }

    const renderLeaveSquadModel = () => {
        return (
            <BlurModal visible={leaveSquadModalVisible}>
                <Image source={require('../assets/exit_icon.png')} style={ViewSquadSettingsStyles.leaveSquadIcon} />
                <Text style={[TextStyles.paragraph, {textAlign: "center"}]}>{`Are you sure you want to leave this squad? You can always \n re-join with the squad code.`}</Text>
                <View style={ViewSquadSettingsStyles.leaveSquadModalButtonRow}>
                    <StandardButton text="Cancel" override_style={ViewSquadSettingsStyles.leaveSquadModalCancelButton} text_override_style={{color:"#84D3FF"}} onPress={() => { setLeaveSquadModalVisible(false) }} />
                    <StandardButton text="Leave" override_style={ViewSquadSettingsStyles.leaveSquadModalLeaveButton} onPress={() => { deleteUser(userId, squadId).then(data => { props.navigation.navigate("Squads") }) }} />
                </View>
            </BlurModal>
        );
    }

    return (
        <ScrollView style={ViewSquadSettingsStyles.container} >
            {renderSquadImage()}
            {renderSquadTitleSection()}
            {renderEmojiSection()}
            {renderSquadCodeSection()}
            {renderActionsSection()}
            {renderLeaveSquadModel()}
        </ScrollView>
    );
}

export default ViewSquadSettings;
