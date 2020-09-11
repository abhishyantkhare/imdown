import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, _View } from "react-native";
import { EditSquadSettingsStyles } from "./EditSquadSettingsStyles";
import EmojiPicker from "../components/emojipicker/EmojiPicker";
import Divider from '../components/divider/divider'
import { callBackend, deleteRequest } from "../backend/backend"
import { TextStyles } from "../TextStyles";
import { StandardButton } from "../components/button/Button";
import { StandardButtonStyles } from "../components/button/ButtonStyles";
import ImageUploader  from "../components/imageuploader/ImageUploader"
import BlurModal from "../components/blurmodal/BlurModal"
import ImagePlaceholder from "../components/imageplaceholder/ImagePlaceholder";

const EditSquadSettings = (props) => {
  const userId = props.route.params.userId;
  const squadId = props.route.params.squadId;
  const squadAdminId = props.route.params.squadAdminId;
  const [squadName, setSquadName] = useState(props.route.params.squadName);
  const [squadEmoji, setSquadEmoji] = useState(props.route.params.squadEmoji);
  const [squadCode, setSquadCode] = useState(props.route.params.squadCode);
  const [squadImage, setSquadImage] = useState(props.route.params.squadImage);
  const [deleteSquadModalVisible, setDeleteSquadModalVisible] = useState(false);

  const renderSaveButton = () => {
    return (
      <StandardButton text="Save" override_style={EditSquadSettingsStyles.saveButton} onPress={() => saveSquad()} />
    );
  }

  const renderHeaderSaveButton = () => {
    props.navigation.setOptions({
      headerRight: () => (
      <View style={EditSquadSettingsStyles.headerRight}>
          {renderSaveButton()}
      </View>
      ),
  });
  }

  const renderSquadImage = () => {
    return(
      <View style = {EditSquadSettingsStyles.squadImageContainer}>
        { squadImage ?  <Image source={{ uri: squadImage }} style = {EditSquadSettingsStyles.squadImage} /> : <ImagePlaceholder style={EditSquadSettingsStyles.squadImage}/> }
        <ImageUploader image={squadImage} imageWidth={350} imageHeight={200} onImagePicked={setSquadImage} touchableStyle={[StandardButtonStyles.button, EditSquadSettingsStyles.uploadButtonContainer]}>
          <Text style={[TextStyles.secondary, EditSquadSettingsStyles.uploadButtonText]}>{squadImage ? `Replace` : `Upload`}</Text>
        </ImageUploader>
      </View> 
    )
  };


  const renderSquadTitleSection = () => {
      return (
          <View style={EditSquadSettingsStyles.squadTitleContainer}>
              <Text style={[TextStyles.paragraph, EditSquadSettingsStyles.squadAttributeName]}>Name</Text>
              <TextInput style={[TextStyles.paragraph, EditSquadSettingsStyles.squadTitleTextInput ]} 
                          clearButtonMode="always" editable={true} placeholder="Squad Name" value={squadName} 
                          onChangeText={(value) => setSquadName(value)} />
          </View>
      );
  }


  const renderEmojiSection = () => {
      return (
        <View style={EditSquadSettingsStyles.emojiContainer}>
            <Text style={[TextStyles.paragraph, EditSquadSettingsStyles.squadAttributeName]}>Emoji</Text>
            <View style={EditSquadSettingsStyles.emojiBox}>
                <EmojiPicker defaultEmoji={squadEmoji} onEmojiPicked={(emoji: string) => setSquadEmoji(emoji)} emojiPickerTitle={"Select Squad Emoji"}/>
            </View>
        </View>
      );
  }

  const renderSquadCodeSection = () => {
      return (
          <View style={EditSquadSettingsStyles.squadCodeContainer}>
              <Text style={[TextStyles.paragraph, EditSquadSettingsStyles.squadAttributeName]}>Code</Text>
              <Text style={[TextStyles.paragraph]}>{squadCode}</Text>
          </View>
      );
  }

  const goToEditSquadMembers = () => {
    props.navigation.navigate("Squad Members", {
        userId: userId,
        squadId: squadId,
        isInEditView: true
    });
  }

  const renderActionsSection = () => {
    return (
      <View style={EditSquadSettingsStyles.editMembersContainer}>
        <Divider />
        <TouchableOpacity style={EditSquadSettingsStyles.editMembersButton} onPress={goToEditSquadMembers}>
          <Image source={require('../assets/user_button.png')} style={EditSquadSettingsStyles.actionSectionImage} />
          <Text style={[TextStyles.paragraph, EditSquadSettingsStyles.editMembersText]}>Edit members</Text>
          <Image source={require('../assets/arrow_forward_gray.png')} style={EditSquadSettingsStyles.forwardArrowIcon} />
        </TouchableOpacity>
        <Divider />
        {(squadAdminId == userId) && <StandardButton text="Delete Squad" override_style={EditSquadSettingsStyles.deleteSquadButton} onPress={() => setDeleteSquadModalVisible(true) } />}
      </View>
    );
  }
  const renderDeleteSquadModel = () => {
    return (
        <BlurModal visible={deleteSquadModalVisible}>
            <Image source={require('../assets/exit_icon.png')} style={EditSquadSettingsStyles.deleteSquadIcon} />
            <Text style={[TextStyles.paragraph, {textAlign: "center"}]}>{`Are you sure you want to\ndelete this squad?\nThis action cannot be undone.`}</Text>
            <View style={EditSquadSettingsStyles.deleteSquadModalButtonRow}>
                <StandardButton text="Cancel" override_style={EditSquadSettingsStyles.deleteSquadModalCancelButton} text_override_style={{color:"#84D3FF"}} onPress={() => { setDeleteSquadModalVisible(false) }} />
                <StandardButton text="Leave" override_style={EditSquadSettingsStyles.deleteSquadModalDeleteButton} onPress={() => { deleteRequest('squad', { squad_id: squadId, user_id: userId }).then(data => { props.navigation.navigate("Squads")  }); }} />
            </View>
        </BlurModal>
    );
  }

    const saveSquad = () => {
        const endpoint = 'edit_squad'
        const data = {
            squad_id: squadId,
            squad_name: squadName,
            squad_emoji: squadEmoji,
            squad_image: squadImage 
        }
        const init: RequestInit = {
            method: 'PUT',
            mode: 'no-cors',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        callBackend(endpoint, init).then(() => { props.navigation.pop() })
    }

    return (
      <View style ={EditSquadSettingsStyles.viewableContainer}>
        {renderHeaderSaveButton()}
        <ScrollView style={EditSquadSettingsStyles.viewableContainer} >
            {renderSquadImage()}
            {renderSquadTitleSection()}
            {renderEmojiSection()}
            {renderSquadCodeSection()}
            {renderActionsSection()}
        </ScrollView>
        {renderDeleteSquadModel()}
      </View>
    );
}

export default EditSquadSettings;
