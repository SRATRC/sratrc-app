import { View, Text, Image, Platform } from 'react-native';
import { icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';

const GuestFoodBookingDetails = ({ containerStyles }) => {
  const { guestData } = useGlobalContext();

  const formattedStartDate = moment(guestData.food.startDay).format('Do MMMM');
  const formattedEndDate = moment(guestData.food.endDay).format(
    'Do MMMM, YYYY'
  );

  const meals = guestData.food.meals.map((meal) => meal).join(', ');

  return (
    <View className={`w-full px-4 ${containerStyles}`}>
      <Text className="text-xl font-psemibold text-secondary">
        Raj Prasad Booking
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
            source={icons.food}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <View className="w-full flex-1">
            <Text className="font-pmedium text-md">
              {`${formattedStartDate} ${formattedEndDate && '-'} ${
                formattedEndDate && formattedEndDate
              }`}
            </Text>
          </View>
        </View>

        <HorizontalSeparator otherStyles={'mb-4'} />

        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.person}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Booked For: </Text>
          <Text className="text-black font-pmedium">
            {guestData.food.guests.length} Guests
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GuestFoodBookingDetails;
