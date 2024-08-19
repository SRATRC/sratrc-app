import { View, Text, Image, Platform } from 'react-native';
import { useEffect } from 'react';
import { icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';
import prices from '../../constants/prices';

const RoomBookingDetails = () => {
  const { data, setData } = useGlobalContext();

  const formattedStartDate = moment(data.room.startDay).format('Do MMMM');
  const formattedEndDate = moment(data.room.endDay).format('Do MMMM, YYYY');

  const charge =
    moment(data.room.endDay).diff(moment(data.room.startDay), 'days') *
    (data.room.roomType === 'ac'
      ? prices.AC_ROOM_PRICE
      : prices.NAC_ROOM_PRICE);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      room: { ...prevData.room, charge }
    }));
  }, [data.room.startDay, data.room.endDay, data.room.roomType]);

  return (
    <View className="w-full px-4">
      <Text className="text-xl font-psemibold text-secondary">
        Raj Sharan Booking
      </Text>
      <View
        className={`flex flex-col bg-white rounded-2xl mt-4 ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        }`}
      >
        <View className="flex p-4 flex-row items-center space-x-4">
          <Image
            source={icons.room}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <View className="w-full flex-1">
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
          <Image
            source={icons.elder}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">
            Ground Floor Booking:
          </Text>
          <Text className="text-black font-pmedium">
            {data.room.floorType === 'SC' ? 'Ground Floor' : 'Any Floor'}
          </Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">₹ {charge}</Text>
        </View>
      </View>
    </View>
  );
};

export default RoomBookingDetails;
