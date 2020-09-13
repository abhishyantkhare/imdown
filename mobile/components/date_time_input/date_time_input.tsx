/* TO BE DEPRECATED */

import React, { useState } from 'react';
import {
  Button,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, { AndroidEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';

import DateTimeInputStyles from './date_time_input_styles';

// This can be extended for formatting, styling, and more.
export interface DateTimeInputProps {
  onChange: (dateTime: Date) => void; // eslint-disable-line no-unused-vars
  // Initial value of the selected datetime. If not provided, the display will be TBD.
  initialValue?: Date;
  // Initial value of the selector. Defaults to the field value or the present time if necessary.
  // TODO: this prop is not used at the moment, but it can be used or maybe converted to
  // something stateful if we want to initialize the end date selector using the value
  // of the start date.
  suggestedSelectorValue?: Date;
}

/**
 * A cross-platform date and time selector. iOS uses a date and time scroll wheel
 * whereas Android uses a calendar selector followed by a clock selector.
 */
const DateTimeInput = (dateTimeInputProps: DateTimeInputProps) => {
  // iOS uses a combined datetime selector while Android uses separate date and time popups.
  const defaultMode = Platform.OS === 'ios' ? 'datetime' : 'date';
  const [mode, setMode] = useState<'datetime' | 'date' | 'time'>(defaultMode);
  // State of the input selector.
  // TODO: Pick a better fallback time.
  const defaultSelectorValue = dateTimeInputProps.initialValue
    || dateTimeInputProps.suggestedSelectorValue
    || new Date();
  const [selectorDateTime, setSelectorDateTime] = useState<Date>(defaultSelectorValue);
  // State of the input field.
  const [dateTime, setDateTime] = useState<Date | undefined>(dateTimeInputProps.initialValue);
  const [show, setShow] = useState(false);

  // Close the selector without updating the field value.
  const close = () => {
    // (Android) Ensure the popup is hidden before updating the mode.
    setShow(false);
    setMode(defaultMode);
  };

  // Close the selector, set the field value to the selector value, and trigger the callback.
  const submitDateTime = (selectedValue: Date) => {
    close();
    setDateTime(selectedValue);
    dateTimeInputProps.onChange(selectedValue);
  };

  const onChange = (_event: AndroidEvent, selectedValue?: Date) => {
    // (iOS) Select the date and time in one step, and rely on a Button for submission.
    if (Platform.OS === 'ios') {
      setSelectorDateTime(selectedValue || selectorDateTime);
      return;
    }
    // (Android) Set the date component, switch the selector type, and set the time component.
    if (!selectedValue) {
      close();
    } else if (mode === defaultMode) {
      // The date was provided, so update the date on the selector value.
      setShow(false);
      setSelectorDateTime(selectedValue);
      setMode('time');
      setShow(true);
    } else if (mode === 'time') {
      // The time was provided, so update the selector value and the input value.
      setShow(false);
      setSelectorDateTime(selectedValue);
      // selectorDateTime is asynchronously updated, so use selectedValue.
      submitDateTime(selectedValue);
    }
  };

  const formatDate = () => (
    dateTime
      ? `🗓 ${moment(dateTime).format('llll').toLocaleString()}`
      : 'TBD'
  );

  const renderDateTimePicker = () => (
    // (iOS) Render a Modal and button. This does not work well with dark mode.
    // (Android) The DateTimePicker appears as a popup dialog.
    Platform.OS === 'ios'
      ? (
        <Modal>
          <View style={{ marginTop: 300 }}>
            <DateTimePicker value={selectorDateTime} mode={mode} onChange={onChange} />
            <Button title='Cancel' onPress={close} />
            <Button title='Set Date' onPress={() => submitDateTime(selectorDateTime)} />
          </View>
        </Modal>
      )
      : <DateTimePicker value={selectorDateTime} mode={mode} onChange={onChange} />
  );

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Text style={DateTimeInputStyles.timeText}>{formatDate()}</Text>
      </TouchableOpacity>
      {show && renderDateTimePicker()}
    </View>
  );
};

export default DateTimeInput;
