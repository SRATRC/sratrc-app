import { View, Text, Image } from 'react-native';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../HorizontalSeparator';
import CustomTag from '../CustomTag';
import moment from 'moment';
import PrimaryAddonBookingCard from '../PrimaryAddonBookingCard';

const AdhyayanBookingDetails = ({ containerStyles }) => {
  const { data } = useGlobalContext();
  const formattedStartDate = moment(data.adhyayan.start_date).format('Do MMMM');
  const formattedEndDate = moment(data.adhyayan.end_date).format(
    'Do MMMM, YYYY'
  );

  return (
    <PrimaryAddonBookingCard
      title={'Raj Adhyayan Booking'}
      containerStyles={containerStyles}
    >
      <View className="flex p-4 flex-row space-x-4 item-center">
        <Image
          source={icons.adhyayan}
          className="w-10 h-10"
          resizeMode="contain"
        />
        <View className="w-full flex-1 justify-center space-y-1">
          {data.validationData?.adhyayanDetails[0] && (
            <CustomTag
              text={data.validationData?.adhyayanDetails[0]?.status}
              textStyles={
                data.validationData?.adhyayanDetails[0]?.status ==
                status.STATUS_AVAILABLE
                  ? 'text-green-200'
                  : 'text-red-200'
              }
              containerStyles={
                data.validationData?.adhyayanDetails[0]?.status ==
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
        <Image
          source={icons.description}
          className="w-4 h-4"
          resizeMode="contain"
        />
        <Text className="text-gray-400 font-pregular">Name:</Text>
        <Text className="text-black font-pmedium">{data.adhyayan.name}</Text>
      </View>
      <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.person} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Swadhyay Karta:</Text>
        <Text className="text-black font-pmedium">{data.adhyayan.speaker}</Text>
      </View>
    </PrimaryAddonBookingCard>
  );
};

export default AdhyayanBookingDetails;
