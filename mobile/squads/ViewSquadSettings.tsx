import React, { useCallback, useState } from 'react';
import {
  Image, ScrollView, Text, TouchableOpacity, View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ViewSquadSettingsStyles from './ViewSquadSettingsStyles';
import Divider from '../components/divider/Divider';
import { callBackend, deleteRequest } from '../backend/backend';
import TextStyles from '../TextStyles';
import BlurModal from '../components/blurmodal/BlurModal';
import StandardButton from '../components/button/Button';
import { AppNavigationProp, AppRouteProp } from '../types/navigation';

type ViewSquadSettingsProps = {
  navigation: AppNavigationProp<'ViewSquadSettings'>;
  route: AppRouteProp<'ViewSquadSettings'>;
};

const pencilButton = require('../assets/pencil_button.png');
const userButton = require('../assets/user_button.png');
const exitIcon = require('../assets/exit_icon.png');
const arrowForwardGray = require('../assets/arrow_forward_gray.png');

const ViewSquadSettings = ({ route, navigation }: ViewSquadSettingsProps) => {
  const { userId, squadId, squadCode } = route.params;
  const [squadName, setSquadName] = useState(route.params.squadName);
  const [squadEmoji, setSquadEmoji] = useState(route.params.squadEmoji);
  const [squadImage, setSquadImage] = useState(route.params.squadImage);
  const [leaveSquadModalVisible, setLeaveSquadModalVisible] = useState(false);

  const getSquadDetails = () => {
    const endpoint = `squad?squad_id=${squadId}`;
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then((response) => response.json()).then((data) => {
      setSquadName(data.name);
      setSquadEmoji(data.squad_emoji);
      setSquadImage(data.image);
      navigation.setOptions({
        headerRight: () => (
          <View style={ViewSquadSettingsStyles.headerRight}>
            { renderEditSquadSettingsButton(squadId, data.name, data.squad_emoji,
              data.image, data.admin_id) }
          </View>
        ),
      });
    });
  };

  const removeUserFromSquad = () => {
    deleteRequest('delete_user', { user_id: userId, squad_id: squadId }).then( // eslint-disable-line camelcase
      () => {
        navigation.navigate('Squads');
      },
    );
  };

  useFocusEffect(useCallback(getSquadDetails, []));

  const goToEditSquad = (squadIdVal: number, squadNameVal: string, squadEmojiVal: string,
    squadImageVal: string, squadAdminIdVal: number) => {
    navigation.navigate('Edit Squad Settings', {
      squadId: squadIdVal,
      squadAdminId: squadAdminIdVal,
      squadName: squadNameVal,
      squadEmoji: squadEmojiVal,
      squadCode,
      squadImage: squadImageVal,
      userId,
    });
  };

  const renderEditSquadSettingsButton = (squadIdVal: number, squadNameVal: string,
    squadEmojiVal: string, squadImageVal: string, squadAdminIdVal: number) => (
      <TouchableOpacity
        onPress={() => goToEditSquad(squadIdVal, squadNameVal, squadEmojiVal,
          squadImageVal, squadAdminIdVal)}
        style={ViewSquadSettingsStyles.editSquadButtonImage}
      >
        <Image source={pencilButton} style={ViewSquadSettingsStyles.editSquadButtonImage} />
      </TouchableOpacity>
  );

  const renderSquadImage = () => (
    <View style={ViewSquadSettingsStyles.squadImageContainer}>
      { squadImage
        ? <Image source={{ uri: squadImage }} style={ViewSquadSettingsStyles.squadImage} />
        : <View /> }
    </View>
  );

  const renderSquadTitleSection = () => (
    <View style={ViewSquadSettingsStyles.squadTitleContainer}>
      <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.squadAttributeName]}>Name</Text>
      <Text style={[TextStyles.paragraph]}>{squadName}</Text>
    </View>
  );

  const renderEmojiSection = () => (
    <View style={ViewSquadSettingsStyles.emojiContainer}>
      <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.squadAttributeName]}>Emoji</Text>
      <Text style={{ fontSize: 40 }}>{squadEmoji}</Text>
    </View>
  );

  const renderSquadCodeSection = () => (
    <View style={ViewSquadSettingsStyles.squadCodeContainer}>
      <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.squadAttributeName]}>Code</Text>
      <Text style={[TextStyles.paragraph]}>{squadCode}</Text>
    </View>
  );

  const goToViewSquadMembers = () => {
    navigation.navigate('Squad Members', {
      userId,
      squadId,
      isInEditView: false,
    });
  };

  const renderActionsSection = () => (
    <View style={ViewSquadSettingsStyles.additionalActionContainer}>
      <Divider />
      <TouchableOpacity
        style={ViewSquadSettingsStyles.additionalActionButton}
        onPress={goToViewSquadMembers}
      >
        <Image source={userButton} style={ViewSquadSettingsStyles.actionSectionImage} />
        <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.viewMembersText]}>
          View members
        </Text>
        <Image source={arrowForwardGray} style={ViewSquadSettingsStyles.forwardArrowIcon} />
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity
        style={ViewSquadSettingsStyles.additionalActionButton}
        onPress={() => setLeaveSquadModalVisible(true)}
      >
        <Image source={exitIcon} style={ViewSquadSettingsStyles.actionSectionImage} />
        <Text style={[TextStyles.paragraph, ViewSquadSettingsStyles.leaveSquadText]}>
          Leave squad
        </Text>
        <Image source={arrowForwardGray} style={ViewSquadSettingsStyles.forwardArrowIcon} />
      </TouchableOpacity>
      <Divider />
    </View>
  );

  const renderLeaveSquadModel = () => (
    <BlurModal visible={leaveSquadModalVisible}>
      <Image source={exitIcon} style={ViewSquadSettingsStyles.leaveSquadIcon} />
      <Text style={[TextStyles.paragraph, { textAlign: 'center' }]}>{'Are you sure you want to leave this squad? You can always \n re-join with the squad code.'}</Text>
      <View style={ViewSquadSettingsStyles.leaveSquadModalButtonRow}>
        <StandardButton
          text='Cancel'
          overrideStyle={ViewSquadSettingsStyles.leaveSquadModalCancelButton}
          textOverrideStyle={{ color: '#84D3FF' }}
          onPress={() => { setLeaveSquadModalVisible(false); }}
        />
        <StandardButton
          text='Leave'
          overrideStyle={ViewSquadSettingsStyles.leaveSquadModalLeaveButton}
          onPress={() => { removeUserFromSquad(); }}
        />
      </View>
    </BlurModal>
  );

  return (
    <ScrollView style={ViewSquadSettingsStyles.container}>
      {renderSquadImage()}
      {renderSquadTitleSection()}
      {renderEmojiSection()}
      {renderSquadCodeSection()}
      {renderActionsSection()}
      {renderLeaveSquadModel()}
    </ScrollView>
  );
};

export default ViewSquadSettings;
