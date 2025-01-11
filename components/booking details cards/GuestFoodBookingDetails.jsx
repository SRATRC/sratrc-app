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

  // const mealEntries = guestData.food.guestGroup.map((group, index) => {
  //   const mealNames = group.meals.join(', ');
  //   const guestNames = group.guests.map((guest) => guest.name).join(', ');
  //   return (
  //     <Text key={index} className="text-black font-pmedium text-xs">
  //       {`${mealNames} for ${guestNames}`}
  //     </Text>
  //   );
  // });

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

        <View className="flex px-6 pb-4 flex-row space-x-1">
          <Image
            source={icons.person}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Booked For: </Text>
          <Text className="text-black font-pmedium">
            {guestData.food.guestGroup.reduce(
              (acc, group) => acc + group.guests.length,
              0
            )}{' '}
            Guests
          </Text>
        </View>
        {/* <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image source={icons.meal} className="w-4 h-4" resizeMode="contain" />
          <Text className="text-gray-400 font-pregular">Meals: </Text>
          <View>{mealEntries}</View>
        </View> */}
      </View>
    </View>
  );
};

export default GuestFoodBookingDetails;
