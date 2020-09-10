import React, { useState } from "react"
import { View } from "react-native"
import DateTimeModalDisplay from "./DateTimeModalDisplay"
import DateTimeInputStyles from "./DateTimeInputStyles"



type DateTimeInputProps = {
    style?: object,
    onSetDateTime: (date: Date) => void,
    initialDateTime?: Date
}

const DateTimeInput = (props: DateTimeInputProps) => {
    const [date, setDate] = useState(props.initialDateTime || new Date())
    const [time, setTime] = useState(props.initialDateTime || new Date())

    const setDateForDateTime = (newDate: Date) => {
        const newDateTime = new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
            time.getHours(),
            time.getMinutes(),
            time.getSeconds()
        )
        props.onSetDateTime(newDateTime)
    }

    const setTimeForDateTime = (newTime: Date) => {
        const newDateTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            newTime.getHours(),
            newTime.getMinutes(),
            newTime.getSeconds()
        )
        props.onSetDateTime(newDateTime)
    }

    return (
        <View style={[props.style, DateTimeInputStyles.dateTimeContainer]}>
            <View style={{ flex: .65 }}>
                <DateTimeModalDisplay
                    mode={"date"}
                    onSet={setDateForDateTime}
                    initialDateTime={date}
                />
            </View>
            <View style={{ flex: .3 }}>
                <DateTimeModalDisplay
                    mode={"time"}
                    onSet={setTimeForDateTime}
                    initialDateTime={time}
                />
            </View>
        </View>
    )
}

export default DateTimeInput