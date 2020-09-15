import React from 'react';
import { View, Text } from 'react-native';
import TextStyles from '../../TextStyles';

type LabelProps = {
  labelText: string;
  style?: object;
  size?: 'normal' | 'small';
};

const Label = (props: LabelProps) => {
  const { size, style, labelText } = props;
  const textStyle = size === 'normal' ? TextStyles.paragraph : TextStyles.secondary;
  return (
    <View>
      <Text style={[textStyle, style]}>
        {labelText}
      </Text>
    </View>
  );
};

Label.defaultProps = {
  style: {},
  size: 'normal',
};

export default Label;
