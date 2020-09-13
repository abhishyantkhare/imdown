import React, { useState } from 'react';
import { View, Switch } from 'react-native';

import Label from '../label/Label';
import SwitchButtonStyles from './SwitchButtonStyles';

type SwitchButtonProps = {
  label: string;
  onChange: () => void;
  initialValue?: boolean;
  style?: object;
};

const SwitchButton = (props: SwitchButtonProps) => {
  const {
    initialValue,
    label,
    style,
    onChange,
  } = props;
  const [value, setValue] = useState(initialValue || false);

  return (
    <View style={[SwitchButtonStyles.switchButtonContainer, style]}>
      <Label labelText={label} size='small' />
      <Switch
        style={{ right: 0, position: 'absolute' }}
        onValueChange={(val) => {
          setValue(val);
          onChange();
        }}
        value={value}
      />
    </View>
  );
};

SwitchButton.defaultProps = {
  initialValue: false,
  style: {},
};

export default SwitchButton;
