import React, { useState } from "react";
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AddSquadStyles } from "./add_squad_styles";
import { TextStyles } from "../TextStyles";
import EmojiPicker from "../components/emojipicker/EmojiPicker";
import { callBackend } from "../backend/backend";
import { ScrollView } from "react-native-gesture-handler";
import AppNavRouteProp from "../types/navigation";
import { showMessage } from "react-native-flash-message";
import { StandardButton } from "../components/button/Button"
import BlurModal from "../components/blurmodal/BlurModal"



type AddSquadProps = AppNavRouteProp<'AddSquad'>

const DEFAULT_EMOJI = "😎"
const ADD_SQUAD_BY_CODE_TITLE = "Have a Squad Code? Enter It Here"
const ADD_SQUAD_BY_CODE_PLACEHOLDER = "Code"
const CREATE_NEW_SQUAD_PLACEHOLDER = "Enter squad name..."

const AddNewSquad = (props: AddSquadProps) => {
    const [squadName, setSquadName] = useState("")
    const [emojiPicked, setEmojiPicked] = useState(DEFAULT_EMOJI);
    const [createSquadSuccessModal, setCreateSquadSuccessModal] = useState(false)
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
        callBackend(endpoint, init).then(response => {
            return response.json();
        }).then(data => {
            setSquadCode(data.code)
            setCreateSquadSuccessModal(true);
        });
    }

    const renderCreateNewSquad = () => {
        return (
            <View style={AddSquadStyles.add_container}>
                <SafeAreaView style={AddSquadStyles.emoji_and_squad_name_container}>
                    <View style={AddSquadStyles.emojiBox}>
                        <EmojiPicker onEmojiPicked={(emoji: string) => setEmojiPicked(emoji)} emojiPickerTitle={"Select Squad Emoji"} />
                    </View>
                    <TextInput placeholder={CREATE_NEW_SQUAD_PLACEHOLDER} onChangeText={(name) => setSquadName(name)}
                        multiline={true}
                        style={[TextStyles.headerLarge, AddSquadStyles.squadNameText]}
                        placeholderTextColor="lightgray" />
                </SafeAreaView>
            </View>
        )
    }

    const renderCreateSquadSuccessModal = () => {
        return (
            <BlurModal visible={createSquadSuccessModal}>
                <Image source={require('../assets/success_icon.png')} style={AddSquadStyles.successIcon} />
                <Text style={[TextStyles.headerLarge, AddSquadStyles.successText]}>Success!</Text>
                <TextInput editable={false} multiline={true} style={[TextStyles.paragraph, AddSquadStyles.squadCreateModalText]}>Your squad <Text style={{ fontFamily: "Roboto_700Bold" }}>{`${squadName}`}</Text> has been created.{`\n`}Use your squad code to invite friends!</TextInput>
                <View style={AddSquadStyles.squadCodeContainer}>
                    <Text style={[TextStyles.headerLarge, AddSquadStyles.squadCodeValueText]} selectable={true}>
                        {squadCode}
                    </Text>
                </View>
                <StandardButton text="Done" override_style={{ marginBottom: 35, width: 130 }} onPress={() => { props.navigation.pop(); setCreateSquadSuccessModal(false) }} />
            </BlurModal>
        );
    }

    return (
        <View style={AddSquadStyles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                {renderCreateNewSquad()}
            </ScrollView>
            {renderCreateSquadSuccessModal()}
            <StandardButton text="Submit" override_style={{ width: 200, marginBottom: "15%" }} onPress={() => addSquadOnBackend()} />
        </View>
    );
}


const AddExistingSquad = (props: AddSquadProps) => {
    const [squadCode, setSquadCode] = useState("")
    const [squadName, setSquadName] = useState("")
    const [addToSquadSuccessModal, setAddToSquadSuccessModal] = useState(false)
    const email = props.route.params.email

    const invalidSquadCodeMessage = (message: string, description: string) => {
        return (
            showMessage({
                message: message,
                description: description,
                type: "danger",
            })
        )
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
        callBackend(endpoint, init).then(response => {
            return response.json();
        }).then(data => {
            if (data.status_code == 400) {
                invalidSquadCodeMessage(data.message, data.description);
            } else {
                setSquadName(data.squad_name)
                setAddToSquadSuccessModal(true);
            }
        });
    }

    const renderAddSquadByCode = () => {
        return (
            <View style={AddSquadStyles.add_container}>
                <Text style={[TextStyles.paragraph, AddSquadStyles.add_title]}>
                    {ADD_SQUAD_BY_CODE_TITLE}
                </Text>
                <SafeAreaView >
                    <TextInput
                        placeholder={ADD_SQUAD_BY_CODE_PLACEHOLDER}
                        autoCapitalize={'none'}
                        onChangeText={(code) => setSquadCode(code)}
                        style={AddSquadStyles.squadCodeText}
                        placeholderTextColor="lightgray" />
                </SafeAreaView>
            </View>
        )
    }

    const renderAddToSquadSuccessModal = () => {
        return (
            <BlurModal visible={addToSquadSuccessModal}>
                <Image source={require('../assets/success_icon.png')} style={AddSquadStyles.successIcon} />
                <Text style={[TextStyles.headerLarge, AddSquadStyles.successText]}>Success!</Text>
                <TextInput editable={false} multiline={true} style={[TextStyles.paragraph, AddSquadStyles.squadCreateModalText]}>You've joined squad <Text style={{ fontFamily: "Roboto_700Bold" }}>{`${squadName}`}</Text>!</TextInput>
                <StandardButton text="Done" override_style={{ marginBottom: 35, marginTop: 40, width: 130 }} onPress={() => { props.navigation.pop(); setAddToSquadSuccessModal(false) }} />
            </BlurModal>
        );
    }

    return (
        <View style={AddSquadStyles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false} >
                {renderAddSquadByCode()}
            </ScrollView>
            <StandardButton text="Submit" override_style={{ width: 200, marginBottom: "15%" }} onPress={() => addSquadByCodeOnBackend()} />
            {renderAddToSquadSuccessModal()}
        </View>
    );
}

export { AddNewSquad, AddExistingSquad };
