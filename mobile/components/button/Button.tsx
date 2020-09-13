import React from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import StandardButtonStyles from './ButtonStyles';

type StandardButtonProps = {
  text: string;
  overrideStyle?: object;
  onPress: () => void;
};

function StandardButton(props: StandardButtonProps) {
  const { text, overrideStyle, onPress } = props;
  return (
    <TouchableOpacity
      style={[StandardButtonStyles.button, overrideStyle]}
      onPress={() => onPress()}
    >
      <Text style={StandardButtonStyles.buttonText}>{`${text}`}</Text>
    </TouchableOpacity>
  );
}

StandardButton.defaultProps = {
  overrideStyle: {},
};

export default StandardButton;
