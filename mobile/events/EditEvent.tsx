import React, { useLayoutEffect, useState } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Slider from '@react-native-community/slider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import EditEventStyles from './EditEventStyles';
import EmojiPicker from '../components/emojipicker/EmojiPicker';
import DateTimeInput from '../components/date_time_input/date_time_input';
import Divider from '../components/divider/Divider';
import { callBackend } from '../backend/backend';
import { IMG_URL_BASE_64_PREFIX } from '../constants';
import { RootStackParamList } from '../App';
// import AppNavRouteProp from '../types/navigation';

type EditEventScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditEvent'
>;

type EditEventScreenRouteProp = RouteProp<RootStackParamList, 'EditEvent'>;

type EditEventProps = {
  navigation: EditEventScreenNavigationProp;
  route: EditEventScreenRouteProp;
};

// type EditEventProps = AppNavRouteProp<'EditEvent'>;

const downStatic = require('../assets/down_static.png');
const uploadPhoto = require('../assets/upload_photo.png');

const EditEvent = ({ route, navigation }: EditEventProps) => {
  const { event, userEmail, numUsers } = route.params;
  const [eventDescription, setEventDescription] = useState(event.description);
  const [eventDownThreshold, setEventDownThreshold] = useState(event.downThreshold);
  const [eventEmoji, setEventEmoji] = useState(event.emoji); // eslint-disable-line no-unused-vars
  const [eventName, setEventName] = useState(event.name);
  const [eventStartTime, setEventStartTime] = useState<Date | undefined>(
    event.startMs ? new Date(event.startMs) : undefined,
  );
  const [eventEndTime, setEventEndTime] = useState<Date | undefined>(
    event.endMs ? new Date(event.endMs) : undefined,
  );
  const [eventImage, setEventImage] = useState(event.imageUrl);
  const [eventUrl, setEventURL] = useState(event.url); // eslint-disable-line no-unused-vars

  const imagePickerOptions = {
    title: 'Select event photo',
    customButtons: eventImage ? [{ name: 'remove', title: 'Remove photo' }] : [],
    maxWidth: 200,
    maxHeight: 200,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const showImagePicker = () => {
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        setEventImage(undefined);
      } else {
        setEventImage(IMG_URL_BASE_64_PREFIX + response.data);
      }
    });
  };

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

  /* Event image circle */
  const renderImageCircle = () => (
    <View style={EditEventStyles.eventPicContainer}>
      <TouchableOpacity
        style={EditEventStyles.eventPictureButton}
        onPress={() => { showImagePicker(); }}
      >
        <Image
          source={eventImage ? { uri: eventImage } : uploadPhoto}
          style={EditEventStyles.eventPicture}
        />
      </TouchableOpacity>
    </View>
  );

  /* Event title box */
  const renderEventTitleBox = () => (
    <View style={EditEventStyles.eventTitleContainer}>
      <TextInput
        style={EditEventStyles.eventTitle}
        placeholder='Event Title'
        value={eventName}
        multiline
        onChangeText={(value) => setEventName(value)}
      />
    </View>
  );

  /* Event details box (All fields shown on event details page) */
  const renderEventDetailsBox = () => (
    <View style={EditEventStyles.eventDetailsEditContainer}>
      <DateTimeInput onChange={setEventStartTime} initialValue={eventStartTime} />
      <Divider />
      <DateTimeInput onChange={setEventEndTime} initialValue={eventEndTime} />
      {/* Commenting out URL for FMVP */}
      {/* {Divider()}
      <TextInput
        style={[EditEventStyles.event_url,
          { textDecorationLine: event_url ? 'underline' : 'none' }]}
        placeholder='Event URL'
        value={event_url}
        autoCapitalize={'none'}
        onChangeText={(value) => setEventURL(value)}
      /> */}
      <Divider />
      <TextInput
        style={EditEventStyles.eventDescription}
        placeholder='Event Description'
        value={eventDescription}
        multiline
        numberOfLines={3}
        onChangeText={setEventDescription}
      />
    </View>
  );

  /* Additional event fields box (Fields related to event not shown on details page) */
  const renderAdditionalFieldsBox = () => (
    <View style={EditEventStyles.additionalFieldsContainer}>
      renderEmojiField()
      <Divider />
      renderDownThresholdSlider()
    </View>
  );

  // eslint-disable-next-line no-unused-vars
  const renderEmojiField = () => (
    <SafeAreaView style={EditEventStyles.emojiContainer}>
      <Text style={EditEventStyles.eventEmojiText}>
        Event Emoji:
      </Text>
      <EmojiPicker
        onEmojiPicked={setEventEmoji}
        emojiPickerTitle='Select Event Emoji'
        defaultEmoji={event.emoji}
      />
    </SafeAreaView>
  );

  // eslint-disable-next-line no-unused-vars
  const renderDownThresholdSlider = () => (
    <View>
      <Text style={EditEventStyles.downThresholdText}>
        Number of people down to create calendar event:
        {eventDownThreshold}
      </Text>
      {/* Allowing a maximum value of at least 2 in case not everybody has joined. */}
      <Slider
        minimumValue={1}
        maximumValue={Math.max(numUsers, 2)}
        step={1}
        value={eventDownThreshold}
        onValueChange={setEventDownThreshold}
        thumbImage={downStatic}
        style={EditEventStyles.downThresholdSlider}
      />
    </View>
  );

  const saveEvent = () => {
    const endpoint = 'edit_event';
    const data = {
      event_id: event.id, // eslint-disable-line camelcase
      email: userEmail,
      title: eventName || null,
      description: eventDescription || null,
      down_threshold: eventDownThreshold, // eslint-disable-line camelcase
      emoji: eventEmoji,
      event_url: eventUrl || null, // eslint-disable-line camelcase
      image_url: eventImage || null, // eslint-disable-line camelcase
      squad_id: event.squadId, // eslint-disable-line camelcase
      start_time: eventStartTime ? eventStartTime.getTime() : null, // eslint-disable-line camelcase
      end_time: eventEndTime ? eventEndTime.getTime() : null, // eslint-disable-line camelcase
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
      <TouchableOpacity onPress={saveEvent}>
        <View style={EditEventStyles.saveButton}>
          <Text style={EditEventStyles.saveButtonText}> Save </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAwareScrollView style={EditEventStyles.container}>
      {/* Event image */}
      {renderImageCircle()}
      {/* Event title */}
      {renderEventTitleBox()}
      {/* Event info shown on event details page */}
      {renderEventDetailsBox()}
      {/* Other additional event fields */}
      {renderAdditionalFieldsBox()}
      {renderSaveButton()}
    </KeyboardAwareScrollView>
  );
};

export default EditEvent;
