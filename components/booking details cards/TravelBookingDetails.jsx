import { View, Text, Image } from 'react-native';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';
import CustomTag from '../CustomTag';
import PrimaryAddonBookingCard from '../PrimaryAddonBookingCard';

const TravelBookingDetails = ({ containerStyles }) => {
  const { data } = useGlobalContext();

  return (
    <PrimaryAddonBookingCard
      containerStyles={containerStyles}
      title={'Raj Pravas Booking'}
    >
      <View className="flex p-4 flex-row items-center space-x-4">
        <Image
          source={icons.travel}
          className="w-10 h-10"
          resizeMode="contain"
        />
        <View className="w-full flex-1 justify-center space-y-1">
          {data.validationData?.travelDetails?.status && (
            <CustomTag
              text={data.validationData?.travelDetails?.status}
              textStyles={
                data.validationData?.travelDetails?.status ==
                status.STATUS_AVAILABLE
                  ? 'text-green-200'
                  : 'text-red-200'
              }
              containerStyles={
                data.validationData?.travelDetails?.status ==
                status.STATUS_AVAILABLE
                  ? 'bg-green-100'
                  : 'bg-red-100'
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
        <Image source={icons.marker} className="w-4 h-4" resizeMode="contain" />
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
    </PrimaryAddonBookingCard>
  );
};

export default TravelBookingDetails;
