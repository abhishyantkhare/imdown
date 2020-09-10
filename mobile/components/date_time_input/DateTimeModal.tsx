import React, { useState } from "react"
import { View } from "react-native"
import BlurModal from "../blurmodal/BlurModal"
import { StandardButton } from "../button/Button"
import DateTimePicker from "@react-native-community/datetimepicker";


type DateTimeModalProps = {
    visible: boolean,
    onSetPress: (dateTime: Date) => void,
    initialDateTime: Date,
    hideDatePicker: () => void,
    mode: "date" | "time"
}

const DateTimeModal = (props: DateTimeModalProps) => {
    const [dateTime, setDateTime] = useState<Date>(props.initialDateTime)
    return (
        <BlurModal
            visible={props.visible}
            cancel={() => {
                setDateTime(props.initialDateTime);
                props.hideDatePicker()
            }}>
            <View style={{ width: "80%" }}>
                <DateTimePicker
                    mode={props.mode}
                    value={dateTime}
                    onChange={(_, selectedDate) => {
                        if (selectedDate) {
                            setDateTime(selectedDate)
                        }
                    }}
                />
                <StandardButton
                    text={"Set"}
                    onPress={() => {
                        props.onSetPress(dateTime);
                        props.hideDatePicker()
                    }}
                />
            </View>
        </BlurModal >
    )
}

export default DateTimeModal