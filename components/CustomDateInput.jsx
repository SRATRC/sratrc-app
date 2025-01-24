import React from 'react';
import { View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import FormDisplayField from './FormDisplayField';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const CustomCalendarInput = ({
  openDatePicker,
  text,
  value,
  isDatePickerVisible,
  onDateSelect,
  onDateCancel,
  minimumDate = moment().add(1, 'days').toDate(),
  isDisabled = false,
  date
}) => {
  const handleDateSelect = (date) => {
    if (isNaN(date)) date = new Date();
    onDateSelect(date);
  };
  return (
    <View>
      <RectButton
        onPress={openDatePicker}
        enabled={!isDisabled}
        activeOpacity={0}
      >
        <FormDisplayField
          text={text}
          value={value}
          otherStyles="mt-5"
          backgroundColor="bg-gray-100"
        />
      </RectButton>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={date}
        onConfirm={handleDateSelect}
        onCancel={onDateCancel}
        minimumDate={minimumDate}
      />
    </View>
  );
};

export default CustomCalendarInput;
