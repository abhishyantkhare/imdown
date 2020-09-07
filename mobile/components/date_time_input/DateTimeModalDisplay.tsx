import React, { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import moment from "moment";
import DateTimeModalDisplayStyles from "./DateTimeModalDisplayStyles"
import DateTimeModal from "./DateTimeModal"
import SmallLabel from "../smalllabel/SmallLabel"



type DateTimeModalDisplayProps = {
    style?: object,
    mode: "date" | "time",
    onSet: (dateTime: Date) => void,
    initialDateTime: Date
}

const DateTimeModalDisplay = (props: DateTimeModalDisplayProps) => {
    const [dateTime, setDateTime] = useState<Date>(props.initialDateTime)
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)

    const formatDateTime = () => {
        if (props.mode === "date") {
            return moment(dateTime).format("dddd, MMMM Do")
        }
        return moment(dateTime).format("h:mm a")
    }

    const renderDateTimeDisplay = () => {
        return (
            <View style={DateTimeModalDisplayStyles.displayContainer}>
                <TouchableOpacity onPress={() => { setShowDatePicker(true) }}>
                    <SmallLabel labelText={formatDateTime()} />
                </TouchableOpacity>
            </View>
        )
    }

    const renderDateTimePicker = () => {
        return (
            <DateTimeModal
                visible={showDatePicker}
                onSetPress={setDateTime}
                initialDateTime={dateTime}
                mode={props.mode}
                hideDatePicker={() => { setShowDatePicker(false) }}
            />
        )
    }
    return (
        <View style={props.style}>
            {renderDateTimePicker()}
            {renderDateTimeDisplay()}
        </View>
    )
}

export default DateTimeModalDisplay