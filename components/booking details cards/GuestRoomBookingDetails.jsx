import { View, Text, Image, ScrollView } from 'react-native';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { countStatusesForField } from '../../utils/BookingValidationStatusCounter';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';
import CustomTag from '../CustomTag';
import PrimaryAddonBookingCard from '../PrimaryAddonBookingCard';

const GuestRoomBookingDetails = ({ containerStyles }) => {
  const { guestData } = useGlobalContext();
  const formattedStartDate = moment(guestData?.room?.startDay).format(
    'Do MMMM'
  );
  const formattedEndDate = guestData?.room?.endDay
    ? moment(guestData?.room?.endDay).format('Do MMMM, YYYY')
    : null;

  const validationData = guestData?.validationData
    ? countStatusesForField(guestData?.validationData, 'roomDetails')
    : {};

  return (
    <PrimaryAddonBookingCard
      containerStyles={containerStyles}
      title="Raj Sharan Booking"
    >
      <View className="flex p-4 flex-row items-center space-x-4">
        <Image source={icons.room} className="w-10 h-10" resizeMode="contain" />
        <View className="w-full flex-1 justify-center space-y-1">
          {validationData && Object.keys(validationData).length > 0 && (
            <ScrollView horizontal>
              {Object.entries(validationData).map(([key, value]) => (
                <CustomTag
                  key={key}
                  text={`${key}: ${value}`}
                  textStyles={
                    key == status.STATUS_AVAILABLE
                      ? 'text-green-200'
                      : 'text-red-200'
                  }
                  containerStyles={`${
                    key == status.STATUS_AVAILABLE
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  } mx-1`}
                />
              ))}
            </ScrollView>
          )}
          <Text className="font-pmedium text-md">
            {`${formattedStartDate} - ${formattedEndDate}`}
          </Text>
        </View>
      </View>

      <HorizontalSeparator otherStyles={'mb-4'} />

      <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.person} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Booked For: </Text>
        <Text className="text-black font-pmedium">
          {guestData?.room?.guestGroup?.reduce(
            (acc, group) => acc + group.guests.length,
            0
          )}{' '}
          Guests
        </Text>
      </View>
      {/* <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.ac} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Room Type: </Text>
        <Text className="text-black font-pmedium">
          {guestData.room.roomType === 'ac' ? 'AC ROOM' : 'Non AC ROOM'}
        </Text>
      </View>
      <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.elder} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">
          Ground Floor Booking:
        </Text>
        <Text className="text-black font-pmedium">
          {guestData.room.floorType === 'SC' ? 'Ground Floor' : 'Any Floor'}
        </Text>
      </View> */}
      {guestData.room.charge && (
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">
            ₹ {guestData.room.charge}
          </Text>
        </View>
      )}
    </PrimaryAddonBookingCard>
  );
};

export default GuestRoomBookingDetails;
