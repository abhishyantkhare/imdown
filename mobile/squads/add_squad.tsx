import React, { useState } from "react";
import { View, Modal, TextInput, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { AddSquadStyles } from "./add_squad_styles"
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { Squad } from "./squads"
import { callBackend } from "../backend/backend"

type OwnProps = {
    visible: boolean,
    email: string,
    admin_id: number,
    onPress: (squad: Squad) => void
}

const DEFAULT_EMOJI = "😎"
const ADD_SQUAD_BY_CODE_TITLE = "Have a Squad Code? Enter It Here"
const ADD_SQUAD_BY_CODE_PLACEHOLDER = "enter squad code"
const CREATE_NEW_SQUAD_TITLE = "Create A New Squad"
const CREATE_NEW_SQUAD_PLACEHOLDER = "add squad name"
const OR_TEXT = "OR"

const AddSquadModal = (props: OwnProps) => {
    const [squadId, setSquadId] = useState()
    const [squadName, setSquadName] = useState("")
    const [showSquadEmoji, setShowSquadEmoji] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiPicked, setEmojiPicked] = useState(DEFAULT_EMOJI);
    const [squadCode, setSquadCode] = useState("")

    const addSquadOnBackend = () => {
        const endpoint = 'create_squad'
        const data = {
            email: props.email,
            admin_id: props.admin_id,
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
        callBackend(endpoint, init).then(() => { addSquad() })
    }
    
    const addSquadByCodeOnBackend = () => {
        const endpoint = 'add_to_squad'
        const data = {
            email: props.email,
            squad_code: squadCode
        }
        const init: RequestInit = {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        callBackend(endpoint, init).then(() => { addSquad() })
    }

    const addSquad = () => {
        const squad: Squad = {
            id: squadId,
            name: squadName,
            squad_emoji: emojiPicked,
        }
        props.onPress(squad)
    }

    const renderEmoji = () => {
        return (
            <View >
                <TouchableOpacity onPress={() => { setShowEmojiPicker(true) }} style={AddSquadStyles.squad_emoji}>
                    <Text style={AddSquadStyles.emoji}>
                        {`${showSquadEmoji ? emojiPicked : DEFAULT_EMOJI}`}
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
                onEmojiSelected={emoji => {
                    setEmojiPicked(emoji);
                    setShowEmojiPicker(false);
                    setShowSquadEmoji(true);
                }}
            />
        )
    }

    const renderAddSquadByCode = () => {
        return (
            <View style={AddSquadStyles.add_container}>
                <Text style={AddSquadStyles.add_title}>
                    {ADD_SQUAD_BY_CODE_TITLE}
                </Text>
                <SafeAreaView >
                    <TextInput placeholder={ADD_SQUAD_BY_CODE_PLACEHOLDER} onChangeText={(code) => setSquadCode(code)}
                        style={AddSquadStyles.squad_name}
                        placeholderTextColor="lightgray" />
                </SafeAreaView>
                {squadCode.length > 0 ? renderAddSquadByCodeDoneButton() : null}
            </View>
        )
    }

    const renderAddSquadByCodeDoneButton = () => {
        return (
            <TouchableOpacity onPress={addSquadByCodeOnBackend} style={AddSquadStyles.add_squad_button}>
                <Text style={AddSquadStyles.add_squad_text}>Done</Text>
            </TouchableOpacity>
        )
    }

    const renderCreateNewSquad = () => {
        return (
            <View style={AddSquadStyles.add_container}>
                <Text style={AddSquadStyles.add_title}>
                    {CREATE_NEW_SQUAD_TITLE}
                </Text>
                <SafeAreaView style={AddSquadStyles.emoji_and_squad_name_container}>
                    {renderEmoji()}
                    <TextInput placeholder={CREATE_NEW_SQUAD_PLACEHOLDER} onChangeText={(name) => setSquadName(name)}
                        style={AddSquadStyles.squad_name}
                        placeholderTextColor="lightgray" />
                </SafeAreaView>
                {squadName.length > 0 ? renderCreateNewSquadDoneButton() : null}
            </View>
        )
    }

    const renderCreateNewSquadDoneButton = () => {
        return (
            <TouchableOpacity onPress={addSquadOnBackend} style={AddSquadStyles.add_squad_button}>
                <Text style={AddSquadStyles.add_squad_text}>Done</Text>
            </TouchableOpacity>
        )
    }

    return (
        <Modal
            transparent={false}
            visible={props.visible}
            presentationStyle={"formSheet"}
        >
            <View style={AddSquadStyles.container}>
                {renderAddSquadByCode()}
                <Text style={AddSquadStyles.or_text}>
                    {OR_TEXT}

                </Text>
                {renderCreateNewSquad()}
            </View>

        </Modal>
    );
}

export default AddSquadModal;
