import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import EmojiPicker from "../components/emojipicker/EmojiPicker"
import { AddEventStyles } from "./AddEventStyles"
import RobotoTextInput from "../components/robototextinput/RobotoTextInput"
import DateTimeInput from "../components/date_time_input/DateTimeInput"
import Section from "../components/section/Section"
import SwitchButton from "../components/switchbutton/SwitchButton"
import Slider from "@react-native-community/slider";
import SmallLabel from "../components/smalllabel/SmallLabel";
import ImageUploader from "../components/imageuploader/ImageUploader"
import Divider from "../components/divider/divider"
import { StandardButton } from "../components/button/Button";


const AddEvent = () => {
    const [emoji, setEmojiPicked] = useState<string>();
    const [startDate, setStartDate] = useState<Date>(new Date);
    const [startTime, setStartTime] = useState<Date>(new Date);
    const [showEndTime, setShowEndTime] = useState(false)
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [endTime, setEndTime] = useState<Date | undefined>();
    const [downThreshold, setDownThreshold] = useState(1)
    const windowWidth = useWindowDimensions().width;

    const renderEventEmoji = () => {
        return (
            <EmojiPicker
                onEmojiPicked={setEmojiPicked}
                emojiPickerTitle={"Pick Event Emoji"}
            />
        )
    }

    const renderEventNameSection = () => {
        return (
            <Section label={"Event Name"}>
                <RobotoTextInput
                    placeholder={"Awesome New Hangout!"}
                />
            </Section>
        )
    }
    const renderEventTimes = () => {
        return (
            <Section label={"Start and end times"}>
                <DateTimeInput
                    initialDate={startDate}
                    onSetDate={setStartDate}
                    initialTime={startTime}
                    onSetTime={setStartTime}
                />
                {showEndTime ?
                    <DateTimeInput
                        initialDate={endDate}
                        onSetDate={setEndDate}
                        initialTime={endTime}
                        onSetTime={setEndTime}
                        style={{ marginTop: "5%" }}
                    />
                    :
                    null
                }
                <SwitchButton
                    label={"Add End Time"}
                    onChange={() => { setShowEndTime(!showEndTime) }}
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
                />
            </Section>
        )
    }

    const renderEventDownThreshold = () => {
        return (
            <Section label={"Minimum Attendees"}>
                <SmallLabel
                    labelText={"Once the minimum number of attendees accepts the invitation, the event will be scheduled and a calendar invite will be sent to all participants."}
                />
                <View style={{ alignItems: "center" }}>
                    <View style={{ width: "80%" }}>
                        <Slider
                            minimumValue={1}
                            maximumValue={Math.max(0, 2)}
                            step={1}
                            value={downThreshold}
                            onValueChange={setDownThreshold}
                            style={{ marginTop: "5%" }}
                            thumbImage={require("../assets/down_static.png")}
                            minimumTrackTintColor="#90BEDE" />
                    </View>
                </View>
                <SmallLabel
                    labelText={downThreshold.toString()}
                    style={{
                        left: (downThreshold - 1) * (windowWidth / 2),
                        marginLeft: "15%",
                        marginTop: "5%"
                    }}
                />
            </Section>
        )
    }

    const renderEventImage = () => {
        return (
            <ImageUploader style={{ marginTop: "10%", marginBottom: "10%" }} />
        )
    }

    const renderSaveButton = () => {
        return (
            <View>
                <Divider style={{ marginTop: "5%" }} />
                <StandardButton
                    text={"Save"}
                    override_style={AddEventStyles.saveButton}
                />
            </View>
        )
    }

    return (
        <ScrollView style={AddEventStyles.container}>
            <View style={AddEventStyles.childContainer}>
                {renderEventEmoji()}
                {renderEventNameSection()}
                {renderEventTimes()}
                {renderEventDescription()}
                {renderEventDownThreshold()}
                {renderEventImage()}
            </View>
            {renderSaveButton()}
        </ScrollView>
    )
}

export default AddEvent;