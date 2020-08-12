import React, { useEffect, useState } from "react";
import { Button, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AddEventStyles } from "./add_event_styles";
import EmojiSelector from "react-native-emoji-selector";
import DateTimeInput from "../components/date_time_input/date_time_input";
import moment from "moment";
import { createStackNavigator } from "@react-navigation/stack";
import { callBackend } from "../backend/backend";
import { Event } from "./events";
import Slider from "@react-native-community/slider";

const Stack = createStackNavigator();

/**
 * This is the entry screen. Enter a title and navigate directly to the details page, or navigate to the URL search
 * screen.
 */
// TODO: Appropriately type these props (see https://reactnavigation.org/docs/typescript).
const AddEventNameScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");

  const goToAddMoreInfo = () => {
    navigation.navigate("Add Event Details", { name });
  };

  return (
    <View style={AddEventStyles.container}>
      <View style={AddEventStyles.topRightButton}>
        <Button title="From URL" onPress={() => navigation.navigate("Add Event URL")} />
      </View>
      <TextInput autoFocus onChangeText={setName} placeholder="Event name" style={AddEventStyles.largeTextInput} />
      <View style={AddEventStyles.nextButton}>
        <Button title="Next" onPress={goToAddMoreInfo} disabled={!name} />
      </View>
    </View>
  );
};

/**
 * This is an optional screen to provide a URL for the event. It will be used to pre-populate the Add Event screen by
 * getting an Event response from the backend.
 */
const AddEventURLScreen = ({ navigation, route }) => {
  const [dummyEventURL, setEventURL] = useState("https://www.carnival.com/itinerary/4-day-western-caribbean-cruise/mobile/sensation/4-days/wc0");
  const [isSearchingForEvent, setIsSearchingForEvent] = useState(false);

  const searchForExternalEvent = () => {
    setIsSearchingForEvent(true);
    // "Call backend".
    setTimeout(() => {
      setIsSearchingForEvent(false);
      const dummyEvent: Event = {
        creator_user_id: 0,
        id: 999,
        name: "Caribbean Cruise",
        emoji: "🌞",
        description: "fun in de sun",
        image_url: "https://s26162.pcdn.co/wp-content/uploads/2019/05/black-death.jpg",
        rsvp_users: [],
        declined_users: [],
        down_threshold: 2,
        url: dummyEventURL
      };
      navigation.navigate("Add Event Details", dummyEvent);
    }, 1000);
  };

  return (
    <View style={AddEventStyles.container}>
      <TextInput onChangeText={setEventURL} placeholder="Event URL" style={AddEventStyles.textInput} />
      {/* Here is where the result from the backend will be displayed. */}
      <View style={AddEventStyles.nextButton}>
        <Button title="Search 🔮" onPress={searchForExternalEvent} disabled={isSearchingForEvent} />
      </View>
    </View>
  );
};

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

const AddEvent = ({ route }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Add Event Name" component={AddEventNameScreen} />
      <Stack.Screen name="Add Event URL" component={AddEventURLScreen} />
      <Stack.Screen name="Add Event Details" component={AddEventDetailsScreen}
                    initialParams={{ squadId: route.params.squadId, userEmail: route.params.userEmail }} />
    </Stack.Navigator>
  );
};

export default AddEvent;
