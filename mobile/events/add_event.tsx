import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, Slider, Text, TextInput, TouchableHighlight, TouchableOpacity, View, YellowBox } from "react-native";
import { AddEventStyles } from "./add_event_styles"
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import DatePickerModal from "../components/datepickermodal/datepickermodal";
import moment from 'moment';
import { createStackNavigator } from "@react-navigation/stack";
import { callBackend } from  "../backend/backend"

// This warning appears when passing a callback function (to "return" an Event).
// TODO: Revisit react-navigation as a way to solve this problem. This warning suggests that these screens are not
//       intended to pass back any data. Including this in one big EventScreen class may also be a good solution.
YellowBox.ignoreWarnings(["Non-serializable values were found in the navigation state"]);

const Stack = createStackNavigator();


// TODO: Appropriately type these props (see https://reactnavigation.org/docs/typescript).
const AddInfo = ({ navigation, route }) => {
  const DEFAULT_EMOJI = "🗓"
  const squadId = route.params.squadId
  
  const [eventImageURL, setEventImageURL] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventURL, setEventURL] = useState("");
  const [emojiPicked, setEmojiPicked] = useState(DEFAULT_EMOJI);
  const [numSquadMembers, setNumSquadMembers] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const endpoint = 'get_users?squadId=' + squadId
    const init: RequestInit = {
        method: "GET",
        headers: {
        'Content-Type': 'application/json'
        },
    }
    callBackend(endpoint, init).then(response => { 
        return response.json();
    }).then(data => { 
      setNumSquadMembers(data.user_info.length);
    });
  }, []);  

  const goToAddMoreInfo = () => {
    navigation.navigate("Enter Additional Info", { emojiPicked, eventName, eventURL, eventImageURL, numSquadMembers });
  }

  const renderTitleEmojiBox = () => {
    return (
        <SafeAreaView style={AddEventStyles.emoji_and_event_name_container}>
          <View>
            <TouchableOpacity onPress={() => { setShowEmojiPicker(true) }}>
              <Text style={AddEventStyles.emoji}>
                {`${emojiPicked}`}
              </Text>
            </TouchableOpacity>
            <View style={{ alignSelf: "center" }}>
              {renderEmojiPicker()}
            </View>
          </View>
          <TextInput autoFocus onChangeText={(name) => setEventName(name)} placeholder={"Event title"} style = {AddEventStyles.event_name} />
        </SafeAreaView>
    )
  }

  const renderEmojiPicker = () => {
    return (
        showEmojiPicker &&
        <View style = {AddEventStyles.emoji_picker_container}>
          <EmojiSelector
            category={Categories.symbols}
            onEmojiSelected={emoji => {
                setEmojiPicked(emoji);
                setShowEmojiPicker(false);
            }}
          />
        </View>
    )
  }

  return (
    <View style={AddEventStyles.container}>
      { renderTitleEmojiBox() }
      {/* Including a URL will allow us to pre-populate the other fields! */}
      <TextInput onChangeText={(URL) => setEventURL(URL)} placeholder={"Event URL"} />
      <TextInput onChangeText={(URL) => setEventImageURL(URL)} placeholder={"Event Image URL"} />
      <Button disabled={!(eventName || eventURL)} onPress={goToAddMoreInfo} title={"Add Event"} />
    </View>
  );
}

const AddMoreInfo = ({ navigation, route }) => {
  const calcDefaultDownThreshold = (numSquadMembers: number) => {
    // Default down threshold is half the number of people in the squad, rounded up.
    return Math.ceil(numSquadMembers/2)
  }

  const emojiPicked = route.params.emojiPicked;
  const eventImageURL = route.params.eventImageURL;
  const eventName = route.params.eventName;
  const eventURL = route.params.eventURL;
  const numSquadMembers = route.params.numSquadMembers
  const squadId = route.params.squadId;
  const userEmail = route.params.userEmail
  const [eventDescription, setEventDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState();
  const [startDatePicked, setStartDatePicked] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState();
  const [endDatePicked, setEndDatePicked] = useState();
  const [downThreshold, setDownThreshold] = useState(calcDefaultDownThreshold(numSquadMembers));
 
  const renderStartDatePicker = () => {
    return (
      showStartDatePicker &&
      <DatePickerModal
          onSubmit={(startDate: Date) => {
            setStartDate(startDate);
            setShowStartDatePicker(false);
            setStartDatePicked(true);
          }}
      />
    )
  }

  const renderEndDate = () => {
    return (
      <View>
        <TouchableHighlight onPress={() => { setShowEndDatePicker(true) }}>
          <Text>
            {`End Date: ${endDatePicked ? moment(endDate).toLocaleString() : "TBD"}`}
          </Text>
        </TouchableHighlight>
        {renderEndDatePicker()}
      </View>
    )
  }

  const renderEndDatePicker = () => {
    return (
      showEndDatePicker &&
      <DatePickerModal
          onSubmit={(endDate) => {
            setEndDate(endDate);
            setShowEndDatePicker(false);
            setEndDatePicked(true);
          }}
      />
    )
  }

  const renderStartDate = () => {
    return (
      <View>
        <TouchableHighlight onPress={() => { setShowStartDatePicker(true) }}>
          <Text>
            {`Start Date: ${startDatePicked ? moment(startDate).toLocaleString() : "TBD"}`}
          </Text>
        </TouchableHighlight>
        {renderStartDatePicker()}
      </View>
    )
  }
  const addEventOnBackend = () => {
    const endpoint = 'create_event'
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
        },
    }
    callBackend(endpoint, init).then(() => { navigation.navigate("Events") })
  }

  return (
    <View style={AddEventStyles.container}>
      <Text>{route.params.eventName}</Text>
      <TextInput placeholder={"Event description"}
                 onChangeText={(desc) => setEventDescription(desc)} />
      {renderStartDate()}
      {renderEndDate()}
      <View>
        <Text style={{color: 'gray'}}>Number of people down to auto create event: {downThreshold}</Text>
        <Slider minimumValue={0} maximumValue={numSquadMembers} step={1} value={downThreshold} onValueChange={(sliderValue: number) => setDownThreshold(sliderValue)}>
        </Slider>
      </View>
      <Button title={"Let's go"} onPress={addEventOnBackend} />
    </View>
  );
}

const AddEvent = ({ route }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Enter Info" component={AddInfo} initialParams={{ squadId: route.params.squadId }}/>
      <Stack.Screen name="Enter Additional Info" component={AddMoreInfo}
                    initialParams={{ squadId: route.params.squadId, userEmail: route.params.userEmail, addEvent: route.params.addEvent }} />
    </Stack.Navigator>
  );
}

export default AddEvent;
