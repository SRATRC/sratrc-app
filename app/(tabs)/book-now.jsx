import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { types, colors } from '../../constants';
import MultiSwitch from 'react-native-multiple-switch';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import CustomChipGroup from '../../components/CustomChipGroup';

const BookNow = () => {
  const [selectedChip, setSelectedChip] = useState(types.booking_type_room);
  const chips = [
    types.booking_type_room,
    types.booking_type_food,
    types.booking_type_travel
  ];

  const items = ['Select Dates', 'One Day Visit'];
  const [value, setValue] = useState(items[0]);

  return (
    <SafeAreaView className="h-full bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView alwaysBounceVertical={false}>
          <View className="w-full px-4 my-6">
            <Text className="text-2xl font-psemibold">{`${selectedChip} Booking`}</Text>

            <CustomChipGroup
              chips={chips}
              selectedChip={selectedChip}
              handleChipPress={(chip) => setSelectedChip(chip)}
            />

            {selectedChip === types.booking_type_room && (
              <RoomBooking
                items={items}
                value={value}
                onSwitchChange={(val) => setValue(val)}
              />
            )}
            {selectedChip === types.booking_type_food && <FormComponent2 />}
            {selectedChip === types.booking_type_travel && <FormComponent3 />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const RoomBooking = ({ items, value, onSwitchChange }) => {
  const [selected, setSelected] = useState('');
  const [startDay, setStartDay] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const { width } = useWindowDimensions();
  const today = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');

  return (
    <View className="flex-1 justify-center items-center mt-10">
      <MultiSwitch
        items={items}
        value={value}
        onChange={(val) => onSwitchChange(val)}
        containerStyle={{
          backgroundColor: '#E5E7EB',
          height: 40,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: '#E5E7EB'
        }}
        sliderStyle={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20
        }}
        textStyle={{
          color: '#000000',
          fontSize: 12,
          fontFamily: 'poppins-medium'
        }}
      />

      {value === items[0] && (
        <Calendar
          className="mt-5"
          style={{
            width: width * 0.9
          }}
          minDate={today}
          onDayPress={(day) => {
            if (startDay && !endDay) {
              const date = {};
              for (
                const d = moment(startDay);
                d.isSameOrBefore(day.dateString);
                d.add(1, 'days')
              ) {
                date[d.format('YYYY-MM-DD')] = {
                  color: colors.orange,
                  textColor: 'white'
                };

                if (d.format('YYYY-MM-DD') === startDay)
                  date[d.format('YYYY-MM-DD')].startingDay = true;
                if (d.format('YYYY-MM-DD') === day.dateString)
                  date[d.format('YYYY-MM-DD')].endingDay = true;
              }

              setMarkedDates(date);
              setEndDay(day.dateString);
            } else {
              setStartDay(day.dateString);
              setEndDay(null);
              setMarkedDates({
                [day.dateString]: {
                  color: colors.orange,
                  textColor: 'white',
                  startingDay: true,
                  endingDay: true
                }
              });
            }
          }}
          markedDates={markedDates}
          markingType="period"
          theme={{
            arrowColor: colors.orange,
            todayTextColor: colors.orange
          }}
        />
      )}

      {value === items[1] && (
        <Calendar
          className="mt-5"
          style={{
            width: width * 0.9
          }}
          minDate={today}
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {
              textColor: 'white',
              selected: true,
              disableTouchEvent: true,
              selectedColor: colors.orange
            }
          }}
          theme={{
            arrowColor: colors.orange,
            todayTextColor: colors.orange
          }}
        />
      )}
    </View>
  );
};

const FormComponent2 = () => {
  // Form component for Chip 2
  return (
    <View className="flex-1 justify-center items-center mt-5">
      <Text>Form for Chip 2</Text>
    </View>
  );
};

const FormComponent3 = () => {
  // Form component for Chip 3
  return (
    <View className="flex-1 justify-center items-center mt-5">
      <Text>Form for Chip 3</Text>
    </View>
  );
};

export default BookNow;
