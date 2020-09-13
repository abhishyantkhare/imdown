import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../App';
import AddSquadStyles from './AddSquadStyles';
import { TextStyles } from '../TextStyles';
import EmojiPicker from '../components/emojipicker/EmojiPicker';
import { callBackend } from '../backend/backend';
import StandardButton from '../components/button/Button';
import BlurModal from '../components/blurmodal/BlurModal';

type AddSquadScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSquad'
>;

type AddSquadScreenRouteProp = RouteProp<RootStackParamList, 'AddSquad'>;

type AddSquadProps = {
  navigation: AddSquadScreenNavigationProp;
  route: AddSquadScreenRouteProp;
};

const DEFAULT_EMOJI = '😎';
const ADD_SQUAD_BY_CODE_TITLE = 'Have a squad code? Enter it here:';
const ADD_SQUAD_BY_CODE_PLACEHOLDER = 'Code';
const CREATE_NEW_SQUAD_PLACEHOLDER = 'Enter squad name...';
const successIcon = require('../assets/success_icon.png');

const AddNewSquad = ({ route, navigation }: AddSquadProps) => {
  const [squadName, setSquadName] = useState('');
  const [emojiPicked, setEmojiPicked] = useState(DEFAULT_EMOJI);
  const [createSquadSuccessModal, setCreateSquadSuccessModal] = useState(false);
  const [squadCode, setSquadCode] = useState('');
  const { email } = route.params;

  const addSquadOnBackend = () => {
    const endpoint = 'create_squad';
    const data = {
      email,
      squad_name: squadName, // eslint-disable-line camelcase
      squad_emoji: emojiPicked, // eslint-disable-line camelcase
    };
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then((response) => response.json())
      .then((responseData) => {
        setSquadCode(responseData.code);
        setCreateSquadSuccessModal(true);
      });
  };

  const renderCreateNewSquad = () => (
    <View style={AddSquadStyles.addContainer}>
      <SafeAreaView style={AddSquadStyles.emojiAndSquadNameContainer}>
        <View style={AddSquadStyles.emojiBox}>
          <EmojiPicker onEmojiPicked={(emoji: string) => setEmojiPicked(emoji)} emojiPickerTitle='Select Squad Emoji' />
        </View>
        <TextInput
          placeholder={CREATE_NEW_SQUAD_PLACEHOLDER}
          onChangeText={(name) => setSquadName(name)}
          multiline
          style={[TextStyles.headerLarge, AddSquadStyles.squadNameText]}
          placeholderTextColor='lightgray'
        />
      </SafeAreaView>
    </View>
  );

  const renderCreateSquadSuccessModal = () => (
    <BlurModal visible={createSquadSuccessModal}>
      <Image
        source={successIcon}
        style={AddSquadStyles.successIcon}
      />
      <Text style={AddSquadStyles.successText}>Success!</Text>
      <TextInput
        editable={false}
        multiline
        style={AddSquadStyles.squadCreateModalText}
      >
        Your squad
        <Text style={{ fontFamily: 'Roboto_700Bold' }}>
          {`${squadName}`}
        </Text>
        has been created. Use your squad code to invite friends!
      </TextInput>
      <View style={AddSquadStyles.squadCodeContainer}>
        <Text style={AddSquadStyles.squadCodeValueText} selectable>
          {squadCode}
        </Text>
      </View>
      <StandardButton text='Done' override_style={{ marginBottom: 35, width: 130 }} onPress={() => { navigation.pop(); setCreateSquadSuccessModal(false); }} />
    </BlurModal>
  );

  return (
    <View style={AddSquadStyles.container}>
      <ScrollView keyboardShouldPersistTaps='handled' scrollEnabled={false}>
        {renderCreateNewSquad()}
      </ScrollView>
      {renderCreateSquadSuccessModal()}
      <StandardButton text='Submit' override_style={{ width: 200, marginBottom: '15%' }} onPress={() => addSquadOnBackend()} />
    </View>
  );
};

const AddExistingSquad = ({ route, navigation }: AddSquadProps) => {
  const [squadCode, setSquadCode] = useState('');
  const [squadName, setSquadName] = useState('');
  const [addToSquadSuccessModal, setAddToSquadSuccessModal] = useState(false);
  const { email } = route.params;

  const invalidSquadCodeMessage = (message: string, description: string) => (
    showMessage({
      message,
      description,
      type: 'danger',
    })
  );

  const addSquadByCodeOnBackend = () => {
    const endpoint = 'add_to_squad';
    const data = {
      email,
      squad_code: squadCode, // eslint-disable-line camelcase
    };
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then((response) => response.json())
      .then((responseData) => {
        if (responseData.status_code === 400) {
          invalidSquadCodeMessage(responseData.message, responseData.description);
        } else {
          setSquadName(responseData.squad_name);
          setAddToSquadSuccessModal(true);
        }
      });
  };

  const renderAddSquadByCode = () => (
    <View style={AddSquadStyles.addContainer}>
      <Text style={[TextStyles.paragraph, AddSquadStyles.addTitle]}>
        {ADD_SQUAD_BY_CODE_TITLE}
      </Text>
      <SafeAreaView>
        <TextInput
          placeholder={ADD_SQUAD_BY_CODE_PLACEHOLDER}
          autoCapitalize='none'
          onChangeText={(code) => setSquadCode(code)}
          style={AddSquadStyles.squadCodeText}
          placeholderTextColor='lightgray'
        />
      </SafeAreaView>
    </View>
  );

  const renderAddToSquadSuccessModal = () => (
    <BlurModal visible={addToSquadSuccessModal}>
      <Image source={successIcon} style={AddSquadStyles.successIcon} />
      <Text style={AddSquadStyles.successText}>Success!</Text>
      <TextInput
        editable={false}
        multiline
        style={AddSquadStyles.squadCreateModalText}
      >
        You&apos;ve joined squad
        <Text style={{ fontFamily: 'Roboto_700Bold' }}>
          {`${squadName}`}
        </Text>
        !
      </TextInput>
      <StandardButton text='Done' override_style={{ marginBottom: 35, width: 130 }} onPress={() => { navigation.pop(); setAddToSquadSuccessModal(false); }} />
    </BlurModal>
  );

  return (
    <View style={AddSquadStyles.container}>
      <ScrollView keyboardShouldPersistTaps='handled' scrollEnabled={false}>
        {renderAddSquadByCode()}
      </ScrollView>
      <StandardButton text='Submit' override_style={{ width: 200, marginBottom: '15%' }} onPress={() => addSquadByCodeOnBackend()} />
      {renderAddToSquadSuccessModal()}
    </View>
  );
};

export { AddNewSquad, AddExistingSquad };
