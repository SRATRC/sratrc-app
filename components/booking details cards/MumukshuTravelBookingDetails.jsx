import { View, Text, Image, ScrollView } from 'react-native';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../HorizontalSeparator';
import moment from 'moment';
import CustomTag from '../CustomTag';
import PrimaryAddonBookingCard from '../PrimaryAddonBookingCard';

const MumukshuTravelBookingDetail = ({ containerStyles }) => {
  const { mumukshuData } = useGlobalContext();

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
          {mumukshuData.validationData?.travelDetails?.length > 0 && (
            <ScrollView horizontal>
              {mumukshuData.validationData &&
                Object.keys(mumukshuData.validationData).length > 0 &&
                mumukshuData.validationData.travelDetails[0]?.available !==
                  0 && (
                  <CustomTag
                    text={`available: ${mumukshuData.validationData.travelDetails[0].available}`}
                    textStyles={'text-green-200'}
                    containerStyles={'bg-green-100'}
                  />
                )}

              {mumukshuData.validationData &&
                Object.keys(mumukshuData.validationData).length > 0 &&
                mumukshuData.validationData.travelDetails[0]?.waiting !== 0 && (
                  <CustomTag
                    text={`waiting: ${mumukshuData.validationData.travelDetails[0].waiting}`}
                    textStyles={'text-red-200'}
                    containerStyles={'bg-red-100'}
                  />
                )}
            </ScrollView>
          )}
          <Text className="font-pmedium text-md">
            {moment(mumukshuData.travel.date).format('Do MMMM, YYYY')}
          </Text>
        </View>
      </View>

      <HorizontalSeparator otherStyles={'mb-4'} />

      {/* <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.marker} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">
          {mumukshuData.travel.pickup == 'RC' ? 'Drop Point' : 'Pickup Point'}
        </Text>
        <Text className="text-black font-pmedium flex-1" numberOfLines={1}>
          {mumukshuData.travel.pickup == 'RC'
            ? `${mumukshuData.travel.drop}`
            : `${mumukshuData.travel.pickup}`}
        </Text>
      </View> */}
      <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.person} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Booked For: </Text>
        <Text className="text-black font-pmedium">
          {mumukshuData.travel.mumukshuGroup?.length ||
            mumukshuData.travel.mumukshus?.length}{' '}
          Mumukshus
        </Text>
      </View>
    </PrimaryAddonBookingCard>
  );
};

export default MumukshuTravelBookingDetail;
