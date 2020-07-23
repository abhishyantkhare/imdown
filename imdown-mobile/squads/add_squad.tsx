import React, {useState } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text } from "react-native";
import {AddSquadStyles} from "./add_squad_styles"
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { Event } from "./events"


type OwnProps = {
  visible: boolean,
  onPress: (squadName: string) => void
  // onPress: (event: Event) => void
}

const AddSquadModal = (props: OwnProps) => {
    const [squadName, setSquadName] = useState("")
    const [squadEmoji, setSquadEmoji] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState();
    const [emojiPicked, setEmojiPicked] = useState();  

    // const addSquad = () => {
    //   const event: Event = {
    //     name: squadName,
    //   }
    //   props.onPress(event)
    // }

    const renderEmoji = () => {
      return (
        <View >
          <TouchableHighlight onPress={() => { setShowEmojiPicker(true) }} style={AddSquadStyles.add_squad_emoji}>
            <Text style={AddSquadStyles.emoji}>
             {`${emojiPicked ? squadEmoji : "TBD"}`}
            </Text>
          </TouchableHighlight>
          {renderEmojiPicker()}
         </View>
      )
    }

    const renderEmojiPicker = () => {
      return (
        showEmojiPicker &&
        <EmojiSelector
          category={Categories.symbols}
          onEmojiSelected={emoji => 
            {
              console.log(emoji)
              setSquadEmoji(emoji);
              setShowEmojiPicker(false);
              setEmojiPicked(true);
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
          <View style={AddSquadStyles.nameEmojiContainer}>
            {renderEmoji()}
            <TextInput placeholder={"add squad name"} onChangeText={(name) => setSquadName(name)} 
              style={AddSquadStyles.squad_name}
              placeholderTextColor = "lightgray"/>

            <TouchableHighlight onPress={() => props.onPress(squadName)} style={AddSquadStyles.add_squad_button}>
              <Text style={AddSquadStyles.add_squad_text}>Add Squad</Text>
            </TouchableHighlight>
          </View>
        </Modal>
    );
}

export default AddSquadModal;
