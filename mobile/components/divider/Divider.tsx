import React from 'react';
import { View } from 'react-native';
import DividerStyles from './DividerStyles';

type DividerProps = {
  style?: object;
  vertical?: boolean;
};

const Divider = (props: DividerProps) => {
  const { style, vertical } = props;
  const alignmentStyle = vertical ? DividerStyles.verticalDivider : DividerStyles.divider;
  return (
    <View
      style={[alignmentStyle, style]}
    />
  );
};

Divider.defaultProps = {
  style: {},
  vertical: false,
};

export default Divider;
