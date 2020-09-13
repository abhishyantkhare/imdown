import React, { useLayoutEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import EditSquadStyles from './EditSquadStyles';
import EmojiPicker from '../components/emojipicker/EmojiPicker';
import Divider from '../components/divider/divider';
import { callBackend } from '../backend/backend';
import { RootStackParamList } from '../App';

type EditSquadScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditSquad'
>;

type EditSquadScreenRouteProp = RouteProp<RootStackParamList, 'EditSquad'>;

type EditSquadProps = {
  navigation: EditSquadScreenNavigationProp;
  route: EditSquadScreenRouteProp;
};

const EditSquad = ({ route, navigation }: EditSquadProps) => {
  // eslint-disable-next-line no-unused-vars
  const [squadId, setSquadId] = useState(route.params.squadId);
  const [squadName, setSquadName] = useState(route.params.squadName);
  const [squadEmoji, setSquadEmoji] = useState(route.params.squadEmoji);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => navigation.pop()}
          title=' Cancel'
          color='#007AFF'
        />
      ),
    });
  }, [navigation]);

  /* Squad title box */
  const renderSquadTitleBox = () => (
    <View style={EditSquadStyles.squadTitleContainer}>
      <TextInput style={EditSquadStyles.squadTitle} placeholder='Squad Name' value={squadName} onChangeText={(value) => setSquadName(value)} />
    </View>
  );

  const renderEmojiField = () => (
    <SafeAreaView style={EditSquadStyles.emojiContainer}>
      <Text style={EditSquadStyles.squadEmojiText}>
        Squad Emoji:
      </Text>
      <EmojiPicker
        onEmojiPicked={setSquadEmoji}
        emojiPickerTitle='Select Squad Emoji'
        defaultEmoji={route.params.squadEmoji}
      />
    </SafeAreaView>
  );

  const renderAdditionalFieldsBox = () => (
    <View style={EditSquadStyles.additionalFieldsContainer}>
      {renderEmojiField()}
      {Divider()}
    </View>
  );

  const saveSquad = () => {
    const endpoint = 'edit_squad';
    const data = {
      squad_id: squadId, // eslint-disable-line camelcase
      squad_name: squadName, // eslint-disable-line camelcase
      squad_emoji: squadEmoji, // eslint-disable-line camelcase
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

  const renderSaveButton = () => (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={saveSquad}>
        <View style={EditSquadStyles.saveButton}>
          <Text style={EditSquadStyles.saveButtonText}>Save</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={EditSquadStyles.container}>
      {renderSquadTitleBox()}
      {renderAdditionalFieldsBox()}
      {renderSaveButton()}
    </ScrollView>
  );
};

export default EditSquad;
