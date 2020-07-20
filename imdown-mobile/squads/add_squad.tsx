import React, {useState } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text } from "react-native";
import {AddSquadStyles} from "./add_squad_styles"

type OwnProps = {
  visible: boolean,
  onPress: (squadName: string) => void
}

const AddSquadModal = (props: OwnProps) => {
    const [squadName, setSquadName] = useState("")


    return (
        <Modal
          transparent={false}
          visible={props.visible}
          presentationStyle={"formSheet"}
        >
          <View style={AddSquadStyles.container}>
            <TextInput placeholder={"Add squad name"} onChangeText={(name) => setSquadName(name)}/>
            <TouchableHighlight onPress={() => props.onPress(squadName)} style={AddSquadStyles.add_squad_button}>
              <Text>Add Squad</Text>
            </TouchableHighlight>
          </View>
        </Modal>
    );
}

export default AddSquadModal;
