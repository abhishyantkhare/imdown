import React, { useState } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text } from "react-native";
import { AddEventStyles } from "./add_event_styles"
import { Event } from "./events"

type OwnProps = {
  visible: boolean,
  onPress: (event: Event) => void
}

const AddEventModal = (props: OwnProps) => {
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")

  const addEvent = () => {
    const event: Event = {
      name: eventName,
      description: eventDescription
    }
    props.onPress(event)
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
        <TouchableHighlight onPress={addEvent} style={AddEventStyles.add_event_button}>
          <Text>Add Event</Text>
        </TouchableHighlight>
      </View>
    </Modal>
  );
}

export default AddEventModal;
