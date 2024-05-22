import { useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
import { colors } from '../constants';
import { Calendar } from 'react-native-calendars';

const CustomCalender = ({
  type,
  startDay,
  setStartDay,
  endDay,
  setEndDay,
  selectedDay,
  setSelectedDay
}) => {
  const { width } = useWindowDimensions();
  const today = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
  const [markedDates, setMarkedDates] = useState({});

  const handlePeriodPress = (day) => {
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
  };

  return (
    <Calendar
      className="mt-5"
      style={{
        width: width * 0.9
      }}
      minDate={today}
      onDayPress={(day) => {
        if (type === 'period') {
          handlePeriodPress(day);
        } else {
          setSelectedDay(day.dateString);
        }
      }}
      markedDates={
        type === 'period'
          ? markedDates
          : {
              [selectedDay]: {
                textColor: 'white',
                selected: true,
                disableTouchEvent: true,
                selectedColor: colors.orange
              }
            }
      }
      markingType={type}
      theme={{
        arrowColor: colors.orange,
        todayTextColor: colors.orange
      }}
    />
  );
};

export default CustomCalender;
