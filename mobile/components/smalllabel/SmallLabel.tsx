import React from "react"
import Label from "../label/Label"

type SmallLabelProps = {
    labelText: string,
    style?: object
}

const SmallLabel = (props: SmallLabelProps) => {
    return (
        <Label
            labelText={props.labelText}
            style={[{ fontSize: 16 }, props.style]}
        />
    )
}

export default SmallLabel