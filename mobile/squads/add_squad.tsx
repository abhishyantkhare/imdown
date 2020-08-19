import React, { useState } from "react";
import { Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AddSquadStyles } from "./add_squad_styles";
import EmojiPicker from "../components/emojipicker/EmojiPicker";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { callBackend } from "../backend/backend";
import { ScrollView } from "react-native-gesture-handler";
import { RootStackParamList } from "../App";

type AddSquadNavigationProp = StackNavigationProp<
    RootStackParamList,
    'AddSquad'
>;

type AddSquadRouteProp = RouteProp<RootStackParamList, 'AddSquad'>;

type AddSquadProps = {
    navigation: AddSquadNavigationProp;
    route: AddSquadRouteProp
};


const DEFAULT_EMOJI = "😎"
const ADD_SQUAD_BY_CODE_TITLE = "Have a Squad Code? Enter It Here"
const ADD_SQUAD_BY_CODE_PLACEHOLDER = "enter squad code"
const CREATE_NEW_SQUAD_TITLE = "Create A New Squad"
const CREATE_NEW_SQUAD_PLACEHOLDER = "add squad name"
const OR_TEXT = "OR"

const AddSquad = (props: AddSquadProps) => {
    const [squadName, setSquadName] = useState("")
    const [emojiPicked, setEmojiPicked] = useState(DEFAULT_EMOJI);
    const [squadCode, setSquadCode] = useState("")

    const email = props.route.params.email

    const addSquadOnBackend = () => {
        const endpoint = 'create_squad'
        const data = {
            email: email,
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
        callBackend(endpoint, init).then(() => { props.navigation.pop() })
    }

    const addSquadByCodeOnBackend = () => {
        const endpoint = 'add_to_squad'
        const data = {
            email: email,
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
        callBackend(endpoint, init).then(() => { props.navigation.pop() })
    }

    const renderEmoji = () => {
        return <EmojiPicker
            onEmojiPicked={(emoji: string) => setEmojiPicked(emoji)}
            emojiPickerTitle={"Select Squad Emoji"}
        />
    }

    const renderAddSquadByCode = () => {
        return (
            <View style={AddSquadStyles.add_container}>
                <Text style={AddSquadStyles.add_title}>
                    {ADD_SQUAD_BY_CODE_TITLE}
                </Text>
                <SafeAreaView >
                    <TextInput
                        placeholder={ADD_SQUAD_BY_CODE_PLACEHOLDER}
                        autoCapitalize={'none'}
                        onChangeText={(code) => setSquadCode(code)}
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
        <View style={AddSquadStyles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false} >
                {renderAddSquadByCode()}
                <Text style={AddSquadStyles.or_text}>
                    {OR_TEXT}
                </Text>
                {renderCreateNewSquad()}
            </ScrollView>
        </View>

    );
}


export default AddSquad;
