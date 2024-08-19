import { View, Text, Image, Platform } from 'react-native';
import { icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../HorizontalSeparator';
import moment from 'moment';

const AdhyayanBookingDetails = ({ containerStyles }) => {
  const { data } = useGlobalContext();

  const formattedStartDate = moment(data.adhyayan.start_date).format('Do MMMM');
  const formattedEndDate = moment(data.adhyayan.end_date).format(
    'Do MMMM, YYYY'
  );

  return (
    <View className={`w-full px-4 ${containerStyles}`}>
      <Text className="text-xl font-psemibold text-secondary">
        Raj Adhyayan Booking
      </Text>
      <View
        className={`flex flex-col bg-white rounded-2xl mt-4 ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        }`}
      >
        <View className="flex p-4 flex-row space-x-4">
          <Image
            source={icons.adhyayan}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <View className="w-full flex-1">
            <View className="flex flex-row items-center space-x-2">
              <Text className="text-black font-psemibold">Name:</Text>
              <Text
                className="text-secondary font-pmedium flex-1"
                numberOfLines={1}
              >
                {data.adhyayan.name}
              </Text>
            </View>
            <Text className="font-pmedium text-gray-400">
              {`${formattedStartDate} - ${formattedEndDate}`}
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
          <Text className="text-gray-400 font-pregular">Swadhyay Karta:</Text>
          <Text className="text-black font-pmedium">
            {data.adhyayan.speaker}
          </Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">
            ₹ {data.adhyayan.amount}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AdhyayanBookingDetails;
