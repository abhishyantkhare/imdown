import React from 'react';
import { TextInput } from 'react-native';
import { TextStyles } from '../../TextStyles';

type RobotoTextInputProps = {
  placeholder: string;
  multiline?: boolean;
  onChangeText: (newText: string) => void; // eslint-disable-line no-unused-vars
  style?: object;
}

const RobotoTextInput = (props: RobotoTextInputProps) => {
  const {
    style,
    multiline,
    onChangeText,
    placeholder,
  } = props;
  return (
    <TextInput
      placeholder={placeholder}
      multiline={multiline}
      onChangeText={onChangeText}
      style={[
        TextStyles.paragraph,
        {
          textAlign: 'left',
          paddingLeft: 15,
          width: '100%',
          paddingVertical: 15,
          borderColor: '#BEBEBE',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 5,
        }, style]}
    />
  );
};

RobotoTextInput.defaultProps = {
  multiline: false,
  style: {},
};

export default RobotoTextInput;
