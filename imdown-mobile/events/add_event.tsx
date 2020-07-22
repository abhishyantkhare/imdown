import React, { useState } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text } from "react-native";
import { AddEventStyles } from "./add_event_styles"
import { Event } from "./events"
import DatePickerModal from "../components/datepickermodal/datepickermodal";
import moment from 'moment';

type OwnProps = {
  visible: boolean,
  onPress: (event: Event) => void
}

const AddEventModal = (props: OwnProps) => {
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState();
  const [startDatePicked, setStartDatePicked] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState();
  const [endDatePicked, setEndDatePicked] = useState();


  const addEvent = () => {
    const event: Event = {
      name: eventName,
      description: eventDescription,
      start_ms: startDate ? moment(startDate).valueOf() : null,
      end_ms: endDate ? moment(endDate).valueOf() : null
    }
    props.onPress(event)
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



  return (
    <Modal
      transparent={false}
      visible={props.visible}
      presentationStyle={"formSheet"}
    >
      <View style={AddEventStyles.container}>
        <TextInput placeholder={"Add Event name"} onChangeText={(name) => setEventName(name)} />
        <TextInput placeholder={"Add Event description (optional)"} onChangeText={(desc) => setEventDescription(desc)} />
        {renderStartDate()}
        {renderEndDate()}
        <TouchableHighlight onPress={addEvent} style={AddEventStyles.add_event_button}>
          <Text>Add Event</Text>
        </TouchableHighlight>
      </View>
    </Modal>
  );
}

export default AddEventModal;
