import { View, Text, Image } from 'react-native';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';
import CustomTag from '../CustomTag';
import PrimaryAddonBookingCard from '../PrimaryAddonBookingCard';

const RoomBookingDetails = ({ containerStyles }) => {
  const { data } = useGlobalContext();

  const formattedStartDate = moment(data.room.startDay).format('Do MMMM');
  const formattedEndDate = moment(data.room.endDay).format('Do MMMM, YYYY');

  return (
    <PrimaryAddonBookingCard
      containerStyles={containerStyles}
      title="Raj Sharan Booking"
    >
      <View className="flex p-4 flex-row items-center space-x-4">
        <Image source={icons.room} className="w-10 h-10" resizeMode="contain" />
        <View className="w-full flex-1 justify-center space-y-1">
          {data.validationData?.roomDetails?.status && (
            <CustomTag
              text={data.validationData?.roomDetails?.status}
              textStyles={
                data.validationData?.roomDetails?.status ==
                status.STATUS_AVAILABLE
                  ? 'text-green-200'
                  : 'text-red-200'
              }
              containerStyles={
                data.validationData?.roomDetails?.status ==
                status.STATUS_AVAILABLE
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }
            />
          )}
          <Text className="font-pmedium text-md">
            {`${formattedStartDate} - ${formattedEndDate}`}
          </Text>
        </View>
      </View>

      <HorizontalSeparator otherStyles={'mb-4'} />

      <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.ac} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Room Type: </Text>
        <Text className="text-black font-pmedium">
          {data.room.roomType === 'ac' ? 'AC ROOM' : 'Non AC ROOM'}
        </Text>
      </View>
      <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.elder} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">
          Ground Floor Booking:
        </Text>
        <Text className="text-black font-pmedium">
          {data.room.floorType === 'SC' ? 'Ground Floor' : 'Any Floor'}
        </Text>
      </View>
      {data.room.charge && (
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">₹ {data.room.charge}</Text>
        </View>
      )}
    </PrimaryAddonBookingCard>
  );
};

export default RoomBookingDetails;
