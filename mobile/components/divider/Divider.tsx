import React from 'react';
import { View } from 'react-native';
import DividerStyles from './DividerStyles';

type DividerProps = {
  style?: object;
};

const Divider = (props: DividerProps) => {
  const { style } = props;
  return (
    <View
      style={[DividerStyles.divider, style]}
    />
  );
};

Divider.defaultProps = {
  style: {},
};

export default Divider;
