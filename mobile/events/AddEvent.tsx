import React, { useState, useCallback } from "react";
import { Image, View, useWindowDimensions } from "react-native";
import EmojiPicker from "../components/emojipicker/EmojiPicker"
import { AddEventStyles } from "./AddEventStyles"
import RobotoTextInput from "../components/robototextinput/RobotoTextInput"
import DateTimeInput from "../components/date_time_input/DateTimeInput"
import Section from "../components/section/Section"
import SwitchButton from "../components/switchbutton/SwitchButton"
import Slider from "@react-native-community/slider";
import ImageUploader from "../components/imageuploader/ImageUploader"
import Divider from "../components/divider/divider"
import { StandardButton } from "../components/button/Button";
import AppNavRouteProp from "../types/navigation";
import { useFocusEffect } from "@react-navigation/native";
import { getUsersInSquad, postRequest } from "../backend/backend"
import moment from "moment"
import { showMessage } from "react-native-flash-message";
import { DEFAULT_EMOJI } from "../constants"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Label from "../components/label/Label";
import OptionalLabel from "../components/optionallabel/OptionalLabel"



type AddEventProps = AppNavRouteProp<'AddEvent'>

const AddEvent = (props: AddEventProps) => {
    const [emoji, setEmojiPicked] = useState<string>(DEFAULT_EMOJI);
    const [eventTitle, setEventTitle] = useState("")
    const [startDateTime, setStartDateTime] = useState<Date>(new Date());
    const [showEndTime, setShowEndTime] = useState(false)
    const [endDateTime, setEndDateTime] = useState<Date | undefined>();
    const [eventDescription, setEventDescription] = useState("")
    const [downThreshold, setDownThreshold] = useState(1)
    const [numUsers, setNumUsers] = useState(1)
    const [imageUrl, setImageUrl] = useState("")
    const windowWidth = useWindowDimensions().width;
    const squadId = props.route.params.squadId
    const userEmail = props.route.params.userEmail

    useFocusEffect(useCallback(() => {
        getUsersInSquad(squadId).then((data) => {
            setNumUsers(data.user_info.length)
        })
    }, []))

    const renderEventEmoji = () => {
        return (
            <EmojiPicker
                onEmojiPicked={setEmojiPicked}
                emojiPickerTitle={"Pick Event Emoji"}
            />
        )
    }

    const generateEventForBackend = () => {
        return {
            email: userEmail,
            title: eventTitle,
            description: eventDescription || null,
            emoji: emoji,
            start_time: moment(startDateTime).valueOf(),
            end_time: showEndTime ? moment(endDateTime).valueOf() : null,
            // TODO: Add address + lat/lng to add event page
            // address,
            // lat,
            // lng,
            squad_id: squadId,
            event_url: null,
            image_url: imageUrl || null,
            down_threshold: downThreshold
        };
    }

    const validateEvent = () => {
        if (!eventTitle) {
            showMessage({
                message: "Please enter an event name",
                type: "danger"
            })
            return false
        }
        if (showEndTime && endDateTime) {
            if (endDateTime <= startDateTime) {
                showMessage({
                    message: "End time cannot be before start time",
                    type: "danger"
                })
                return false
            }
        }
        return true
    }

    const validateAndSaveEvent = () => {
        if (validateEvent()) {
            const endpoint = "create_event"
            const data = generateEventForBackend()
            postRequest(endpoint, data).then(() => {
                props.navigation.navigate("Events", props.route.params)
            })
        }
    }

    const renderEventTitleSection = () => {
        return (
            <Section label={"Event Title"} style={{ marginTop: "10%" }}>
                <RobotoTextInput
                    placeholder={"Awesome New Hangout!"}
                    onChangeText={setEventTitle}
                />
            </Section>
        )
    }

    const switchEndDateTime = () => {
        if (!showEndTime) {
            setEndDateTime(moment(startDateTime).add(1, 'hour').toDate())
        }
        setShowEndTime(!showEndTime)
    }

    const renderEventTimes = () => {
        return (
            <Section label={"Start and end times"}>
                <DateTimeInput
                    onSetDateTime={setStartDateTime}
                />
                {showEndTime ?
                    <DateTimeInput
                        onSetDateTime={setEndDateTime}
                        style={{ marginTop: "5%" }}
                        initialDateTime={endDateTime}
                    />
                    :
                    null
                }
                <SwitchButton
                    label={"Add End Time"}
                    onChange={switchEndDateTime}
                    style={{ marginTop: "5%" }}
                />
            </Section>
        )
    }
    const renderEventDescription = () => {
        return (
            <Section label={"Description"} optional>
                <RobotoTextInput
                    placeholder={"Tell everyone about your event!"}
                    multiline={true}
                    style={{ height: 100 }}
                    onChangeText={setEventDescription}
                />
            </Section>
        )
    }

    const renderEventDownThreshold = () => {
        return (
            <Section label={"Minimum Attendees"}>
                <Label
                    size={"small"}
                    labelText={"Once the minimum number of attendees accepts the invitation, the event will be scheduled and a calendar invite will be sent to all participants."}
                />
                <View style={{ alignItems: "center" }}>
                    <View style={{ width: "80%" }}>
                        <Slider
                            minimumValue={1}
                            maximumValue={Math.max(numUsers, 2)}
                            step={1}
                            value={downThreshold}
                            onValueChange={setDownThreshold}
                            style={{ marginTop: "5%" }}
                            thumbImage={require("../assets/down_border_filled.png")}
                            minimumTrackTintColor="#90BEDE" />
                    </View>
                </View>
                <Label
                    size="small"
                    labelText={downThreshold.toString()}
                    style={{
                        left: (downThreshold - 1) * windowWidth * .6 / (Math.max(numUsers, 2) * 1.03 - 1),
                        marginLeft: "12.5%",
                        marginTop: "5%"
                    }}
                />
            </Section>
        )
    }

    const renderEventImage = () => {
        return (
            <View style={{ marginTop: "10%", marginBottom: "10%" }}>
                {imageUrl ?
                    <Image source={{ uri: imageUrl }}
                        style={{ height: 300 }}
                    />
                    :
                    null
                }
                <View style={[AddEventStyles.imageUploadBox, { marginTop: "10%", marginBottom: "10%" }]}>
                    <ImageUploader touchableStyle={{}} onImagePicked={setImageUrl} image={imageUrl} imageHeight={200} imageWidth={200} >
                        <View style={AddEventStyles.uploadLabelRow}>
                            <Image
                                source={require("../assets/add_photo.png")}
                            />
                            <View style={{ marginLeft: "5%" }}>
                                <Label
                                    labelText={imageUrl ? "Replace/Remove image" : "Upload an image"}
                                    size={"small"}
                                />
                                {!imageUrl ?
                                    <OptionalLabel style={{ marginTop: "5%" }} />
                                    :
                                    null
                                }
                            </View>
                        </View>
                    </ImageUploader>
                </View>
            </View>
        )
    }

    const renderSaveButton = () => {
        return (
            <View>
                <Divider style={{ marginTop: "5%" }} />
                <StandardButton
                    text={"Save"}
                    override_style={AddEventStyles.saveButton}
                    onPress={validateAndSaveEvent}
                />
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView style={AddEventStyles.container}>
            <View style={AddEventStyles.childContainer}>
                {renderEventEmoji()}
                {renderEventTitleSection()}
                {renderEventTimes()}
                {renderEventDescription()}
                {renderEventDownThreshold()}
                {renderEventImage()}
            </View>
            {renderSaveButton()}
        </KeyboardAwareScrollView>
    )
}

export default AddEvent;