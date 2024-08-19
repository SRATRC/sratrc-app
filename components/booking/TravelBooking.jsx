import { View, Alert } from 'react-native';
import React, { useState } from 'react';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import FormField from '../../components/FormField';
import handleAPICall from '../../utils/HandleApiCall';
import { types } from '../../constants';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';

const TravelBooking = ({ user }) => {
  const router = useRouter();
  const { setData } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [travelForm, setTravelForm] = useState({
    date: '',
    pickup: '',
    drop: '',
    luggage: '',
    special_request: ''
  });

  const locationData = [
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
    { key: 'full', value: 'Full Car Booking' },
    { key: 'other', value: 'Other' }
  ];

  const luggageList = [
    { key: 'cabin1', value: '1 Cabin Bag' },
    { key: 'cabin2', value: '2 Cabin Bags' },
    { key: 'suitcase1', value: '1 Suitcase' },
    { key: 'suitcase2', value: '2 Suitcases' },
    { key: 'none', value: 'NONE' }
  ];

  return (
    <View className="flex-1 justify-center items-center">
      <CustomCalender
        selectedDay={travelForm.date}
        setSelectedDay={(day) =>
          setTravelForm((prev) => ({ ...prev, date: day }))
        }
      />
      <CustomDropdown
        otherStyles="mt-7"
        text={'Pickup Location'}
        placeholder={'Select Location'}
        save={'value'}
        data={locationData}
        setSelected={(val) => setTravelForm({ ...travelForm, pickup: val })}
      />
      <CustomDropdown
        otherStyles="mt-7"
        text={'Drop Location'}
        placeholder={'Select Location'}
        data={locationData}
        save={'value'}
        setSelected={(val) => setTravelForm({ ...travelForm, drop: val })}
      />
      <CustomDropdown
        otherStyles="mt-7"
        text={'Luggage'}
        placeholder={'Select any luggage'}
        data={luggageList}
        save={'value'}
        setSelected={(val) => setTravelForm({ ...travelForm, luggage: val })}
      />

      <FormField
        text="Any Special Request?"
        value={travelForm.special_request}
        handleChangeText={(e) =>
          setTravelForm({ ...travelForm, special_request: e })
        }
        otherStyles="mt-7"
        containerStyles="bg-gray-100"
        keyboardType="default"
        placeholder="please specify your request here..."
      />
      <CustomButton
        text="Book Now"
        handlePress={async () => {
          setIsSubmitting(true);
          if (
            (travelForm.pickup == 'RC' && travelForm.drop == 'RC') ||
            (travelForm.pickup != 'RC' && travelForm.drop != 'RC')
          ) {
            Alert.alert('Invalid Pickup/Drop Locations');
            setIsSubmitting(false);
            return;
          }

          if (
            !travelForm.date ||
            !travelForm.pickup ||
            !travelForm.drop ||
            !travelForm.luggage
          ) {
            Alert.alert('Please fill all fields');
            setIsSubmitting(false);
            return;
          }

          setData((prev) => ({ ...prev, travel: travelForm }));
          router.push(`/${types.TRAVEL_DETAILS_TYPE}`);
        }}
        containerStyles="mt-7 w-full px-1 min-h-[62px]"
        isLoading={isSubmitting}
      />
    </View>
  );
};

export default TravelBooking;
