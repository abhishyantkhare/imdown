import React, { useState } from "react";
import { Button, Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimeInputStyles } from "./date_time_input_styles";
import moment from "moment";

// This can be extended for formatting, styling, and more.
export interface DateTimeInputProps {
  onChange: (dateTime: Date) => void;
  // The default value of the selector.
  defaultSelectorValue?: Date;
  // Initial value of the selected datetime.
  initialDateTime?: Date;
}

/**
 * A cross-platform date and time selector. iOS uses a date and time scroll wheel whereas Android uses a calendar
 * selector followed by a clock selector.
 */
const DateTimeInput = (dateTimeInputProps: DateTimeInputProps) => {
  const defaultDateTime = dateTimeInputProps.defaultSelectorValue || dateTimeInputProps.initialDateTime || new Date();
  const defaultMode = Platform.OS === 'ios' ? 'datetime' : 'date';
  const [dateTime, setDateTime] = useState<Date | undefined>(dateTimeInputProps.initialDateTime);
  const [finalDateTime, setFinalDateTime] = useState<Date | undefined>(dateTimeInputProps.initialDateTime);
  const [mode, setMode] = useState<'datetime' | 'date' | 'time'>(defaultMode);
  const [show, setShow] = useState(false);

  // When selecting the time, previously selected values will be present for date.
  const updateDateTime = ({ date = dateTime || defaultDateTime, time = defaultDateTime }) => {
    setDateTime(new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      time.getHours(), time.getMinutes(), time.getSeconds()
    ));
  }

  const onChange = (_event: Event, selectedValue?: Date) => {
    // (Android) There is a Cancel button that will cause no results to be passed.
    if (!selectedValue) {
      setMode(defaultMode);
      setShow(false);
      return;
    }
    // (iOS) Select the date and time in one step, and rely on a Button for submission.
    if (mode === 'datetime') {
      setDateTime(selectedValue);
    }
    // (Android) Set the date component, switch the selector type, and set the time component.
    if (mode === 'date') {
      updateDateTime({ date: selectedValue });
      setShow(false);
      setMode('time');
      setShow(true);
    }
    if (mode === 'time') {
      updateDateTime({ time: selectedValue });
      setShow(false);
      setMode(defaultMode);
      dateTimeInputProps.onChange(dateTime || defaultDateTime);
    }
  };

  const formatDate = () => {
    return finalDateTime
      ? `🗓 ${moment(finalDateTime).format('llll').toLocaleString()}`
      : "TBD";
  };

  const renderDateTimePicker = () => {
    // (iOS) Render a Modal and button. This does not work well with dark mode.
    // (Android) The DateTimePicker appears as a popup dialog.
    return Platform.OS === 'ios'
      ? (
        <Modal>
          <DateTimePicker value={dateTime || defaultDateTime} mode={mode} onChange={onChange} />
          <Button title="Cancel" onPress={() => {
            setShow(false)
            setDateTime(dateTimeInputProps.initialDateTime)
          }} />
          <Button title="Set Date" onPress={() => {
            setShow(false);
            const selectedDate = dateTime || defaultDateTime;
            setFinalDateTime(selectedDate);
            dateTimeInputProps.onChange(selectedDate);
          }} />
        </Modal>
      )
      : <DateTimePicker value={dateTime || defaultDateTime} mode={mode} onChange={onChange} />;
  }

  return (
    <View>
      <TouchableOpacity onPress={() => {
        setShow(true);
      }}>
        <Text style={DateTimeInputStyles.time_text}>{formatDate()}</Text>
      </TouchableOpacity>
      {show && renderDateTimePicker()}
    </View>
  );
}

export default DateTimeInput
