import React, { useLayoutEffect, useState } from "react";
import { Button, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { EditEventStyles } from "./edit_event_styles";
import EmojiPicker from "../components/emojipicker/EmojiPicker";
import DateTimeInput from "../components/date_time_input/date_time_input";
import Divider from '../components/divider/divider'
import { callBackend } from "../backend/backend"
import { IMG_URL_BASE_64_PREFIX } from "../constants"
import ImagePicker from 'react-native-image-picker';
import Slider from "@react-native-community/slider";

const EditEvent = (props) => {
  const event = props.route.params.event
  const userEmail = props.route.params.userEmail

  const [event_description, setEventDescription] = useState(event.description)
  const [event_down_threshold, setEventDownThreshold] = useState(event.down_threshold)
  const [event_emoji, setEventEmoji] = useState(event.emoji);
  const [event_name, setEventName] = useState(event.name)
  const [eventStartTime, setEventStartTime] = useState<Date | undefined>(event.start_ms && new Date(event.start_ms));
  const [eventEndTime, setEventEndTime] = useState<Date | undefined>(event.end_ms && new Date(event.end_ms));
  const [eventImage, setEventImage] = useState(event.image_url)
  const [event_url, setEventURL] = useState(event.url)

  const image_picker_options = {
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
    ImagePicker.showImagePicker(image_picker_options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        setEventImage(undefined)
      } else {
        setEventImage(IMG_URL_BASE_64_PREFIX + response.data);
      }
    });
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => props.navigation.pop()}
          title=" Cancel"
          color="#007AFF"
        />
      ),
    });
  }, [props.navigation]);

  {/* Event image circle */ }
  const renderImageCircle = () => {
    return (
      <View style={EditEventStyles.event_pic_container}>
        <TouchableOpacity style={EditEventStyles.event_picture_button} onPress={() => { showImagePicker() }}>
          <Image source={eventImage ? { uri: eventImage } : require('../assets/upload_photo.png')} style={EditEventStyles.event_picture} />
        </TouchableOpacity>
      </View>
    )
  }

  {/* Event title box */ }
  const renderEventTitleBox = () => {
    return (
      <View style={EditEventStyles.event_title_container}>
        <TextInput style={EditEventStyles.event_title} placeholder="Event Title" value={event_name} multiline={true} onChangeText={(value) => setEventName(value)} />
      </View>
    );
  }

  {/* Event details box (All fields shown on event details page) */ }
  const renderEventDetailsBox = () => {
    return (
      <View style={EditEventStyles.event_details_edit_container}>
        <DateTimeInput onChange={setEventStartTime} initialValue={eventStartTime} />
        {Divider()}
        <DateTimeInput onChange={setEventEndTime} initialValue={eventEndTime} />
        {/* Commenting out URL for FMVP */}
        {/* {Divider()}
        <TextInput style={[EditEventStyles.event_url, { textDecorationLine: event_url ? 'underline' : 'none' }]} placeholder="Event URL" value={event_url} autoCapitalize={'none'} onChangeText={(value) => setEventURL(value)} /> */}
        {Divider()}
        <TextInput style={EditEventStyles.event_description} placeholder="Event Description" value={event_description} multiline={true} onChangeText={(value) => setEventDescription(value)} />
      </View>
    );
  }


  {/* Additional event fields box (Fields related to event not shown on details page) */ }
  const renderAdditionalFieldsBox = () => {
    return (
      <View style={EditEventStyles.additional_fields_container}>
        {renderEmojiField()}
        {Divider()}
        {renderDownThresholdSlider()}
      </View>
    );
  }

  const renderEmojiField = () => {
    return (
      <SafeAreaView style={EditEventStyles.emoji_container}>
        <Text style={EditEventStyles.event_emoji_text}>
          Event Emoji:
        </Text>
        <EmojiPicker
          onEmojiPicked={setEventEmoji}
          emojiPickerTitle={"Select Event Emoji"}
          defaultEmoji={event.emoji}
        />
      </SafeAreaView>
    )
  };

  const renderDownThresholdSlider = () => {
    return (
      <View>
        <Text style={EditEventStyles.down_threshold_text}>Number of people down to create calendar event: {event_down_threshold}</Text>
        {/* Allowing a maximum value of at least 2 in case not everybody has joined. */}
        <Slider minimumValue={1} maximumValue={Math.max(event.rsvp_users.length + event.declined_users.length, 2)} step={1}
          value={event_down_threshold} onValueChange={setEventDownThreshold}
          thumbImage={require("../assets/down_static.png")}
          style={EditEventStyles.down_threshold_slider} />
      </View>
    );
  }

  const renderSaveButton = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={saveEvent}>
          <View style={EditEventStyles.save_button}>
            <Text style={EditEventStyles.save_button_text}> {"Save"} </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  const saveEvent = () => {
    const endpoint = 'edit_event'
    const data = {
      event_id: event.id,
      email: userEmail,
      title: event_name || null,
      description: event_description || null,
      down_threshold: event_down_threshold,
      emoji: event_emoji,
      event_url: event_url || null,
      image_url: eventImage || null,
      squad_id: event.squadId,
      start_time: eventStartTime ? eventStartTime.getTime() : null,
      end_time: eventEndTime ? eventEndTime.getTime() : null,
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
    <ScrollView style={EditEventStyles.container} >
      {/* Event image */}
      {renderImageCircle()}
      {/* Event title */}
      {renderEventTitleBox()}
      {/* Event info shown on event details page */}
      {renderEventDetailsBox()}
      {/* Other additional event fields */}
      {renderAdditionalFieldsBox()}
      {renderSaveButton()}
    </ScrollView>
  );
}

export default EditEvent;
