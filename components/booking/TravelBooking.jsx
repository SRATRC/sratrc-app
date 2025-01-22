import { View, Text } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { types } from '../../constants';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import FormField from '../FormField';
import CustomModal from '../CustomModal';
import CustomChipGroup from '../CustomChipGroup';
import OtherMumukshuForm from '../OtherMumukshuForm';

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
  { key: 'full', value: 'Full Car Booking' },
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

const CHIPS = ['Self', 'Other Mumukshus'];

const INITIAL_MUMUKSHU_FORM = {
  date: '',
  mumukshus: [
    {
      mobno: '',
      pickup: '',
      drop: '',
      luggage: '',
      type: 'regular',
      special_request: ''
    }
  ]
};

const TravelBooking = () => {
  const router = useRouter();
  const { updateBooking, updateMumukshuBooking } = useGlobalContext();

  useEffect(
    useCallback(() => {
      setIsSubmitting(false);
    }, [])
  );

  const [selectedChip, setSelectedChip] = useState('Self');
  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [travelForm, setTravelForm] = useState({
    date: '',
    pickup: '',
    drop: '',
    luggage: '',
    type: 'regular',
    special_request: ''
  });

  const [mumukshuForm, setMumukshuForm] = useState(INITIAL_MUMUKSHU_FORM);

  const addMumukshuForm = () => {
    setMumukshuForm((prev) => ({
      ...prev,
      mumukshus: [
        ...prev.mumukshus,
        {
          mobno: '',
          pickup: '',
          drop: '',
          luggage: '',
          type: 'regular',
          special_request: ''
        }
      ]
    }));
  };

  const removeMumukshuForm = (indexToRemove) => {
    setMumukshuForm((prev) => ({
      ...prev,
      mumukshus: prev.mumukshus.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleMumukshuFormChange = (index, key, value) => {
    setMumukshuForm((prev) => ({
      ...prev,
      mumukshus: prev.mumukshus.map((mumukshu, i) =>
        i === index ? { ...mumukshu, [key]: value } : mumukshu
      )
    }));
  };

  const isMumukshuFormValid = () => {
    if (!mumukshuForm.date) {
      return false;
    }

    return mumukshuForm.mumukshus.every((mumukshu) => {
      if (
        (mumukshu.pickup == 'RC' && mumukshu.drop == 'RC') ||
        (mumukshu.pickup != 'RC' && mumukshu.drop != 'RC')
      ) {
        return false;
      }

      return (
        mumukshu.mobno &&
        mumukshu.mobno?.length == 10 &&
        mumukshu.pickup &&
        mumukshu.drop &&
        mumukshu.luggage &&
        mumukshu.type
      );
    });
  };

  return (
    <View className="flex-1 w-full">
      <CustomCalender
        selectedDay={travelForm.date}
        setSelectedDay={(day) => {
          setTravelForm((prev) => ({ ...prev, date: day }));
          setMumukshuForm((prev) => ({ ...prev, date: day }));
        }}
      />

      <View className="w-full mt-7 flex flex-col">
        <Text className="text-base text-gray-600 font-pmedium">Book for</Text>
        <CustomChipGroup
          chips={CHIPS}
          selectedChip={selectedChip}
          handleChipPress={handleChipClick}
          containerStyles={'mt-1'}
          chipContainerStyles={'py-2'}
          textStyles={'text-sm'}
        />
      </View>

      {selectedChip == CHIPS[0] && (
        <View>
          <CustomDropdown
            otherStyles="mt-7"
            text={'Pickup Location'}
            placeholder={'Select Location'}
            save={'value'}
            data={LOCATION_LIST}
            setSelected={(val) => setTravelForm({ ...travelForm, pickup: val })}
          />
          <CustomDropdown
            otherStyles="mt-7"
            text={'Drop Location'}
            placeholder={'Select Location'}
            data={LOCATION_LIST}
            save={'value'}
            setSelected={(val) => setTravelForm({ ...travelForm, drop: val })}
          />
          <CustomDropdown
            otherStyles="mt-7"
            text={'Luggage'}
            placeholder={'Select any luggage'}
            data={LUGGAGE_LIST}
            save={'value'}
            setSelected={(val) =>
              setTravelForm({ ...travelForm, luggage: val })
            }
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
              setTravelForm({ ...travelForm, special_request: e })
            }
            otherStyles="mt-7"
            containerStyles="bg-gray-100"
            keyboardType="default"
            placeholder="please specify your request here..."
          />
        </View>
      )}

      {selectedChip == CHIPS[1] && (
        <View>
          <OtherMumukshuForm
            mumukshuForm={mumukshuForm}
            handleMumukshuFormChange={handleMumukshuFormChange}
            addMumukshuForm={addMumukshuForm}
            removeMumukshuForm={removeMumukshuForm}
          >
            {(index) => (
              <>
                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Pickup Location'}
                  placeholder={'Select Location'}
                  save={'value'}
                  data={LOCATION_LIST}
                  setSelected={(val) =>
                    handleMumukshuFormChange(index, 'pickup', val)
                  }
                />
                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Drop Location'}
                  placeholder={'Select Location'}
                  data={LOCATION_LIST}
                  save={'value'}
                  setSelected={(val) =>
                    handleMumukshuFormChange(index, 'drop', val)
                  }
                />
                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Luggage'}
                  placeholder={'Select any luggage'}
                  data={LUGGAGE_LIST}
                  save={'value'}
                  setSelected={(val) =>
                    handleMumukshuFormChange(index, 'luggage', val)
                  }
                />
                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Booking Type'}
                  placeholder={'Select booking type'}
                  data={BOOKING_TYPE_LIST}
                  save={'value'}
                  defaultOption={{ key: 'regular', value: 'Regular' }}
                  setSelected={(val) =>
                    handleMumukshuFormChange(index, 'type', val)
                  }
                />

                <FormField
                  text="Any Special Request?"
                  value={travelForm.special_request}
                  handleChangeText={(e) =>
                    handleMumukshuFormChange(index, 'special_request', e)
                  }
                  otherStyles="mt-7"
                  containerStyles="bg-gray-100"
                  keyboardType="default"
                  placeholder="please specify your request here..."
                />
              </>
            )}
          </OtherMumukshuForm>
        </View>
      )}
      <CustomButton
        text="Book Now"
        handlePress={async () => {
          setIsSubmitting(true);
          if (selectedChip == CHIPS[0]) {
            if (
              (travelForm.pickup == 'RC' && travelForm.drop == 'RC') ||
              (travelForm.pickup != 'RC' && travelForm.drop != 'RC')
            ) {
              setModalVisible(true);
              setModalMessage('Invalid Pickup/Drop Locations');
              setIsSubmitting(false);
              return;
            }

            if (
              !travelForm.date ||
              !travelForm.pickup ||
              !travelForm.drop ||
              !travelForm.luggage
            ) {
              setModalVisible(true);
              setModalMessage('Please enter all details');
              setIsSubmitting(false);
              return;
            }

            await updateBooking('travel', travelForm);
            router.push(`/booking/${types.TRAVEL_DETAILS_TYPE}`);
          }
          if (selectedChip == CHIPS[1]) {
            if (!isMumukshuFormValid()) {
              setModalVisible(true);
              setModalMessage('Please fill all fields');
              setIsSubmitting(false);
              return;
            }

            const temp = transformMumukshuData(mumukshuForm);
            console.log(temp);

            await updateMumukshuBooking('travel', temp);
            router.push(`/mumukshuBooking/${types.TRAVEL_DETAILS_TYPE}`);
          }
        }}
        containerStyles="mt-7 w-full px-1 min-h-[62px]"
        isLoading={isSubmitting}
      />
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
        btnText={'Okay'}
      />
    </View>
  );
};

function transformMumukshuData(inputData) {
  const { date, mumukshus } = inputData;

  const groupedMumukshus = mumukshus.reduce((acc, mumukshu, index) => {
    const key = `${mumukshu.pickup}-${mumukshu.drop}`;
    if (!acc[key]) {
      acc[key] = {
        pickup: mumukshu.pickup,
        drop: mumukshu.drop,
        mumukshus: []
      };
    }
    acc[key].mumukshus.push(mumukshu.mobno);

    return acc;
  }, {});

  const mumukshuGroup = Object.values(groupedMumukshus);

  return {
    date: date,
    mumukshuGroup: mumukshuGroup
  };
}

export default TravelBooking;
