import React from 'react';
import { View } from 'react-native';
import DividerStyles from './DividerStyles';

type DividerProps = {
  style?: object;
  vertical?: boolean;
};

const Divider = (props: DividerProps) => {
  const { style } = props;
  if (props.vertical) {
    return (
      <View
        style={[DividerStyles.verticalDivider, style]}
      />
    );
  } else {
    return (
      <View
        style={[DividerStyles.divider, style]}
      />
    );
  }
};

Divider.defaultProps = {
  style: {},
};

export default Divider;