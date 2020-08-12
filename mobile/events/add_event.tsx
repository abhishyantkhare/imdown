import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, Slider, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AddEventStyles } from "./add_event_styles"
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import DateTimeInput from "../components/date_time_input/date_time_input";
import moment from 'moment';
import { createStackNavigator } from "@react-navigation/stack";
import { callBackend } from "../backend/backend";
import { Event } from "./events";

const Stack = createStackNavigator();

/**
 * This is the entry screen. Enter a title and navigate directly to the details page, or navigate to the URL search
 * screen.
 */
// TODO: Appropriately type these props (see https://reactnavigation.org/docs/typescript).
const AddEventNameScreen = ({ navigation, route }) => {
  const [eventName, setEventName] = useState("");

  const goToAddMoreInfo = () => {
    navigation.navigate("Add Event Details", { name: eventName });
  };

  return (
    <View style={AddEventStyles.container}>
      <View style={AddEventStyles.from_url_button}>
        <Button title="From URL" onPress={() => navigation.navigate("Add Event URL")} />
      </View>
      <TextInput autoFocus onChangeText={setEventName} placeholder={"Event name"} style={AddEventStyles.event_name} />
      <View style={AddEventStyles.next_button}>
        <Button title={"Next"} onPress={goToAddMoreInfo} disabled={!eventName} />
      </View>
    </View>
  );
}

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
        id: 999,
        name: "Caribbean Cruise",
        emoji: "🌞",
        description: "fun in de sun",
        image_url: "https://s26162.pcdn.co/wp-content/uploads/2019/05/black-death.jpg",
        rsvp_users: [],
        declined_users: [],
        down_threshold: 2,
        url: dummyEventURL
      }
      navigation.navigate("Add Event Details", dummyEvent);
    }, 1000);
  }

  return (
    <View style={AddEventStyles.container}>
      {/* Including a URL will allow us to pre-populate the other fields! */}
      <TextInput onChangeText={setEventURL} placeholder={"Event URL"} />
      <Button title="Search 🔮" onPress={searchForExternalEvent} disabled={isSearchingForEvent} />
    </View>
  );
}

const AddEventDetailsScreen = ({ navigation, route }) => {
  const squadId = route.params.squadId;
  const userEmail = route.params.userEmail

  // Prefilled from the previous screen(s).
  const [eventName, setEventName] = useState(route.params.name || "");
  const [eventURL, setEventURL] = useState(route.params.url || "");

  const [eventImageURL, setEventImageURL] = useState(route.params.image_url || "");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [eventDescription, setEventDescription] = useState<string>("");
  const [downThreshold, setDownThreshold] = useState<number>(1);
  const [squadSize, setSquadSize] = useState<number>(1);
  const [emojiPicked, setEmojiPicked] = useState(route.params.emoji || "🗓");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const endpoint = 'get_users?squadId=' + squadId
    const init: RequestInit = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }
    callBackend(endpoint, init).then(response => response.json()).then(data => {
      setSquadSize(data.user_info.length);
      setDownThreshold(Math.round(data.user_info.length / 2));
    });
  }, []);

  const renderEmojiBox = () => {
    return (
      <SafeAreaView style={AddEventStyles.emoji_and_event_name_container}>
        <TouchableOpacity onPress={() => { setShowEmojiPicker(true) }}>
          <Text style={AddEventStyles.emoji}>
            {`${emojiPicked}`}
          </Text>
        </TouchableOpacity>
        <View style={{ alignSelf: "center" }}>
          {renderEmojiPicker()}
        </View>
      </SafeAreaView>
    )
  }

  const renderEmojiPicker = () => {
    return (
      showEmojiPicker &&
      <View style={AddEventStyles.emoji_picker_container}>
        <EmojiSelector
          category={Categories.all}
          showSearchBar={false}
          onEmojiSelected={emoji => {
            setEmojiPicked(emoji);
            setShowEmojiPicker(false);
          }}
        />
      </View>
    )
  }

  const addEventOnBackend = () => {
    const endpoint = 'create_event'
    console.log(`startDate: ${startDate}`)
    const data = {
      email: userEmail,
      title: eventName || null,
      description: eventDescription || null,
      emoji: emojiPicked,
      start_time: startDate ? moment(startDate).valueOf() : null,
      end_time: endDate ? moment(endDate).valueOf() : null,
      // TODO: Add address + lat/lng to add event page
      // address,
      // lat,
      // lng,
      squad_id: squadId,
      event_url: eventURL || null,
      image_url: eventImageURL || null,
      down_threshold: downThreshold
    }
    const init: RequestInit = {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    callBackend(endpoint, init).then(() => {
      navigation.navigate("Events")
    })
  }

  return (
    <View style={AddEventStyles.container}>
      <TextInput defaultValue={eventName} onChangeText={setEventName} placeholder={"Event name"} />
      <TextInput defaultValue={eventURL} onChangeText={setEventURL} placeholder={"Event URL"} />
      <TextInput onChangeText={(URL) => setEventImageURL(URL)} placeholder={"Event Image URL 🥵"} />
      {renderEmojiBox()}
      <DateTimeInput onChange={setStartDate} defaultSelectorValue={startDate} />
      <DateTimeInput onChange={setEndDate} defaultSelectorValue={endDate} />
      <TextInput placeholder={"Event description"} onChangeText={setEventDescription} />
      <View>
        <Text style={{ color: 'gray' }}>Number of people down to auto create event: {downThreshold}</Text>
        <Slider minimumValue={0} maximumValue={squadSize} step={1} value={downThreshold}
                onValueChange={(sliderValue: number) => setDownThreshold(sliderValue)}>
        </Slider>
      </View>
      <Button title={"Let's go"} onPress={addEventOnBackend} />
    </View>
  );
}

const AddEvent = ({ route }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Add Event Name" component={AddEventNameScreen} />
      <Stack.Screen name="Add Event URL" component={AddEventURLScreen} />
      <Stack.Screen name="Add Event Details" component={AddEventDetailsScreen}
                    initialParams={{ squadId: route.params.squadId, userEmail: route.params.userEmail }} />
    </Stack.Navigator>
  );
}

export default AddEvent;
