import React, { useState, useCallback } from 'react';
import { Image, View, useWindowDimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import EmojiPicker from '../components/emojipicker/EmojiPicker';
import AddEditEventStyles from './AddEditEventStyles';
import RobotoTextInput from '../components/robototextinput/RobotoTextInput';
import DateTimeInput from '../components/date_time_input/DateTimeInput';
import Section from '../components/section/Section';
import SwitchButton from '../components/switchbutton/SwitchButton';
import ImageUploader from '../components/imageuploader/ImageUploader';
import Divider from '../components/divider/Divider';
import StandardButton from '../components/button/Button';
import { getUsersInSquad, backendRequest } from '../backend/backend';
import { DEFAULT_EMOJI } from '../constants';
import Label from '../components/label/Label';
import OptionalLabel from '../components/optionallabel/OptionalLabel';
import AppNavRouteProp from '../types/navigation';
import { Event } from './EventDetails';

type AddEditEventProps = AppNavRouteProp<'AddEditEvent'>

const downBorderFilled = require('../assets/down_border_filled.png');
const addPhoto = require('../assets/add_photo.png');

const AddEditEvent = ({ route, navigation }: AddEditEventProps) => {
  const {
    squadRouteParams, prevEvent, isEditView,
  } = route.params;

  function prevEventVal(field: keyof Event) {
    if (!prevEvent) {
      return undefined;
    }
    return prevEvent[field];
  }

  const [emoji, setEmojiPicked] = useState<string>(prevEventVal('emoji') as string || DEFAULT_EMOJI);
  const [eventTitle, setEventTitle] = useState<string>(prevEventVal('name') as string || '');
  const [startDateTime, setStartDateTime] = useState<Date>(prevEventVal('startMs') ? new Date(prevEventVal('startMs') as number) : new Date());
  const [showEndTime, setShowEndTime] = useState<boolean>(!!prevEventVal('endMs'));
  const [endDateTime, setEndDateTime] = useState<Date | undefined>(prevEventVal('endMs') ? new Date(prevEventVal('endMs') as number) : undefined);
  const [eventDescription, setEventDescription] = useState<string>(prevEventVal('description') as string || '');
  const [downThreshold, setDownThreshold] = useState<number>(prevEventVal('downThreshold') as number || 1);
  const [numUsers, setNumUsers] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string>(prevEventVal('imageUrl') as string || '');
  const windowWidth = useWindowDimensions().width;

  useFocusEffect(useCallback(() => {
    getUsersInSquad(squadRouteParams.squadId).then((data) => {
      setNumUsers(data.user_info.length);
    });
  }, []));

  const renderEventEmoji = () => (
    <EmojiPicker
      onEmojiPicked={setEmojiPicked}
      emojiPickerTitle='Pick Event Emoji'
      defaultEmoji={emoji}
    />
  );

  const generateEventForBackend = () => (
    {
      eventId: prevEvent ? prevEvent.id : null,
      title: eventTitle,
      description: eventDescription || null,
      emoji,
      startTime: moment(startDateTime).valueOf(),
      endTime: showEndTime ? moment(endDateTime).valueOf() : null,
      // TODO: Add address + lat/lng to add event page
      // address,
      // lat,
      // lng,
      squadId: squadRouteParams.squadId,
      eventUrl: null,
      imageUrl: imageUrl || null,
      downThreshold,
    }
  );

  const validateEvent = () => {
    if (!eventTitle) {
      showMessage({
        message: 'Please enter an event name',
        type: 'danger',
      });
      return false;
    }
    if (showEndTime && endDateTime) {
      if (endDateTime <= startDateTime) {
        showMessage({
          message: 'End time cannot be before start time',
          type: 'danger',
        });
        return false;
      }
    }
    return true;
  };

  const validateAndSaveEvent = () => {
    if (validateEvent()) {
      const endpoint = isEditView ? 'edit_event' : 'create_event';
      const method = isEditView ? 'PUT' : 'POST';
      const data = generateEventForBackend();
      backendRequest(endpoint, data, method).then(() => {
        navigation.navigate('Events', { ...squadRouteParams });
      });
    }
  };

  const renderEventTitleSection = () => (
    <Section label='Event Title' style={{ marginTop: '10%' }}>
      <RobotoTextInput
        placeholder='Awesome New Hangout!'
        onChangeText={setEventTitle}
        defaultText={eventTitle}
      />
    </Section>
  );

  const switchEndDateTime = () => {
    if (!showEndTime) {
      setEndDateTime(moment(startDateTime).add(1, 'hour').toDate());
    }
    setShowEndTime(!showEndTime);
  };

  const renderEventTimes = () => (
    <Section label='Start and end times'>
      <DateTimeInput
        initialDateTime={startDateTime}
        onSetDateTime={setStartDateTime}
      />
      {showEndTime
        ? (
          <DateTimeInput
            onSetDateTime={setEndDateTime}
            style={{ marginTop: '5%' }}
            initialDateTime={endDateTime}
          />
        ) : null}
      <SwitchButton
        label='Add End Time'
        onChange={switchEndDateTime}
        style={{ marginTop: '5%' }}
      />
    </Section>
  );

  const renderEventDescription = () => (
    <Section label='Description' optional>
      <RobotoTextInput
        placeholder='Tell everyone about your event!'
        multiline
        style={{ height: 100 }}
        onChangeText={setEventDescription}
        defaultText={eventDescription}
      />
    </Section>
  );

  const renderEventDownThreshold = () => (
    <Section label='Minimum Attendees'>
      <Label
        size='small'
        labelText='Once the minimum number of attendees accepts the invitation, the event will be scheduled and a calendar invite will be sent to all participants.'
      />
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: '80%' }}>
          <Slider
            minimumValue={1}
            maximumValue={Math.max(numUsers, 2)}
            step={1}
            value={downThreshold}
            onValueChange={setDownThreshold}
            style={{ marginTop: '5%' }}
            thumbImage={downBorderFilled}
            minimumTrackTintColor='#90BEDE'
          />
        </View>
      </View>
      <Label
        size='small'
        labelText={downThreshold.toString()}
        style={{
          left: ((downThreshold - 1) * windowWidth * 0.6) / (Math.max(numUsers, 2) * 1.03 - 1),
          marginLeft: '12.5%',
          marginTop: '5%',
        }}
      />
    </Section>
  );

  const renderEventImage = () => (
    <View style={{ marginTop: '10%', marginBottom: '10%' }}>
      {imageUrl
        ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ height: 200, width: 350, alignSelf: 'center' }}
          />
        )
        : null}
      <View style={[AddEditEventStyles.imageUploadBox, { marginTop: '10%', marginBottom: '10%' }]}>
        <ImageUploader
          touchableStyle={{}}
          onImagePicked={setImageUrl}
          image={imageUrl}
          imageHeight={200}
          imageWidth={350}
        >
          <View style={AddEditEventStyles.uploadLabelRow}>
            <Image
              source={addPhoto}
            />
            <View style={{ marginLeft: '5%' }}>
              <Label
                labelText={imageUrl ? 'Replace/Remove image' : 'Upload an image'}
                size='small'
              />
              {!imageUrl
                ? <OptionalLabel style={{ marginTop: '5%' }} />
                : null}
            </View>
          </View>
        </ImageUploader>
      </View>
    </View>
  );

  const renderSaveButton = () => (
    <View>
      <Divider style={{ marginTop: '5%' }} />
      <StandardButton
        text='Save'
        overrideStyle={AddEditEventStyles.saveButton}
        onPress={validateAndSaveEvent}
      />
    </View>
  );

  return (
    <KeyboardAwareScrollView style={AddEditEventStyles.container}>
      <View style={AddEditEventStyles.childContainer}>
        {renderEventEmoji()}
        {renderEventTitleSection()}
        {renderEventTimes()}
        {renderEventDescription()}
        {renderEventDownThreshold()}
        {renderEventImage()}
      </View>
      {renderSaveButton()}
    </KeyboardAwareScrollView>
  );
};

export default AddEditEvent;
