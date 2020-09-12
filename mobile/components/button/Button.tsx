import React from "react";
import { Text } from "react-native";
import { StandardButtonStyles } from "./ButtonStyles";
import { TouchableOpacity } from "react-native-gesture-handler";

type StandardButtonProps = {
  text: string
  override_style?: object,
  text_override_style?: object,
  onPress: () => void
}

function StandardButton(props: StandardButtonProps) {
  return (
    <TouchableOpacity style={[StandardButtonStyles.button, props.override_style]} onPress={()=> props.onPress()}>
      <Text style={[StandardButtonStyles.buttonText, props.text_override_style]}>{`${props.text}`}</Text>
    </TouchableOpacity>
  );
}

export { StandardButton }
