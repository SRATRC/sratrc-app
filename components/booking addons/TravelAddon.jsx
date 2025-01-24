import { View, Text, Image } from 'react-native';
import { icons, colors, dropdowns } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomDropdown from '../CustomDropdown';
import CustomDateInput from '../CustomDateInput';
import FormField from '../FormField';
import AddonItem from '../AddonItem';
import moment from 'moment';

const TravelAddon = ({
  travelForm,
  setTravelForm,
  isDatePickerVisible,
  setDatePickerVisibility
}) => {
  const { setData } = useGlobalContext();
  return (
    <AddonItem
      onCollapse={() => {
        setTravelForm({
          date: '',
          pickup: '',
          drop: '',
          luggage: '',
          type: 'regular',
          special_request: ''
        });
        setData((prev) => {
          const { travel, ...rest } = prev;
          return rest;
        });
      }}
      visibleContent={
        <View className="flex flex-row items-center space-x-4">
          <Image
            source={icons.travel}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <Text className="font-pmedium">Raj Pravas Booking</Text>
        </View>
      }
      containerStyles={'mt-3'}
    >
      <CustomDateInput
        openDatePicker={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            travel: true
          })
        }
        text={'Date'}
        date={new Date(travelForm.date)}
        value={
          travelForm.date
            ? moment(travelForm.date).format('Do MMMM YYYY')
            : 'Date'
        }
        isDatePickerVisible={isDatePickerVisible.travel}
        onDateSelect={(date) => {
          setTravelForm({
            ...travelForm,
            date:
              moment(date) < moment().add(1, 'days').toDate()
                ? moment().add(1, 'days').format('YYYY-MM-DD')
                : moment(date).format('YYYY-MM-DD')
          });
          setDatePickerVisibility({
            ...isDatePickerVisible,
            travel: false
          });
        }}
        onDateCancel={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            travel: false
          })
        }
      />

      <CustomDropdown
        otherStyles="mt-7"
        text={'Pickup Location'}
        placeholder={'Select Location'}
        data={dropdowns.LOCATION_LIST}
        setSelected={(val) =>
          setTravelForm({
            ...travelForm,
            pickup: val
          })
        }
        boxbg={colors.gray_100}
      />

      <CustomDropdown
        otherStyles="mt-7"
        text={'Drop Location'}
        placeholder={'Select Location'}
        data={dropdowns.LOCATION_LIST}
        setSelected={(val) =>
          setTravelForm({
            ...travelForm,
            drop: val
          })
        }
        boxbg={colors.gray_100}
      />

      <CustomDropdown
        otherStyles="mt-7"
        text={'Luggage'}
        placeholder={'Select any luggage'}
        data={dropdowns.LUGGAGE_LIST}
        save={'value'}
        setSelected={(val) => setTravelForm({ ...travelForm, luggage: val })}
      />

      <CustomDropdown
        otherStyles="mt-7"
        text={'Booking Type'}
        placeholder={'Select booking type'}
        data={dropdowns.BOOKING_TYPE_LIST}
        save={'value'}
        defaultOption={{ key: 'regular', value: 'Regular' }}
        setSelected={(val) => setTravelForm({ ...travelForm, type: val })}
      />

      <FormField
        text="Any Special Request?"
        value={travelForm.special_request}
        handleChangeText={(e) =>
          setTravelForm({
            ...travelForm,
            special_request: e
          })
        }
        otherStyles="mt-7"
        containerStyles="bg-gray-100"
        keyboardType="default"
        placeholder="please specify your request here..."
      />
    </AddonItem>
  );
};

export default TravelAddon;
