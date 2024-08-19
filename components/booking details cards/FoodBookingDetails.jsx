import { View, Text, Image, Platform } from 'react-native';
import { icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';

const FoodBookingDetails = ({ containerStyles }) => {
  const { data } = useGlobalContext();

  const formattedStartDate = moment(data.food.startDay).format('Do MMMM');
  const formattedEndDate = moment(data.food.endDay).format('Do MMMM, YYYY');

  const meals = data.food.meals.map((meal) => meal).join(', ');

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
          <Image source={icons.meal} className="w-4 h-4" resizeMode="contain" />
          <Text className="text-gray-400 font-pregular">Meals: </Text>
          <Text className="text-black font-pmedium">{meals}</Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.spice}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Spice Level:</Text>
          <Text className="text-black font-pmedium">
            {data.food.spicy ? 'Regular' : 'Non Spicy'}
          </Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.hightea}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">High Tea:</Text>
          <Text className="text-black font-pmedium">{data.food.hightea}</Text>
        </View>
      </View>
    </View>
  );
};

export default FoodBookingDetails;
