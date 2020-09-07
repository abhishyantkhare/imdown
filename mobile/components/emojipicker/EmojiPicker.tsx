import React, { useState } from "react";
import { Modal, TouchableOpacity, Button, Text, View, SafeAreaView } from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import { EmojiPickerStyles } from "./EmojiPickerStyles"

type EmojiPickerProps = {
    defaultEmoji?: string
    onEmojiPicked: (emoji: string) => void
    emojiPickerTitle: string
}
const DEFAULT_EMOJI = "😎"

const EmojiPicker = (props: EmojiPickerProps) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const defaultEmoji = props.defaultEmoji || DEFAULT_EMOJI
    const [emojiPicked, setEmojiPicked] = useState(defaultEmoji)

    return showEmojiPicker ? (
        <Modal visible={showEmojiPicker}>
            <SafeAreaView style={EmojiPickerStyles.modalContainer}>
                <View style={EmojiPickerStyles.headerContainer}>
                    <View style={EmojiPickerStyles.buttonContainer}>

                    </View>
                    <View style={EmojiPickerStyles.titleContainer}>
                        <Text style={EmojiPickerStyles.titleText}>
                            {props.emojiPickerTitle}
                        </Text>
                    </View>
                    <View style={EmojiPickerStyles.buttonContainer}>
                        <Button color={"#007AFF"} title={"Dismiss"} onPress={() => { setShowEmojiPicker(false) }} />
                    </View>
                </View>
                <View style={EmojiPickerStyles.emojiPicker}>
                    <EmojiSelector
                        showSearchBar={false}
                        columns={9}
                        onEmojiSelected={(emoji: string) => {
                            setEmojiPicked(emoji)
                            setShowEmojiPicker(false);
                            props.onEmojiPicked(emoji)
                        }} />
                </View>
            </SafeAreaView>
        </Modal >
    ) : (
            <View style={EmojiPickerStyles.emojiContainer}>
                <TouchableOpacity onPress={() => setShowEmojiPicker(true)}>
                    <Text style={EmojiPickerStyles.emoji}>{emojiPicked}</Text>
                </TouchableOpacity>
            </View>
        );
}

export default EmojiPicker;