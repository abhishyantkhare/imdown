import React, { useState } from 'react';
import { View } from 'react-native';
import DateTimeModalDisplay from './DateTimeModalDisplay';
import DateTimeInputStyles from './DateTimeInputStyles';

type DateTimeInputProps = {
  style?: object;
  onSetDateTime: (date: Date) => void; // eslint-disable-line no-unused-vars
  initialDateTime?: Date;
};

const DateTimeInput = (props: DateTimeInputProps) => {
  const { style, onSetDateTime, initialDateTime } = props;
  // eslint-disable-next-line no-unused-vars
  const [date, setDate] = useState(initialDateTime || new Date());
  // eslint-disable-next-line no-unused-vars
  const [time, setTime] = useState(initialDateTime || new Date());

  const setDateForDateTime = (newDate: Date) => {
    const newDateTime = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
    );
    onSetDateTime(newDateTime);
    setDate(newDateTime);
    setTime(newDateTime);
  };

  const setTimeForDateTime = (newTime: Date) => {
    const newDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      newTime.getHours(),
      newTime.getMinutes(),
      newTime.getSeconds(),
    );
    onSetDateTime(newDateTime);
    setDate(newDateTime);
    setTime(newDateTime);
  };

  return (
    <View style={[style, DateTimeInputStyles.dateTimeContainer]}>
      <View style={{ flex: 0.65 }}>
        <DateTimeModalDisplay
          mode='date'
          onSet={setDateForDateTime}
          initialDateTime={date}
        />
      </View>
      <View style={{ flex: 0.3 }}>
        <DateTimeModalDisplay
          mode='time'
          onSet={setTimeForDateTime}
          initialDateTime={time}
        />
      </View>
    </View>
  );
};

DateTimeInput.defaultProps = {
  style: {},
  initialDateTime: new Date(),
};

export default DateTimeInput;
