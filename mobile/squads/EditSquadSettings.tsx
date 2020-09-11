import React, { useLayoutEffect, useState } from "react";
import { Button, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, _View } from "react-native";
import { EditSquadSettingsStyles } from "./EditSquadSettingsStyles";
import EmojiPicker from "../components/emojipicker/EmojiPicker";
import Divider from '../components/divider/divider'
import { callBackend } from "../backend/backend"
import { TextStyles } from "../TextStyles";
import { StandardButton } from "../components/button/Button";
import { LinearGradient } from 'expo-linear-gradient';
import { StandardButtonStyles } from "../components/button/ButtonStyles";
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { IMG_URL_BASE_64_PREFIX } from "../constants"

const EditSquadSettings = (props) => {
    const [squadId, setSquadId] = useState(props.route.params.squadId);
    const [squadName, setSquadName] = useState(props.route.params.squadName);
    const [squadEmoji, setSquadEmoji] = useState(props.route.params.squadEmoji);
    const [squadCode, setSquadCode] = useState(props.route.params.squadCode);
    const [squadImage, setSquadImage] = useState(props.route.params.squadImage);

    const sheetRef = React.useRef(null);
    const [bottomSheetRefIndex, setBottomSheetRefIndex] = useState(0)

    const hideBottomSheet = () => {
        setBottomSheetRefIndex(0)
        sheetRef.current.snapTo(0)
    }

    const showBottomSheet = () => {
        setBottomSheetRefIndex(1)
        sheetRef.current.snapTo(1)
    }

    const photoUploadButtonAction = () => {
      squadImage ? setSquadImage(undefined) :  (bottomSheetRefIndex ? hideBottomSheet() : showBottomSheet())
    }

    const renderHeader = () => (
      <View style={{ overflow: 'hidden', paddingTop: 5 }}>
          <View style={{height: 40, backgroundColor:"white", justifyContent: "center", shadowColor: '#000', shadowOffset: { width: 1, height: -1 }, shadowOpacity:  0.4, shadowRadius: 3, elevation: 5,}}>
          <View
              style={{
              alignSelf: "center",
              width: 100,
              height: 5,
              borderRadius: 5,
              backgroundColor: "#C4C4C4"}}>
          </View>
      </View>
      </View>
      
  );

  const renderContent = () => (
      <View
          style={{
          backgroundColor: 'white',
          padding: 16,
          height: 450,
      }}>
          <StandardButton text="Take photo from camera" onPress={() => pickImageFromCamera()} />
          <StandardButton text="Choose photo from gallery" override_style={{ marginTop: 10, marginBottom: "10%" }} onPress={() => pickImageFromGallery()} />
      </View>
  );

  const pickImageFromGallery = () => {
    ImagePicker.openPicker({ 
      width: 350,
      height: 200,
      cropping: true,
      includeBase64: true
    }).then(image => {
      setSquadImage(IMG_URL_BASE_64_PREFIX + image.data);
      hideBottomSheet()
    });
  }

  const pickImageFromCamera = () => {
    ImagePicker.openCamera({
      width: 350,
      height: 200,
      cropping: true,
      includeBase64: true
    }).then(image => {
      setSquadImage(IMG_URL_BASE_64_PREFIX + image.data);
      hideBottomSheet()
    });
  }

  const renderSaveButton = () => {
      return (
        <StandardButton text="Save" override_style={{width: 100}} onPress={() => saveSquad()} />
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
        { squadImage ?  <Image source={{ uri: squadImage }} style = {EditSquadSettingsStyles.squadImage} /> 
                : 
                <LinearGradient
                  start={{x: 0.0, y: 0.25}} end={{x: 0.95, y: 1.0}}
                  colors={['#84D3FF', '#CFFFFF']}
                  style={EditSquadSettingsStyles.squadImage}
                /> 
        }
        <TouchableOpacity style={[StandardButtonStyles.button, EditSquadSettingsStyles.uploadButtonContainer]} onPress={()=> photoUploadButtonAction()}>
          <Text style={[TextStyles.secondary, EditSquadSettingsStyles.uploadButtonText]}>{squadImage ? `Delete` : `Upload`}</Text>
        </TouchableOpacity>
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
      props.navigation.navigate("Edit Squad Members", {
          squadId: squadId,
          isInEditView: true
      });
    }

    const renderActionsSection = () => {
      return (
        <View style={EditSquadSettingsStyles.editMembersContainer}>
          { Divider() }
          <TouchableOpacity style={EditSquadSettingsStyles.editMembersButton} onPress={goToEditSquadMembers}>
            <Image source={require('../assets/user_button.png')} style={EditSquadSettingsStyles.actionSectionImage} />
            <Text style={[TextStyles.paragraph, EditSquadSettingsStyles.editMembersText]}>Edit members</Text>
            <Image source={require('../assets/arrow_forward_gray.png')} style={EditSquadSettingsStyles.forwardArrowIcon} />
          </TouchableOpacity>
          { Divider() }
          {/* <View style={{height: 1.5, backgroundColor: "#BEBEBE"}}></View> */}
        </View>
        
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
        <BottomSheet
          enabledContentTapInteraction={false}
          initialSnap={0}
          ref={sheetRef}
          snapPoints={[0, 250, 300]}
          borderRadius={10}
          onCloseEnd={() => hideBottomSheet()}
          renderHeader={renderHeader}
          renderContent={renderContent}
        />
      </View>
    );
}

export default EditSquadSettings;
