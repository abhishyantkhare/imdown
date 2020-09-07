import React from "react"
import { View } from "react-native"
import DateTimeModalDisplay from "./DateTimeModalDisplay"
import DateTimeInputStyles from "./DateTimeInputStyles"



type DateTimeInputProps = {
    style?: object,
    onSetDate: (date: Date) => void,
    onSetTime: (time: Date) => void,
    initialDate?: Date,
    initialTime?: Date
}

const DateTimeInput = (props: DateTimeInputProps) => {
    return (
        <View style={[props.style, DateTimeInputStyles.dateTimeContainer]}>
            <View style={{ flex: .6 }}>
                <DateTimeModalDisplay
                    mode={"date"}
                    onSet={props.onSetDate}
                    initialDateTime={props.initialDate || new Date()}
                />
            </View>
            <View style={{ flex: .3 }}>
                <DateTimeModalDisplay
                    mode={"time"}
                    onSet={props.onSetTime}
                    initialDateTime={props.initialTime || new Date()}
                />
            </View>
        </View>
    )
}

export default DateTimeInput