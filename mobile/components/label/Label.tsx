import React from "react"
import { View, Text } from "react-native"


type LabelProps = {
    labelText: string,
    style?: object
}

const Label = (props: LabelProps) => {
    return (
        <View>
            <Text style={[
                {
                    fontFamily: "Roboto_400Regular",
                    fontSize: 20
                },
                props.style,
            ]}>
                {props.labelText}
            </Text>
        </View>
    )
}

export default Label