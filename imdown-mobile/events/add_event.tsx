import React, {useState } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text } from "react-native";
import {AddEventStyles} from "./add_event_styles"

type OwnProps = {
  visible: boolean,
  onPress: (eventName: string) => void
}

const AddEventModal = (props: OwnProps) => {
    const [eventName, setEventName] = useState("")


    return (
        <Modal
          transparent={false}
          visible={props.visible}
          presentationStyle={"formSheet"}
        >
          <View style={AddEventStyles.container}>
            <TextInput placeholder={"Add Event name"} onChangeText={(name) => setEventName(name)}/>
            <TouchableHighlight onPress={() => props.onPress(eventName)} style={AddEventStyles.add_event_button}>
              <Text>Add Event</Text>
            </TouchableHighlight>
          </View>
        </Modal>
    );
}

export default AddEventModal;
