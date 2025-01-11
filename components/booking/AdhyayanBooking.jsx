import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { icons, status, types } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRouter } from 'expo-router';
import CustomButton from '../CustomButton';
import handleAPICall from '../../utils/HandleApiCall';
import ExpandableItem from '../ExpandableItem';
import HorizontalSeparator from '../HorizontalSeparator';
import moment from 'moment';
import CustomChipGroup from '../CustomChipGroup';
import GuestForm from '../GuestForm';

const CHIPS = ['Self', 'Guest'];

const INITIAL_GUEST_FORM = {
  adhyayan: null,
  guests: [
    {
      name: '',
      gender: '',
      mobno: '',
      type: ''
    }
  ]
};

const AdhyayanBooking = () => {
  const router = useRouter();
  const { user, updateBooking, updateGuestBooking } = useGlobalContext();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const [selectedChip, setSelectedChip] = useState('Self');
  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };

  const [guestForm, setGuestForm] = useState(INITIAL_GUEST_FORM);

  const addGuestForm = () => {
    setGuestForm((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        {
          name: '',
          gender: '',
          mobno: '',
          type: ''
        }
      ]
    }));
  };

  const handleGuestFormChange = (index, field, value) => {
    const updatedForms = guestForm.guests.map((guest, i) =>
      i === index ? { ...guest, [field]: value } : guest
    );
    setGuestForm((prev) => ({ ...prev, guests: updatedForms }));
  };

  const handleSuggestionSelect = (index, suggestion) => {
    const updatedForms = guestForm.guests.map((guest, i) =>
      i === index
        ? { ...guest, ...suggestion, mobno: suggestion.mobno.toString() }
        : guest
    );
    setGuestForm((prev) => ({ ...prev, guests: updatedForms }));
  };

  const removeGuestForm = (indexToRemove) => {
    setGuestForm((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, index) => index !== indexToRemove)
    }));
  };

  const isGuestFormValid = () => {
    return guestForm.guests.every((guest) => {
      const commonFields = guest.name && guest.gender && guest.type;
      if (guest.type === 'vip' || guest.type === 'driver') {
        return commonFields;
      } else {
        return commonFields && guest.mobno;
      }
    });
  };

  const fetchAdhyayans = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/adhyayan/getall',
        {
          cardno: user.cardno,
          page: pageParam
        },
        null,
        (res) => {
          resolve(Array.isArray(res.data) ? res.data : []);
        },
        () => reject(new Error('Failed to fetch adhyayans'))
      );
    });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: queryStatus,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ['adhyayans', user.cardno],
    queryFn: fetchAdhyayans,
    staleTime: 1000 * 60 * 30,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return pages.length + 1;
    }
  });

  const renderItem = ({ item }) => (
    <ExpandableItem
      containerStyles={'mt-3'}
      visibleContent={
        <View className="flex basis-11/12">
          <Text className="text-secondary font-psemibold">
            {moment(item.start_date).format('Do MMMM')} -{' '}
            {moment(item.end_date).format('Do MMMM, YYYY')}
          </Text>
          <Text className="font-pmedium text-gray-700">{item.name}</Text>
        </View>
      }
    >
      <HorizontalSeparator />
      <View className="mt-3">
        <View className="flex-row space-x-2">
          <Text className="font-psemibold text-gray-400">Swadhyay Karta:</Text>
          <Text className="font-pregular">{item.speaker}</Text>
        </View>
        <View className="flex-row space-x-2">
          <Text className="font-psemibold text-gray-400">Charges:</Text>
          <Text className="font-pregular">{item.amount}</Text>
        </View>
        <CustomButton
          text={
            item.status == status.STATUS_CLOSED ? 'Add to waitlist' : 'Register'
          }
          handlePress={() => {
            setSelectedItem(item);
            setGuestForm((prev) => ({
              ...prev,
              adhyayan: item
            }));
            toggleModal();
          }}
          containerStyles="mt-3 min-h-[40px]"
          isLoading={isSubmitting}
        />
      </View>
    </ExpandableItem>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text className="font-psemibold text-lg mb-2 mx-1">{title}</Text>
  );

  const renderFooter = () => (
    <View className="items-center">
      {(isFetchingNextPage || isLoading) && <ActivityIndicator />}
      {!hasNextPage && data?.pages?.[0]?.length > 0 && (
        <Text>No more adhyayans at the moment</Text>
      )}
    </View>
  );

  if (isError)
    return (
      <Text className="text-red-500 text-lg font-pregular items-center justify-center">
        An error occurred
      </Text>
    );

  return (
    <View className="w-full">
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-lg p-5 w-[80%] max-w-[300px] max-h-[80%]">
              <View className="flex-row justify-between mb-2">
                <View className="flex-col space-y-1">
                  <Text className="text-black font-pmedium text-sm">
                    {selectedItem?.name}
                  </Text>
                  <View className="flex-row space-x-1">
                    <Text className="text-gray-500 font-pregular text-xs">
                      Date:
                    </Text>
                    <Text className="text-secondary font-pregular text-xs">
                      {moment(selectedItem?.start_date).format('Do MMMM')} -{' '}
                      {moment(selectedItem?.end_date).format('Do MMMM')}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={toggleModal}>
                  <Image
                    source={icons.remove}
                    tintColor={'black'}
                    className="w-4 h-4"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <HorizontalSeparator otherStyles={'w-full'} />

              <FlatList
                data={[
                  { key: 'bookFor' },
                  { key: 'guestForm' },
                  { key: 'confirmButton' }
                ]}
                renderItem={({ item }) => {
                  if (item.key === 'bookFor') {
                    return (
                      <View className="flex-col mt-2">
                        <Text className="font-pregular text-base text-black">
                          Book For
                        </Text>
                        <CustomChipGroup
                          chips={CHIPS}
                          selectedChip={selectedChip}
                          handleChipPress={handleChipClick}
                          containerStyles={'mt-1'}
                          chipContainerStyles={'py-1'}
                          textStyles={'text-sm'}
                        />
                      </View>
                    );
                  } else if (
                    item.key === 'guestForm' &&
                    selectedChip == CHIPS[1]
                  ) {
                    return (
                      <View>
                        <GuestForm
                          guestForm={guestForm}
                          handleGuestFormChange={handleGuestFormChange}
                          addGuestForm={addGuestForm}
                          removeGuestForm={removeGuestForm}
                          handleSuggestionSelect={handleSuggestionSelect}
                        />
                      </View>
                    );
                  } else if (item.key === 'confirmButton') {
                    return (
                      <CustomButton
                        handlePress={async () => {
                          if (selectedChip == CHIPS[0]) {
                            await updateBooking('adhyayan', selectedItem);
                            router.push(
                              `/booking/${types.ADHYAYAN_DETAILS_TYPE}`
                            );
                          }
                          if (selectedChip == CHIPS[1]) {
                            if (!isGuestFormValid()) {
                              Alert.alert('Fill all Fields');
                              return;
                            }
                            await handleAPICall(
                              'POST',
                              '/guest',
                              null,
                              {
                                cardno: user.cardno,
                                guests: guestForm.guests
                              },
                              async (res) => {
                                guestForm.guests = res.guests;
                                await updateGuestBooking('adhyayan', guestForm);
                                setGuestForm(INITIAL_GUEST_FORM);
                                router.push(
                                  `/guestBooking/${types.ADHYAYAN_DETAILS_TYPE}`
                                );
                              },
                              () => {
                                setIsSubmitting(false);
                              }
                            );
                          }
                          setSelectedItem(null);
                          setSelectedChip('Self');
                          toggleModal();
                        }}
                        text={'Confirm'}
                        bgcolor="bg-secondary"
                        containerStyles="mt-4 p-2"
                        textStyles={'text-sm'}
                      />
                    );
                  }
                }}
                keyExtractor={(item) => item.key}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <SectionList
        className="px-2 py-2 flex-grow-1"
        sections={data?.pages?.flatMap((page) => page) || []}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        nestedScrollEnabled={true}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={renderSectionHeader}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
      />
      {!isFetchingNextPage && data?.pages?.[0]?.length == 0 && (
        <View className="flex-1 items-center justify-center">
          <LottieView
            style={{
              width: 200,
              height: 350,
              alignSelf: 'center'
            }}
            autoPlay
            loop
            source={require('../../assets/lottie/empty.json')}
          />
          <Text className="text-lg font-pregular text-secondary">
            There are no upcoming adhyayans at the moment
          </Text>
        </View>
      )}
    </View>
  );
};

export default AdhyayanBooking;
