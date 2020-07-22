import React, { useState } from "react";
import { Modal, Button } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

type OwnProps = {
    onSubmit: (date: Date) => void
}

const DatePickerModal = (props: OwnProps) => {

    const [date, setDate] = useState(new Date())


    return (
        <Modal>
            <DateTimePicker
                value={date}
                mode={"datetime"}
                onChange={(_, date) => {
                    setDate(date);
                }}
            />
            <Button title={"Set Date"} onPress={() => props.onSubmit(date)} />
        </Modal>
    )
}

export default DatePickerModal