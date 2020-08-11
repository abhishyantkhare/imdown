import React, { useLayoutEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { EditSquadStyles } from "./edit_squad_styles";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import Divider  from '../components/divider/divider'
import { callBackend } from  "../backend/backend"

const EditSquad = (props) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);  
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


    {/* Squad title box */}
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
            <Text style = {EditSquadStyles.squad_emoji_text}>
                Squad Emoji:
            </Text>
            <View>
                <TouchableOpacity onPress={() => { setShowEmojiPicker(true) }}>
                    <Text style={EditSquadStyles.emoji}>
                    {`${squadEmoji}`}
                    </Text>
                </TouchableOpacity>
                <View style={{ alignSelf: "center" }}>
                    {renderEmojiPicker()}
                </View>
            </View>
        </SafeAreaView>
        )
    }

    const renderEmojiPicker = () => {
        return (
            showEmojiPicker &&
            <View style = {EditSquadStyles.emoji_picker_container}>
            <EmojiSelector
                category={Categories.symbols}
                onEmojiSelected={emoji => {
                    setSquadEmoji(emoji);
                    setShowEmojiPicker(false);
                }}
            />
            </View>
        )
    }

    const renderAdditionalFieldsBox = () => {
        return (
        <View style={EditSquadStyles.additional_fields_container}>
            { renderEmojiField() }
            { Divider() }
        </View>
        );
    }

    const renderSaveButton = () => {
        return (
        <View style = {{ alignItems: 'center' }}>
            <TouchableOpacity onPress={saveSquad}>
                <View style = {EditSquadStyles.save_button}>
                    <Text style = {EditSquadStyles.save_button_text}> {"Save"} </Text>
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
            { renderSquadTitleBox() }
            { renderAdditionalFieldsBox() }
            { renderSaveButton() }
        </ScrollView>
    );
}

export default EditSquad;
