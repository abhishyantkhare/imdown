import React, {useState } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text, TouchableOpacity, SafeAreaView } from "react-native";
import {AddSquadStyles} from "./add_squad_styles"
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { Squad } from "./squads"

type OwnProps = {
  visible: boolean,
  onPress: (squad: Squad) => void
}

const AddSquadModal = (props: OwnProps) => {
    const [squadName, setSquadName] = useState("")
    const [showSquadEmoji, setShowSquadEmoji] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiPicked, setEmojiPicked] = useState("😎"); 

    const addSquad = () => {
      const squad: Squad = {
        name: squadName,
        emoji: emojiPicked,
        events: []
      }
      props.onPress(squad)
    }

    const renderEmoji = () => {
      return (
        <View >
          <TouchableOpacity onPress={() => { setShowEmojiPicker(true) }} style={AddSquadStyles.squad_emoji}>
            <Text style={AddSquadStyles.emoji}>
             {`${showSquadEmoji ? emojiPicked : "😎"}`}
            </Text>
          </TouchableOpacity>
          <View style={AddSquadStyles.squad_emoji}>
            {renderEmojiPicker()}
          </View>
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
              setEmojiPicked(emoji);
              setShowEmojiPicker(false);
              setShowSquadEmoji(true);
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
          <View style={AddSquadStyles.container}>
            <SafeAreaView style={AddSquadStyles.emoji_and_squad_name_container}>
              {renderEmoji()}
              <TextInput placeholder={"add squad name"} onChangeText={(name) => setSquadName(name)} 
                style={AddSquadStyles.squad_name}
                placeholderTextColor = "lightgray"/>
            </SafeAreaView>
            
            <TouchableOpacity onPress={addSquad} style={AddSquadStyles.add_squad_button}>
              <Text style={AddSquadStyles.add_squad_text}>Done</Text>
            </TouchableOpacity>

          </View>

        </Modal>
    );
}

export default AddSquadModal;
