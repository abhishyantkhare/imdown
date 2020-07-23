import React, {useState } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text, TouchableOpacity, SafeAreaView } from "react-native";
import {AddSquadStyles} from "./add_squad_styles"
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { Event } from "./events"


type OwnProps = {
  visible: boolean,
  // onPress: (squadName: string) => void
  onPress: (squad: Squad) => void
}

const AddSquadModal = (props: OwnProps) => {
    const [squadName, setSquadName] = useState("")
    const [squadEmoji, setSquadEmoji] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState();
    const [emojiPicked, setEmojiPicked] = useState();  
    // const [test, setTest] = useState(); 

    const addSquad = () => {
      const squad: Squad = {
        name: squadName,
        emoji: emojiPicked
      }
      props.onPress(squad)
    }

    const renderEmoji = () => {
      return (
        <View >
          {/* <Text style={AddSquadStyles.add_squad_text}>Pick squad emoji: </Text> */}
          <TouchableOpacity onPress={() => { setShowEmojiPicker(true) }} style={AddSquadStyles.squad_emoji}>
            <Text style={AddSquadStyles.emoji}>
             {`${emojiPicked ? squadEmoji : "😎"}`}
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

            {/* <View style={AddSquadStyles.addSquadButton}>
              <TouchableOpacity onPress={addSquad} style={AddSquadStyles.add_squad_button}>
                <Text style={AddSquadStyles.add_squad_text}>Done</Text>
              </TouchableOpacity>
            </View> */}

          </View>

          {/* <View style={AddSquadStyles.addSquadButton}>
              <TouchableOpacity onPress={addSquad} style={AddSquadStyles.add_squad_button}>
                <Text style={AddSquadStyles.add_squad_text}>Done</Text>
              </TouchableOpacity>
            </View> */}

        </Modal>
    );
}

export default AddSquadModal;
