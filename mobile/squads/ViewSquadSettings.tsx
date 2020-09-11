import React, { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, _View } from "react-native";
import { ViewSquadSettingsStyles } from "./ViewSquadSettingsStyles";
import Divider from '../components/divider/divider'
import { callBackend } from "../backend/backend"
import { TextStyles } from "../TextStyles";
import { useFocusEffect } from "@react-navigation/native";

const ViewSquadSettings = (props) => {
    const [squadId, setSquadId] = useState(props.route.params.squadId);
    const [squadName, setSquadName] = useState(props.route.params.squadName);
    const [squadEmoji, setSquadEmoji] = useState(props.route.params.squadEmoji);
    const [squadCode, setSquadCode] = useState(props.route.params.squadCode);
    const [squadImage, setSquadImage] = useState(props.route.params.squadImage);

 
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
            setSquadName(data.name)
            setSquadEmoji(data.squad_emoji)
            setSquadImage(data.image)
            props.navigation.setOptions({
                headerRight: () => (
                <View style={ViewSquadSettingsStyles.headerRight}>
                    { renderSquadSettingsButton(squadId, data.name, data.squad_emoji, data.image) }
                </View>
                ),
            });
        });
    }

    useFocusEffect(useCallback(getSquadDetails, []))


    const goToEditSquad = (squadId: number, squadName: string, squadEmoji: string, squadImage: string) => {
        props.navigation.navigate("Edit Squad", {
            squadId: squadId,
            squadName: squadName,
            squadEmoji: squadEmoji,
            squadCode: squadCode,
            squadImage: squadImage
        });
    } 

    const renderSquadSettingsButton = (squadId: number, squadName: string, squadEmoji: string, squadImage: string) => {
        return (
            <TouchableOpacity onPress={() => goToEditSquad(squadId, squadName, squadEmoji, squadImage)} style={ViewSquadSettingsStyles.editSquadButtonImage} >
                <Image source={require('../assets/pencil_button.png')} style={ViewSquadSettingsStyles.editSquadButtonImage} />
            </TouchableOpacity>
        );
      }
    
    const renderSquadImage = () => {
        return(
            <View style = {ViewSquadSettingsStyles.squadImageContainer}>
            { squadImage &&  <Image source={{ uri: squadImage }} style = {ViewSquadSettingsStyles.squadImage} /> }
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
        props.navigation.navigate("Edit Squad Members", {
            squadId: squadId,
            isInEditView: false
        });
      }
    
    const renderActionsSection = () => {
        return (
          <View style={ViewSquadSettingsStyles.additionalActionContainer}>
            { Divider() }
            <TouchableOpacity style={ViewSquadSettingsStyles.additionalActionButton} onPress={goToViewSquadMembers}>
              <Image source={require('../assets/user_button.png')} style={ViewSquadSettingsStyles.actionSectionImage} />
              <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.viewMembersText]}>View members</Text>
              <Image source={require('../assets/arrow_forward_gray.png')} style={ViewSquadSettingsStyles.forwardArrowIcon} />
            </TouchableOpacity>
            { Divider() }
            <TouchableOpacity style={ViewSquadSettingsStyles.additionalActionButton}>
              <Image source={require('../assets/exit_icon.png')} style={ViewSquadSettingsStyles.actionSectionImage} />
              <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.leaveSquadText]}>Leave squad</Text>
              <Image source={require('../assets/arrow_forward_gray.png')} style={ViewSquadSettingsStyles.forwardArrowIcon} />
            </TouchableOpacity>
            { Divider() }
            {/* <View style={{height: 1.5, backgroundColor: "#BEBEBE"}}></View> */}
          </View>
      );
    }



    return (
        <ScrollView style={ViewSquadSettingsStyles.container} >
            {renderSquadImage()}
            {renderSquadTitleSection()}
            {renderEmojiSection()}
            {renderSquadCodeSection()}
            {renderActionsSection()}
        </ScrollView>
    );
}

export default ViewSquadSettings;
