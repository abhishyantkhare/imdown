import React from "react";
import { View } from "react-native";
import { DividerStyles } from "./divider_styles";

type DividerProps = {
  style?: object
}

const Divider = (props: DividerProps) => {
  return (
    <View
      style={[DividerStyles.divider, props.style,]}
    />
  )
}

export default Divider
