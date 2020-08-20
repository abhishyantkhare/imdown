import React, { useEffect, useState } from "react";
import { callBackend } from "../backend/backend";
import { Button, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import EmojiPicker from "../components/emojipicker/EmojiPicker"
import { AddEventStyles } from "./add_event_styles";
import Slider from "@react-native-community/slider";
import moment from "moment";
import DateTimeInput from "../components/date_time_input/date_time_input";
import ImagePicker from 'react-native-image-picker';
import { IMG_URL_BASE_64_PREFIX } from "../constants"
import { Tooltip } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';

const AddEventDetailsScreen = ({ navigation, route }) => {
  const squadId = route.params.squadId;
  const userEmail = route.params.userEmail;

  // Prefilled from the previous screen(s).
  const [name, setName] = useState<string>(route.params.name || "");
  const [url, setUrl] = useState<string>(route.params.url || "");

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [emoji, setEmojiPicked] = useState<string>(route.params.emoji || "🗓");
  const [imageUrl, setImageUrl] = useState(route.params.image_url || "");

  const [description, setDescription] = useState<string>(route.params.description || "");
  const [downThreshold, setDownThreshold] = useState<number>(route.params.down_threshold || 2);
  const [squadSize, setSquadSize] = useState<number>(4);

  const image_picker_options = {
    title: 'Select event photo',
    customButtons: imageUrl ? [{ name: 'remove', title: 'Remove photo' }] : [],
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
        setImageUrl(undefined)
      } else {
        setImageUrl(IMG_URL_BASE_64_PREFIX + response.data);
      }
    });
  }

  useEffect(() => {
    const endpoint = "get_users?squadId=" + squadId;
    const init: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    callBackend(endpoint, init).then(response => response.json()).then(data => {
      setSquadSize(data.user_info.length);
    });
  }, []);

  {/* Event image circle */ }
  const renderImageCircle = () => {
    return (
      <View style={AddEventStyles.event_pic_container}>
        <TouchableOpacity style={AddEventStyles.event_picture_button} onPress={() => { showImagePicker() }}>
          <Image source={imageUrl ? { uri: imageUrl } : require('../assets/upload_photo.png')} style={AddEventStyles.event_picture} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderEmoji = () => {
    return <EmojiPicker
      onEmojiPicked={(emoji: string) => setEmojiPicked(emoji)}
      emojiPickerTitle={"Select Event Emoji"}
      defaultEmoji={"🗓"}
    />
  };

  const renderPopover = () => {
    return (
      <Text style={AddEventStyles.toolTipText}>
        Once the minimum number of RSVPs is reached, the event is confirmed! Attendees will receive an invitation on Google Calendar. 
      </Text>
    )
  }

  const renderDownSlider = () => {
    return (
      <View>
        <View style={AddEventStyles.downThresholdAndIcon}>
          <Text style={AddEventStyles.downSliderText}>Minimum RSVPs Required: {downThreshold}   </Text>
          <Tooltip
                popover = { renderPopover() }
                backgroundColor = "#90BEDE"
                width = {220}
                height = {120}
            >
            <Entypo name='info-with-circle' style={AddEventStyles.infoIcon}/>
          </Tooltip>
        </View>
        {/* Allowing a maximum value of at least 2 in case not everybody has joined. */}
        <Slider minimumValue={1} maximumValue={Math.max(squadSize, 2)} step={1}
          value={downThreshold} onValueChange={setDownThreshold}
          thumbImage={require("../assets/down_static.png")}
          style={AddEventStyles.downSlider} minimumTrackTintColor="#90BEDE"/>
      </View>
    );
  };

  const addEventOnBackend = () => {
    const endpoint = "create_event";
    console.log(`startDate: ${startDate}`);
    const data = {
      email: userEmail,
      title: name || null,
      description: description || null,
      emoji: emoji,
      start_time: startDate ? moment(startDate).valueOf() : null,
      end_time: endDate ? moment(endDate).valueOf() : null,
      // TODO: Add address + lat/lng to add event page
      // address,
      // lat,
      // lng,
      squad_id: squadId,
      event_url: url || null,
      image_url: imageUrl || null,
      down_threshold: downThreshold
    };
    const init: RequestInit = {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    };
    callBackend(endpoint, init).then(() => navigation.navigate("Events"));
  };

  return (
    <View style={AddEventStyles.container}>
      {/* Event picture, where user can select a picture to be shown on event details page */}
      {renderImageCircle()}
      {/* Event name and URL that were chosen in the previous screens. */}
      <View style={AddEventStyles.emojiAndNameView}>
        {renderEmoji()}
        <TextInput defaultValue={name} onChangeText={setName} placeholder="Event name" multiline={true} style={AddEventStyles.textInput} />
      </View>
      {/* Commenting out URL for FMVP */}
      {/* <TextInput defaultValue={url} onChangeText={setUrl} placeholder="URL" style={AddEventStyles.optionalTextInput} /> */}
      {/* Combined start time, thumbnail, and end time block. */}
      <View style={AddEventStyles.dateView}>
        <View style={AddEventStyles.startDatePickerView}>
          <Text style={AddEventStyles.startEndText}>Start Time: </Text>
          <DateTimeInput onChange={setStartDate} initialValue={startDate} />
        </View>
        <View style={AddEventStyles.endDatePickerView}>
          <Text style={AddEventStyles.startEndText}>End Time: </Text>
          <DateTimeInput onChange={setEndDate} initialValue={endDate} />
        </View>
      </View>
      {/* Additional event information (more can be added here). */}
      {/* TODO: Create an image selector widget and fold it into the emoji selector. */}
      {/* <TextInput onChangeText={setImageUrl} placeholder="Image URL" style={AddEventStyles.optionalTextInput} /> */}
      <TextInput onChangeText={setDescription} placeholder="Description" multiline={true} style={AddEventStyles.optionalTextInput} />
      {/* Slider to specify the required attendance for this event. */}
      {renderDownSlider()}

      <View style={AddEventStyles.nextButton}>
        <Button onPress={addEventOnBackend} color= "#90BEDE" title="Let's go" />
      </View>
    </View>
  );
};

export default AddEventDetailsScreen;
