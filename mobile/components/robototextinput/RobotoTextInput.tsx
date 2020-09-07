import React from "react"
import { TextInput } from "react-native"

type RobotoTextInputProps = {
    placeholder: string,
    multiline?: boolean,
    onChangeText: (newText: string) => void
    style?: object
}

const RobotoTextInput = (props: RobotoTextInputProps) => {
    return (
        <TextInput
            placeholder={props.placeholder}
            multiline={props.multiline}
            onChangeText={props.onChangeText}
            style={[
                {
                    fontFamily: "Roboto_400Regular",
                    fontSize: 20,
                    textAlign: "left",
                    paddingLeft: 15,
                    width: "100%",
                    paddingVertical: 15,
                    borderColor: "#BEBEBE",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderRadius: 5
                }, props.style,]}
        />
    )
}

export default RobotoTextInput