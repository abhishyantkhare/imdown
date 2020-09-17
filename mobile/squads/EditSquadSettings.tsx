import React, { useState } from 'react';
import {
  Image, ScrollView, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import EditSquadSettingsStyles from './EditSquadSettingsStyles';
import EmojiPicker from '../components/emojipicker/EmojiPicker';
import Divider from '../components/divider/Divider';
import { callBackend, deleteRequest } from '../backend/backend';
import TextStyles from '../TextStyles';
import StandardButton from '../components/button/Button';
import StandardButtonStyles from '../components/button/ButtonStyles';
import ImageUploader from '../components/imageuploader/ImageUploader';
import BlurModal from '../components/blurmodal/BlurModal';
import ImagePlaceholder from '../components/imageplaceholder/ImagePlaceholder';
import { AppNavigationProp, AppRouteProp } from '../types/navigation';

type EditSquadSettingsProps = {
  navigation: AppNavigationProp<'EditSquadSettings'>;
  route: AppRouteProp<'EditSquadSettings'>;
};

const userButton = require('../assets/user_button.png');
const exitIcon = require('../assets/exit_icon.png');
const arrowForwardGray = require('../assets/arrow_forward_gray.png');

const EditSquadSettings = ({ route, navigation }: EditSquadSettingsProps) => {
  const {
    squadId, squadAdminId, squadCode, userId,
  } = route.params;
  const [squadName, setSquadName] = useState(route.params.squadName);
  const [squadEmoji, setSquadEmoji] = useState(route.params.squadEmoji);
  const [squadImage, setSquadImage] = useState(route.params.squadImage);
  const [deleteSquadModalVisible, setDeleteSquadModalVisible] = useState(false);

  const saveSquad = () => {
    const endpoint = 'edit_squad';
    const data = {
      squad_id: squadId, // eslint-disable-line camelcase
      squad_name: squadName, // eslint-disable-line camelcase
      squad_emoji: squadEmoji, // eslint-disable-line camelcase
      squad_image: squadImage, // eslint-disable-line camelcase
    };
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'PUT',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then(() => { navigation.pop(); });
  };

  const deleteSquad = () => {
    deleteRequest('squad', { squad_id: squadId, user_id: userId }).then( // eslint-disable-line camelcase
      () => {
        navigation.navigate('Squads');
      },
    );
  };

  const goToEditSquadMembers = () => {
    console.log(`saving wit2h values ${squadAdminId} and ${squadId} and ${squadAdminId === userId}`);
    navigation.navigate('Squad Members', {
      userId,
      squadId,
      isInEditView: true,
    });
  };

  const renderSaveButton = () => (
    <StandardButton text='Save' overrideStyle={EditSquadSettingsStyles.saveButton} onPress={() => saveSquad()} />
  );

  const renderHeaderSaveButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <View style={EditSquadSettingsStyles.headerRight}>
          {renderSaveButton()}
        </View>
      ),
    });
  };

  const renderSquadImage = () => (
    <View style={EditSquadSettingsStyles.squadImageContainer}>
      { squadImage
        ? <Image source={{ uri: squadImage }} style={EditSquadSettingsStyles.squadImage} />
        : <ImagePlaceholder style={EditSquadSettingsStyles.squadImage} /> }
      <ImageUploader
        image={squadImage}
        imageWidth={350}
        imageHeight={200}
        onImagePicked={setSquadImage}
        touchableStyle={[
          StandardButtonStyles.button,
          EditSquadSettingsStyles.uploadButtonContainer,
        ]}
      >
        <Text style={[TextStyles.secondary, EditSquadSettingsStyles.uploadButtonText]}>{squadImage ? 'Replace' : 'Upload'}</Text>
      </ImageUploader>
    </View>
  );

  const renderSquadTitleSection = () => (
    <View style={EditSquadSettingsStyles.squadTitleContainer}>
      <Text style={[TextStyles.paragraph, EditSquadSettingsStyles.squadAttributeName]}>Name</Text>
      <TextInput
        style={[TextStyles.paragraph, EditSquadSettingsStyles.squadTitleTextInput]}
        clearButtonMode='always'
        editable
        placeholder='Squad Name'
        value={squadName}
        onChangeText={(value) => setSquadName(value)}
      />
    </View>
  );

  const renderEmojiSection = () => (
    <View style={EditSquadSettingsStyles.emojiContainer}>
      <Text style={[TextStyles.paragraph, EditSquadSettingsStyles.squadAttributeName]}>Emoji</Text>
      <View style={EditSquadSettingsStyles.emojiBox}>
        <EmojiPicker defaultEmoji={squadEmoji} onEmojiPicked={(emoji: string) => setSquadEmoji(emoji)} emojiPickerTitle='Select Squad Emoji' />
      </View>
    </View>
  );

  const renderSquadCodeSection = () => (
    <View style={EditSquadSettingsStyles.squadCodeContainer}>
      <Text style={[TextStyles.paragraph, EditSquadSettingsStyles.squadAttributeName]}>Code</Text>
      <Text style={[TextStyles.paragraph]}>{squadCode}</Text>
    </View>
  );

  const renderActionsSection = () => (
    <View style={EditSquadSettingsStyles.editMembersContainer}>
      <Divider />
      <TouchableOpacity
        style={EditSquadSettingsStyles.editMembersButton}
        onPress={goToEditSquadMembers}
      >
        <Image source={userButton} style={EditSquadSettingsStyles.actionSectionImage} />
        <Text style={[TextStyles.paragraph, EditSquadSettingsStyles.editMembersText]}>
          Edit members
        </Text>
        <Image source={arrowForwardGray} style={EditSquadSettingsStyles.forwardArrowIcon} />
      </TouchableOpacity>
      <Divider />
      {(squadAdminId === userId) && <StandardButton text='Delete Squad' overrideStyle={EditSquadSettingsStyles.deleteSquadButton} onPress={() => setDeleteSquadModalVisible(true)} />}
    </View>
  );

  const renderDeleteSquadModel = () => (
    <BlurModal visible={deleteSquadModalVisible}>
      <Image source={exitIcon} style={EditSquadSettingsStyles.deleteSquadIcon} />
      <Text style={[TextStyles.paragraph, { textAlign: 'center' }]}>{'Are you sure you want to\ndelete this squad?\nThis action cannot be undone.'}</Text>
      <View style={EditSquadSettingsStyles.deleteSquadModalButtonRow}>
        <StandardButton
          text='Cancel'
          overrideStyle={EditSquadSettingsStyles.deleteSquadModalCancelButton}
          textOverrideStyle={{ color: '#84D3FF' }}
          onPress={() => { setDeleteSquadModalVisible(false); }}
        />
        <StandardButton
          text='Delete'
          overrideStyle={EditSquadSettingsStyles.deleteSquadModalDeleteButton}
          onPress={() => { deleteSquad(); }}
        />
      </View>
    </BlurModal>
  );

  return (
    <View style={EditSquadSettingsStyles.viewableContainer}>
      {renderHeaderSaveButton()}
      <ScrollView style={EditSquadSettingsStyles.viewableContainer}>
        {renderSquadImage()}
        {renderSquadTitleSection()}
        {renderEmojiSection()}
        {renderSquadCodeSection()}
        {renderActionsSection()}
      </ScrollView>
      {renderDeleteSquadModel()}
    </View>
  );
};

export default EditSquadSettings;
