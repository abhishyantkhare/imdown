import React, { useEffect, useState } from "react";
import { callBackend } from "../backend/backend";
import { Button, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import { AddEventStyles } from "./add_event_styles";
import Slider from "@react-native-community/slider";
import moment from "moment";
import DateTimeInput from "../components/date_time_input/date_time_input";

const AddEventDetailsScreen = ({ navigation, route }) => {
  const squadId = route.params.squadId;
  const userEmail = route.params.userEmail;

  // Prefilled from the previous screen(s).
  const [name, setName] = useState<string>(route.params.name || "");
  const [url, setUrl] = useState<string>(route.params.url || "");

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [emoji, setEmojiPicked] = useState<string>(route.params.emoji || "🗓");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState(route.params.image_url || "");

  const [description, setDescription] = useState<string>(route.params.description || "");
  const [downThreshold, setDownThreshold] = useState<number>(route.params.down_threshold || 2);
  const [squadSize, setSquadSize] = useState<number>(4);

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

  const renderEmoji = () => {
    return showEmojiPicker ? (
      <Modal>
        <EmojiSelector onEmojiSelected={emoji => {
          setEmojiPicked(emoji);
          setShowEmojiPicker(false);
        }} />
      </Modal>
    ) : (
      <TouchableOpacity onPress={() => setShowEmojiPicker(true)}>
        <Text style={AddEventStyles.emoji}>{emoji}</Text>
      </TouchableOpacity>
    );
  };
  const renderDownSlider = () => {
    return (
      <View>
        <Text style={AddEventStyles.downSliderText}>schedule once {downThreshold} people are down</Text>
        {/* Allowing a maximum value of at least 4 in case not everybody has joined. */}
        <Slider minimumValue={2} maximumValue={Math.max(squadSize, 4)} step={1}
                value={downThreshold} onValueChange={setDownThreshold}
                thumbImage={require("../assets/down_static.png")}
                style={AddEventStyles.downSlider} />
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
      {/* Event name and URL that were chosen in the previous screens. */}
      <TextInput defaultValue={name} onChangeText={setName} placeholder="Event name" style={AddEventStyles.textInput} />
      <TextInput defaultValue={url} onChangeText={setUrl} placeholder="URL" style={AddEventStyles.optionalTextInput} />
      {/* Combined start time, thumbnail, and end time block. */}
      <View style={AddEventStyles.dateAndIcon}>
        <DateTimeInput initialDateTime={startDate} onChange={setStartDate} />
        {renderEmoji()}
        <DateTimeInput initialDateTime={endDate} onChange={setEndDate} />
      </View>
      {/* Additional event information (more can be added here). */}
      {/* TODO: Create an image selector widget and fold it into the emoji selector. */}
      <TextInput onChangeText={setImageUrl} placeholder="Image URL" style={AddEventStyles.optionalTextInput} />
      <TextInput onChangeText={setDescription} placeholder="Description" style={AddEventStyles.optionalTextInput} />
      {/* Slider to specify the required attendance for this event. */}
      {renderDownSlider()}

      <View style={AddEventStyles.nextButton}>
        <Button onPress={addEventOnBackend} title="Let's go" />
      </View>
    </View>
  );
};

export default AddEventDetailsScreen;