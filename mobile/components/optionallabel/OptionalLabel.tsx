import React from "react"
import Label from "../label/Label"

type OptionalLabelProps = {
    style?: object
}

const OptionalLabel = (props: OptionalLabelProps) => {
    return (
        <Label
            labelText={"OPTIONAL"}
            style={[{
                fontSize: 13,
                color: "grey",
            }, props.style]}
        />
    )
}

export default OptionalLabel