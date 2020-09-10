import React from "react"
import { View, Text } from "react-native"
import { TextStyles } from "../../TextStyles"


type LabelProps = {
    labelText: string,
    style?: object,
    size?: "normal" | "small"
}

const Label = (props: LabelProps) => {
    const size = props.size || "normal"
    const textStyle = size == "normal" ? TextStyles.paragraph : TextStyles.secondary
    return (
        <View>
            <Text style={[
                textStyle,
                props.style,
            ]}>
                {props.labelText}
            </Text>
        </View>
    )
}

export default Label