import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';

import DateTimeModalDisplayStyles from './DateTimeModalDisplayStyles';
import DateTimeModal from './DateTimeModal';
import Label from '../label/Label';

type DateTimeModalDisplayProps = {
    style?: object,
    mode: 'date' | 'time',
    onSet: (dateTime: Date) => void, // eslint-disable-line no-unused-vars
    initialDateTime: Date
}

const DateTimeModalDisplay = (props: DateTimeModalDisplayProps) => {
  const {
    style,
    mode,
    onSet,
    initialDateTime,
  } = props;
  const [dateTime, setDateTime] = useState<Date>(initialDateTime);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const formatDateTime = () => {
    if (props.mode === 'date') {
      return moment(dateTime).format('dddd, MMMM Do');
    }
    return moment(dateTime).format('h:mm a');
  };

  const renderDateTimeDisplay = () => (
    <View style={DateTimeModalDisplayStyles.displayContainer}>
      <TouchableOpacity onPress={() => { setShowDatePicker(true); }}>
        <Label labelText={formatDateTime()} size='small' />
      </TouchableOpacity>
    </View>
  );

  const renderDateTimePicker = () => (
    <DateTimeModal
      visible={showDatePicker}
      onSetPress={(newDateTime: Date) => {
        setDateTime(newDateTime);
        onSet(newDateTime);
      }}
      initialDateTime={dateTime}
      mode={mode}
      hideDatePicker={() => { setShowDatePicker(false); }}
    />
  );

  return (
    <View style={style}>
      {renderDateTimePicker()}
      {renderDateTimeDisplay()}
    </View>
  );
};

DateTimeModalDisplay.defaultProps = {
  style: {},
};

export default DateTimeModalDisplay;
