import React from 'react';

import Label from '../label/Label';

type OptionalLabelProps = {
  style?: object;
}

const OptionalLabel = (props: OptionalLabelProps) => {
  const { style } = props;
  return (
    <Label
      labelText='OPTIONAL'
      style={[{
        fontSize: 13,
        color: 'grey',
      }, style]}
    />
  );
};

OptionalLabel.defaultProps = {
  style: {},
};

export default OptionalLabel;
