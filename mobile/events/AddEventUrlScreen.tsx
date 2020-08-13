import React, { useState } from "react";
import { Event } from "./events";
import { Button, TextInput, View } from "react-native";
import { AddEventStyles } from "./add_event_styles";

/**
 * This is an optional screen to provide a URL for the event. It will be used to pre-populate the Add Event screen by
 * getting an Event response from the backend.
 */
const AddEventUrlScreen = ({ navigation, route }) => {
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

export default AddEventUrlScreen;
