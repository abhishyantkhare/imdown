import React, { useState } from "react"
import { View, Switch } from "react-native"
import Label from "../label/Label"
import SwitchButtonStyles from "./SwitchButtonStyles"

type SwitchButtonProps = {
    label: string,
    onChange: () => void,
    initialValue?: boolean,
    style?: object
}

const SwitchButton = (props: SwitchButtonProps) => {
    const [value, setValue] = useState(props.initialValue || false)
    return (
        <View style={[SwitchButtonStyles.switchButtonContainer, props.style]}>
            <Label labelText={props.label} size={"small"} />
            <Switch
                style={{ right: 0, position: "absolute" }}
                onValueChange={(val) => {
                    setValue(val)
                    props.onChange()
                }}
                value={value}
            />
        </View>
    )
}

export default SwitchButton