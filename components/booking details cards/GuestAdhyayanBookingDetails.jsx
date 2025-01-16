import { View, Text, Image, ScrollView } from 'react-native';
import { icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../HorizontalSeparator';
import CustomTag from '../CustomTag';
import moment from 'moment';
import PrimaryAddonBookingCard from '../PrimaryAddonBookingCard';

const GuestAdhyayanBookingDetails = ({ containerStyles }) => {
  const { guestData } = useGlobalContext();

  const formattedStartDate = moment(
    guestData.adhyayan?.adhyayan?.start_date
  ).format('Do MMMM');
  const formattedEndDate = moment(
    guestData.adhyayan?.adhyayan?.end_date
  ).format('Do MMMM, YYYY');

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
          {guestData.validationData?.adhyayanDetails?.length > 0 && (
            <ScrollView horizontal>
              {guestData.validationData &&
                Object.keys(guestData.validationData).length > 0 &&
                guestData.validationData.adhyayanDetails[0]?.available !==
                  0 && (
                  <CustomTag
                    text={`available: ${guestData.validationData.adhyayanDetails[0].available}`}
                    textStyles={'text-green-200'}
                    containerStyles={'bg-green-100'}
                  />
                )}

              {guestData.validationData &&
                Object.keys(guestData.validationData).length > 0 &&
                guestData.validationData.adhyayanDetails[0]?.waiting !== 0 && (
                  <CustomTag
                    text={`waiting: ${guestData.validationData.adhyayanDetails[0].waiting}`}
                    textStyles={'text-red-200'}
                    containerStyles={'bg-red-100'}
                  />
                )}
            </ScrollView>
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
        <Text className="text-black font-pmedium">
          {guestData.adhyayan.adhyayan.name}
        </Text>
      </View>
      <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.person} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Swadhyay Karta:</Text>
        <Text className="text-black font-pmedium">
          {guestData.adhyayan.adhyayan.speaker}
        </Text>
      </View>
      <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.charge} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Charges:</Text>
        <Text className="text-black font-pmedium">
          ₹ {guestData.adhyayan.adhyayan.amount}/person
        </Text>
      </View>
      <View className="flex px-6 pb-4 flex-row space-x-2">
        <Image source={icons.person} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Booked For: </Text>
        <Text className="text-black font-pmedium">
          {guestData.adhyayan.guestGroup?.length ||
            guestData.adhyayan.guests?.length}{' '}
          Guests
        </Text>
      </View>
    </PrimaryAddonBookingCard>
  );
};

export default GuestAdhyayanBookingDetails;
