import { View, Text, Image, ScrollView } from 'react-native';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { countStatusesForField } from '../../utils/BookingValidationStatusCounter';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';
import CustomTag from '../CustomTag';
import PrimaryAddonBookingCard from '../PrimaryAddonBookingCard';

const MumukshuRoomBookingDetails = ({ containerStyles }) => {
  const { mumukshuData } = useGlobalContext();
  const formattedStartDate = moment(mumukshuData?.room?.startDay).format(
    'Do MMMM'
  );
  const formattedEndDate = mumukshuData?.room?.endDay
    ? moment(mumukshuData?.room?.endDay).format('Do MMMM, YYYY')
    : null;

  const validationData = mumukshuData?.validationData
    ? countStatusesForField(mumukshuData?.validationData, 'roomDetails')
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
          {mumukshuData?.room?.mumukshuGroup?.reduce(
            (acc, group) => acc + group.mumukshus.length,
            0
          )}{' '}
          mumukshus
        </Text>
      </View>
      {mumukshuData.room.charge && (
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">
            ₹ {mumukshuData.room.charge}
          </Text>
        </View>
      )}
    </PrimaryAddonBookingCard>
  );
};

export default MumukshuRoomBookingDetails;
