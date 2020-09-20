import React, { useState } from 'react';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import BlurModal from '../blurmodal/BlurModal';
import StandardButton from '../button/Button';

type DateTimeModalProps = {
    visible: boolean;
    onSetPress: (dateTime: Date) => void; // eslint-disable-line no-unused-vars
    initialDateTime: Date;
    hideDatePicker: () => void;
    mode: 'date' | 'time';
};

const DateTimeModal = (props: DateTimeModalProps) => {
  const { initialDateTime, visible, mode } = props;
  const [dateTime, setDateTime] = useState<Date>(initialDateTime);
  return (
    <BlurModal
      visible={visible}
      isCancelVisible
      onCancel={() => {
        setDateTime(props.initialDateTime);
        props.hideDatePicker();
      }}
    >
      <View style={{ width: '80%' }}>
        <DateTimePicker
          mode={mode}
          value={dateTime}
          onChange={(_, selectedDate) => {
            if (selectedDate) {
              setDateTime(selectedDate);
            }
          }}
        />
        <StandardButton
          text='Set'
          onPress={() => {
            props.onSetPress(dateTime);
            props.hideDatePicker();
          }}
        />
      </View>
    </BlurModal>
  );
};

export default DateTimeModal;
