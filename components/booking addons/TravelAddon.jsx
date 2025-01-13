import { View, Text, Image, TouchableOpacity } from 'react-native';
import { icons, colors } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomDropdown from '../CustomDropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FormField from '../FormField';
import FormDisplayField from '../FormDisplayField';
import AddonItem from '../AddonItem';
import moment from 'moment';

const LOCATION_LIST = [
  { key: 'rc', value: 'RC' },
  { key: 'dadar', value: 'Dadar - Swaminarayan Temple' },
  { key: 'amar mahar', value: 'Amar Mahal - Chembur/Ghatkopar' },
  { key: 'mullund', value: 'Mullund Airoli Junction' },
  { key: 'airport t1', value: 'Airport Terminal 1' },
  { key: 'airport t2', value: 'Airport Terminal 2' },
  { key: 'ltt', value: 'Lokmanya Tilak Terminus Station (LTT)' },
  { key: 'cstm', value: 'Chatrapati Shivaji Terminus Station (CSTM)' },
  { key: 'vile parle', value: 'Vile Parle East' },
  { key: 'borivali', value: 'Borivali East' },
  { key: 'other', value: 'Other' }
];

const LUGGAGE_LIST = [
  { key: 'cabin1', value: '1 Cabin Bag' },
  { key: 'cabin2', value: '2 Cabin Bags' },
  { key: 'suitcase1', value: '1 Suitcase' },
  { key: 'suitcase2', value: '2 Suitcases' },
  { key: 'none', value: 'NONE' }
];

const BOOKING_TYPE_LIST = [
  { key: 'regular', value: 'Regular' },
  { key: 'full', value: 'Full Car' }
];

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
      <TouchableOpacity
        onPress={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            travel: true
          })
        }
      >
        <FormDisplayField
          text="Date"
          value={
            travelForm.date
              ? moment(travelForm.date).format('Do MMMM YYYY')
              : 'Date'
          }
          otherStyles="mt-7"
          backgroundColor="bg-gray-100"
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible.travel}
        mode="date"
        onConfirm={(date) => {
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
        onCancel={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            travel: false
          })
        }
        minimumDate={moment().add(1, 'days').toDate()}
      />

      <CustomDropdown
        otherStyles="mt-7"
        text={'Pickup Location'}
        placeholder={'Select Location'}
        data={LOCATION_LIST}
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
        data={LOCATION_LIST}
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
        data={LUGGAGE_LIST}
        save={'value'}
        setSelected={(val) => setTravelForm({ ...travelForm, luggage: val })}
      />

      <CustomDropdown
        otherStyles="mt-7"
        text={'Booking Type'}
        placeholder={'Select booking type'}
        data={BOOKING_TYPE_LIST}
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
