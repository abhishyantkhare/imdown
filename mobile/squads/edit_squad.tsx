import React, { useLayoutEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, _View } from "react-native";
import { EditSquadStyles } from "./edit_squad_styles";
import EmojiPicker from "../components/emojipicker/EmojiPicker";
import Divider from '../components/divider/divider'
import { callBackend } from "../backend/backend"

const EditSquad = (props) => {
    const [squadId, setSquadId] = useState(props.route.params.squadId);
    const [squadName, setSquadName] = useState(props.route.params.squadName);
    const [squadEmoji, setSquadEmoji] = useState(props.route.params.squadEmoji);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => props.navigation.pop()}
                    title=" Cancel"
                    color="#007AFF"
                />
            ),
        });
    }, [props.navigation]);


    {/* Squad title box */ }
    const renderSquadTitleBox = () => {
        return (
            <View style={EditSquadStyles.squad_title_container}>
                <TextInput style={EditSquadStyles.squad_title} placeholder="Squad Name" value={squadName} onChangeText={(value) => setSquadName(value)} />
            </View>
        );
    }


    const renderEmojiField = () => {
        return (
            <SafeAreaView style={EditSquadStyles.emoji_container}>
                <Text style={EditSquadStyles.squad_emoji_text}>
                    Squad Emoji:
            </Text>
                <EmojiPicker
                    onEmojiPicked={setSquadEmoji}
                    emojiPickerTitle={"Select Squad Emoji"}
                    defaultEmoji={props.route.params.squadEmoji}
                />
            </SafeAreaView>
        )
    }


    const renderAdditionalFieldsBox = () => {
        return (
            <View style={EditSquadStyles.additional_fields_container}>
                {renderEmojiField()}
                {Divider()}
            </View>
        );
    }

    const renderSaveButton = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={saveSquad}>
                    <View style={EditSquadStyles.save_button}>
                        <Text style={EditSquadStyles.save_button_text}> {"Save"} </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }


    const saveSquad = () => {
        const endpoint = 'edit_squad'
        const data = {
            squad_id: squadId,
            squad_name: squadName,
            squad_emoji: squadEmoji
        }
        const init: RequestInit = {
            method: 'PUT',
            mode: 'no-cors',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        callBackend(endpoint, init).then(() => { props.navigation.pop() })
    }

    return (
        <ScrollView style={EditSquadStyles.container} >
            {renderSquadTitleBox()}
            {renderAdditionalFieldsBox()}
            {renderSaveButton()}
        </ScrollView>
    );
}

export default EditSquad;
