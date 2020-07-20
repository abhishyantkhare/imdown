import React, {useState } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text } from "react-native";
import {AddGroupStyles} from "./add_group_styles"

type OwnProps = {
  visible: boolean,
  onPress: (groupName: string) => void
}

const AddGroupModal = (props: OwnProps) => {
    const [groupName, setGroupName] = useState("")


    return (
        <Modal
          transparent={false}
          visible={props.visible}
          presentationStyle={"formSheet"}
        >
          <View style={AddGroupStyles.container}>
            <TextInput placeholder={"Add group name"} onChangeText={(name) => setGroupName(name)}/>
            <TouchableHighlight onPress={() => props.onPress(groupName)} style={AddGroupStyles.add_group_button}>
              <Text>Add Group</Text>
            </TouchableHighlight>
          </View>
        </Modal>
    );
}

export default AddGroupModal;
