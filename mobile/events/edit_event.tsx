import React, { useLayoutEffect, useState } from "react";
import { Button, Image, SafeAreaView, ScrollView, Slider, Text, TextInput, TouchableOpacity, View } from "react-native";
import { EditEventStyles } from "./edit_event_styles";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import DateTimeInput from "../components/date_time_input/date_time_input";
import Divider from '../components/divider/divider'
import { callBackend } from "../backend/backend"
import { EVENT_PIC_HEIGHT, EVENT_PIC_WIDTH } from "../constants"

const EditEvent = (props) => {
  const event = props.route.params.event
  const userEmail = props.route.params.userEmail

  const [event_description, setEventDescription] = useState(event.description)
  const [event_down_threshold, setEventDownThreshold] = useState(event.down_threshold)
  const [event_emoji, setEventEmoji] = useState(event.emoji);
  const [event_name, setEventName] = useState(event.name)
  const [eventStartTime, setEventStartTime] = useState<Date | undefined>(event.start_ms && new Date(event.start_ms));
  const [eventEndTime, setEventEndTime] = useState<Date | undefined>(event.end_ms && new Date(event.end_ms));
  const [event_url, setEventURL] = useState(event.url)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


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
        {event.image_url ?
          <View style={EditEventStyles.event_picture}>
            <Image source={{ uri: event.image_url }}
              style={{ borderColor: "#aaaaaa", borderWidth: 1, width: EVENT_PIC_WIDTH, height: EVENT_PIC_HEIGHT, borderRadius: EVENT_PIC_WIDTH / 2 }}
            />
          </View> :
          <View></View>
        }
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
        {Divider()}
        <TextInput style={[EditEventStyles.event_url, { textDecorationLine: event_url ? 'underline' : 'none' }]} placeholder="Event URL" value={event_url} onChangeText={(value) => setEventURL(value)} />
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
        <Text style={EditEventStyles.down_threshold_text}>Number of people down to auto create event: {event_down_threshold}</Text>
        <View style={{ marginHorizontal: 20, paddingBottom: 20 }} >
          <Slider minimumValue={0} maximumValue={event.rsvp_users.length + event.declined_users.length} step={1} value={event_down_threshold} onValueChange={(sliderValue: number) => setEventDownThreshold(sliderValue)}>
          </Slider>
        </View>
      </View>
    );
  }

  const renderEmojiField = () => {
    return (
      <SafeAreaView style={EditEventStyles.emoji_container}>
        <Text style={EditEventStyles.event_emoji_text}>
          Event Emoji:
        </Text>
        <View>
          <TouchableOpacity onPress={() => { setShowEmojiPicker(true) }}>
            <Text style={EditEventStyles.emoji}>
              {`${event_emoji}`}
            </Text>
          </TouchableOpacity>
          <View style={{ alignSelf: "center" }}>
            {renderEmojiPicker()}
          </View>
        </View>
      </SafeAreaView>
    )
  }

  const renderEmojiPicker = () => {
    return (
      showEmojiPicker &&
      <View style={EditEventStyles.emoji_picker_container}>
        <EmojiSelector
          category={Categories.all}
          showSearchBar={false}
          onEmojiSelected={emoji => {
            setEventEmoji(emoji);
            setShowEmojiPicker(false);
          }}
        />
      </View>
    )
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
      image_url: event.image_url || null,
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
