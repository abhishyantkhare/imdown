import React, {useState } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text, TouchableOpacity, SafeAreaView } from "react-native";
import {AddSquadStyles} from "./add_squad_styles"
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { Squad } from "./squads"
import { BACKEND_URL, callBackend } from "../backend/backend"

type OwnProps = {
  visible: boolean,
  email: string,
  onPress: (squad: Squad) => void
}

const DEFAULT_EMOJI = "😎"

const AddSquadModal = (props: OwnProps) => {
    const [squadName, setSquadName] = useState("")
    const [showSquadEmoji, setShowSquadEmoji] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiPicked, setEmojiPicked] = useState(DEFAULT_EMOJI);

    const addSquadOnBackend = () => {
      const endpoint = 'create_squad'
      const data = {
        email: props.email,
        squad_name: squadName,
        squad_emoji: emojiPicked
      }
      const init: RequestInit = {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
      }
      callBackend(endpoint, init).then((resp: Response) => {
        resp.text()
      }).then(result => { addSquad() })
    }
    
    const addSquad = () => {
      const squad: Squad = {
        name: squadName,
        emoji: emojiPicked,
        email: props.email,
        events: []
      }
      props.onPress(squad)
    }

    const renderEmoji = () => {
      return (
        <View >
          <TouchableOpacity onPress={() => { setShowEmojiPicker(true) }} style={AddSquadStyles.squad_emoji}>
            <Text style={AddSquadStyles.emoji}>
             {`${showSquadEmoji ? emojiPicked : DEFAULT_EMOJI }`}
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
            
            <TouchableOpacity onPress={addSquadOnBackend} style={AddSquadStyles.add_squad_button}>
              <Text style={AddSquadStyles.add_squad_text}>Done</Text>
            </TouchableOpacity>

          </View>

        </Modal>
    );
}

export default AddSquadModal;
