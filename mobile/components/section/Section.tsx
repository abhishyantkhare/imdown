import React from 'react';
import { View } from 'react-native';

import Label from '../label/Label';
import Divider from '../divider/Divider';
import OptionalLabel from '../optionallabel/OptionalLabel';
import SectionStyles from './SectionStyles';

type SectionProps = {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
  style?: object;
};

const Section = (props: SectionProps) => {
  const {
    style,
    label,
    children,
    optional,
  } = props;

  return (
    <View style={[style]}>
      <View style={SectionStyles.labelHeader}>
        <Label
          labelText={label}
        />
        {optional
          ? (
            <OptionalLabel
              style={{ marginLeft: '15%' }}
            />
          ) : null }
      </View>
      {children}
      <Divider style={{ marginTop: '12.5%' }} />
    </View>
  );
};

Section.defaultProps = {
  optional: false,
  style: {},
};

export default Section;
