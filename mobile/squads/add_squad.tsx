import React, { useState } from "react";
import { Image, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AddSquadStyles } from "./add_squad_styles";
import EmojiPicker from "../components/emojipicker/EmojiPicker";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { callBackend } from "../backend/backend";
import { ScrollView } from "react-native-gesture-handler";
import { RootStackParamList } from "../App";
import { showMessage } from "react-native-flash-message";
import { StandardButton } from "../components/button/Button"

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
    
    const renderEmoji = () => {
        return <EmojiPicker
            onEmojiPicked={(emoji: string) => setEmojiPicked(emoji)}
            emojiPickerTitle={"Select Squad Emoji"}
        />
    }

    const renderCreateNewSquad = () => {
        return (
            <View style={AddSquadStyles.add_container}>
                <SafeAreaView style={AddSquadStyles.emoji_and_squad_name_container}>
                    <View style={AddSquadStyles.emojiBox}>
                        {renderEmoji()}
                    </View>
                    <TextInput placeholder={CREATE_NEW_SQUAD_PLACEHOLDER} onChangeText={(name) => setSquadName(name)}
                        multiline={true}
                        style={AddSquadStyles.squadNameText}
                        placeholderTextColor="lightgray" />
                </SafeAreaView>
            </View>
        )
    }

    const renderCreateSquadSuccessModal = () => {
        return (
            <Modal visible={createSquadSuccessModal} animationType="fade" transparent>
                <View style={AddSquadStyles.modalBackgroundBlur}>
                    <View style={AddSquadStyles.modalVisibleContainer}>
                        <Image source={require('../assets/success_icon.png')} style={AddSquadStyles.successIcon} />
                        <Text style={AddSquadStyles.successText}>Success!</Text>
                        <TextInput editable={false} multiline={true} style={AddSquadStyles.squadCreateModalText}>Your squad <Text style={{fontFamily: "Roboto_700Bold"}}>{`${squadName}`}</Text> has been created.{`\n`}Use your squad code to invite friends!</TextInput>
                        <View style={AddSquadStyles.squadCodeContainer}>
                            <Text style={AddSquadStyles.squadCodeValueText} selectable={true}>
                                {squadCode}
                            </Text>
                        </View>
                        <StandardButton text="Done" override_style={{marginBottom: 35, width: 130}} onPress={()=>{props.navigation.pop(); setCreateSquadSuccessModal(false)}}/>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={AddSquadStyles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                {renderCreateNewSquad()}
            </ScrollView>
            { renderCreateSquadSuccessModal() }
            <StandardButton text="Submit" override_style={{width:200, marginBottom: 70}} onPress={()=> addSquadOnBackend()}/>
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
            if (data.status_code == 400){
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
                <Text style={AddSquadStyles.add_title}>
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
            <Modal visible={addToSquadSuccessModal} animationType="fade" transparent>
                 <View style={AddSquadStyles.modalBackgroundBlur}>
                    <View style={AddSquadStyles.modalVisibleContainer}>
                        <Image source={require('../assets/success_icon.png')} style={AddSquadStyles.successIcon} />
                        <Text style={AddSquadStyles.successText}>Success!</Text>
                        <TextInput editable={false} multiline={true} style={AddSquadStyles.squadCreateModalText}>You've joined squad <Text style={{fontFamily: "Roboto_700Bold"}}>{`${squadName}`}</Text>!</TextInput>
                        <StandardButton text="Done" override_style={{marginBottom: 35, width: 130}} onPress={()=>{props.navigation.pop(); setAddToSquadSuccessModal(false)}}/>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={AddSquadStyles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false} >
                {renderAddSquadByCode()}
            </ScrollView>
            <StandardButton text="Submit" override_style={{width:200, marginBottom: 70}} onPress={()=> addSquadByCodeOnBackend()}/>
            { renderAddToSquadSuccessModal() }
        </View>
    );
}

export { AddNewSquad, AddExistingSquad };
