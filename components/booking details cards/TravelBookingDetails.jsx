import { View, Text, Image, Platform } from 'react-native';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';
import CustomTag from '../CustomTag';

const TravelBookingDetails = ({ containerStyles }) => {
  const { data } = useGlobalContext();

  return (
    <View className={`w-full px-4 ${containerStyles}`}>
      <Text className="text-xl font-psemibold text-secondary">
        Raj Pravas Booking
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
            source={icons.travel}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <View className="w-full flex-1 justify-center space-y-1">
            {data.travel.booking_status && (
              <CustomTag
                text={data.travel.booking_status}
                textStyles={
                  data.travel.booking_status == status.STATUS_WAITING
                    ? 'text-red-200'
                    : 'text-green-200'
                }
                containerStyles={
                  data.travel.booking_status == status.STATUS_WAITING
                    ? 'bg-red-100'
                    : 'bg-green-100'
                }
              />
            )}
            <Text className="font-pmedium text-md">
              {moment(data.travel.date).format('Do MMMM, YYYY')}
            </Text>
          </View>
        </View>

        <HorizontalSeparator otherStyles={'mb-4'} />

        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.marker}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">
            {data.travel.pickup == 'RC' ? 'Drop Point' : 'Pickup Point'}
          </Text>
          <Text className="text-black font-pmedium flex-1" numberOfLines={1}>
            {data.travel.pickup == 'RC'
              ? `${data.travel.drop}`
              : `${data.travel.pickup}`}
          </Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.luggage}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Luggage</Text>
          <Text className="text-black font-pmedium">{data.travel.luggage}</Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image source={icons.car} className="w-4 h-4" resizeMode="contain" />
          <Text className="text-gray-400 font-pregular">Booking Type</Text>
          <Text className="text-black font-pmedium">{data.travel.type}</Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.request}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Special Request:</Text>
          <Text className="text-black font-pmedium flex-1" numberOfLines={1}>
            {data.travel.special_request ? data.travel.special_request : 'None'}
          </Text>
        </View>
        {data.travel.charge && (
          <View className="flex px-6 pb-4 flex-row space-x-2">
            <Image
              source={icons.charge}
              className="w-4 h-4"
              resizeMode="contain"
            />
            <Text className="text-gray-400 font-pregular">Charges:</Text>
            <Text className="text-black font-pmedium">
              ₹ {data.travel.charge}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TravelBookingDetails;