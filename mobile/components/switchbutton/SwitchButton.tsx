import React, { useState } from "react"
import { View, Switch } from "react-native"
import SmallLabel from "../smalllabel/SmallLabel"
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
            <SmallLabel labelText={props.label} />
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