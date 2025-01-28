import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRouter } from 'expo-router';
import CustomButton from '../CustomButton';
import handleAPICall from '../../utils/HandleApiCall';
import ExpandableItem from '../ExpandableItem';
import HorizontalSeparator from '../HorizontalSeparator';
import moment from 'moment';
import CustomChipGroup from '../CustomChipGroup';
import GuestForm from '../GuestForm';
import FormField from '../FormField';
import CustomDropdown from '../CustomDropdown';
import Toast from 'react-native-toast-message';
import OtherMumukshuForm from '../OtherMumukshuForm';

const CHIPS = ['Self', 'Guest', 'Other Mumukshus'];
const ARRIVAL = [
  { key: 'car', value: 'Self Car' },
  { key: 'raj pravas', value: 'Raj Pravas' },
  { key: 'other', value: 'Other' }
];

var PACKAGES = [];

const INITIAL_SELF_FORM = {
  package: null,
  arrival: null,
  carno: null,
  other: null
};

const INITIAL_GUEST_FORM = {
  adhyayan: null,
  guests: [
    {
      name: '',
      gender: '',
      mobno: '',
      guestType: '',
      package: null,
      arrival: null,
      carno: null,
      other: null
    }
  ]
};

const INITIAL_MUMUKSHU_FORM = {
  startDay: '',
  endDay: '',
  mumukshus: [
    {
      mobno: '',
      package: null,
      arrival: null,
      carno: null,
      other: null
    }
  ]
};

const EventBooking = () => {
  const router = useRouter();
  const { user } = useGlobalContext();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setSelfForm(INITIAL_SELF_FORM);
    setGuestForm(INITIAL_GUEST_FORM);
  };

  const [selectedChip, setSelectedChip] = useState('Self');
  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };

  const [selfForm, setSelfForm] = useState(INITIAL_SELF_FORM);
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
          guestType: '',
          package: null,
          arrival: null,
          carno: null,
          other: null
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

  const removeGuestForm = (indexToRemove) => {
    setGuestForm((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, index) => index !== indexToRemove)
    }));
  };

  const isGuestFormValid = () => {
    return guestForm.guests.every((guest) => {
      if (guest.id) return guest.mobno && guest.mobno?.length == 10;
      else
        return (
          guest.name &&
          guest.gender &&
          guest.guestType &&
          guest.mobno &&
          guest.mobno?.length == 10
        );
    });
  };

  const [mumukshuForm, setMumukshuForm] = useState(INITIAL_MUMUKSHU_FORM);

  const addMumukshuForm = () => {
    setMumukshuForm((prev) => ({
      ...prev,
      mumukshus: [
        ...prev.mumukshus,
        {
          mobno: '',
          package: null,
          arrival: null,
          carno: null,
          other: null
        }
      ]
    }));
  };

  const removeMumukshuForm = (indexToRemove) => {
    setMumukshuForm((prev) => ({
      ...prev,
      mumukshus: prev.mumukshus.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleMumukshuFormChange = (index, key, value) => {
    setMumukshuForm((prev) => ({
      ...prev,
      mumukshus: prev.mumukshus.map((mumukshu, i) =>
        i === index ? { ...mumukshu, [key]: value } : mumukshu
      )
    }));
  };

  const isMumukshuFormValid = () => {
    if (!mumukshuForm.arrival == 'raj pravas' && !mumukshuForm.carno) {
      return false;
    }

    return mumukshuForm.mumukshus.every((mumukshu) => {
      return (
        mumukshu.mobno &&
        mumukshu.mobno?.length == 10 &&
        mumukshu.package &&
        mumukshu.arrival &&
        mumukshu.other
      );
    });
  };

  const fetchUtsavs = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/utsav/upcoming',
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
    queryKey: ['utsavs', user.cardno],
    queryFn: fetchUtsavs,
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
          <Text className="font-psemibold text-gray-400">Package Type:</Text>
          <Text className="font-pregular">{item.speaker}</Text>
        </View>
        <CustomButton
          text={
            item.status == status.STATUS_CLOSED ? 'Add to waitlist' : 'Register'
          }
          handlePress={() => {
            PACKAGES = item.UtsavPackagesDbs.map((item) => ({
              key: item.id,
              value: item.name
            }));

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
        <Text>No more bookings at the moment</Text>
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
                        {selectedChip == CHIPS[0] && (
                          <View>
                            <CustomDropdown
                              otherStyles="mt-7"
                              text={'Package'}
                              placeholder={'Select Package'}
                              data={PACKAGES}
                              value={selfForm.package}
                              setSelected={(val) => {
                                setSelfForm({ ...selfForm, package: val });
                              }}
                            />

                            <CustomDropdown
                              otherStyles="mt-7"
                              text={'How will you arrive?'}
                              placeholder={'How will you arrive?'}
                              data={ARRIVAL}
                              value={selfForm.arrival}
                              setSelected={(val) => {
                                setSelfForm({ ...selfForm, arrival: val });
                              }}
                            />

                            {selfForm.arrival == 'car' && (
                              <View>
                                <FormField
                                  text="Enter Car Number"
                                  value={selfForm.carno}
                                  handleChangeText={(e) =>
                                    setSelfForm({ ...selfForm, carno: e })
                                  }
                                  otherStyles="mt-7"
                                  inputStyles="font-pmedium text-base text-gray-400"
                                  containerStyles="bg-gray-100"
                                  placeholder="XX-XXX-XXXX"
                                  maxLength={10}
                                  autoComplete={'off'}
                                />
                              </View>
                            )}

                            <FormField
                              text="Any other details?"
                              value={selfForm.other}
                              handleChangeText={(e) =>
                                setSelfForm({ ...selfForm, other: e })
                              }
                              otherStyles="mt-7"
                              inputStyles="font-pmedium text-base text-gray-400"
                              containerStyles="bg-gray-100"
                              placeholder="Enter details here..."
                            />
                          </View>
                        )}
                        {selectedChip == CHIPS[2] && (
                          <OtherMumukshuForm
                            mumukshuForm={mumukshuForm}
                            setMumukshuForm={setMumukshuForm}
                            handleMumukshuFormChange={handleMumukshuFormChange}
                            addMumukshuForm={addMumukshuForm}
                            removeMumukshuForm={removeMumukshuForm}
                          >
                            {(index) => (
                              <View>
                                <CustomDropdown
                                  otherStyles="mt-7"
                                  text={'Package'}
                                  placeholder={'Select Package'}
                                  data={PACKAGES}
                                  value={mumukshuForm.mumukshus[index].package}
                                  setSelected={(val) => {
                                    handleMumukshuFormChange(
                                      index,
                                      'package',
                                      val
                                    );
                                  }}
                                />

                                <CustomDropdown
                                  otherStyles="mt-7"
                                  text={'How will you arrive?'}
                                  placeholder={'How will you arrive?'}
                                  data={ARRIVAL}
                                  value={mumukshuForm.mumukshus[index].arrival}
                                  setSelected={(val) => {
                                    handleMumukshuFormChange(
                                      index,
                                      'arrival',
                                      val
                                    );
                                  }}
                                />

                                {mumukshuForm.mumukshus[index].arrival ==
                                  'car' && (
                                  <FormField
                                    text="Enter Car Number"
                                    value={mumukshuForm.mumukshus[index].carno}
                                    handleChangeText={(e) =>
                                      handleMumukshuFormChange(
                                        index,
                                        'carno',
                                        e
                                      )
                                    }
                                    otherStyles="mt-7"
                                    inputStyles="font-pmedium text-base text-gray-400"
                                    containerStyles="bg-gray-100"
                                    placeholder="XX-XXX-XXXX"
                                    maxLength={10}
                                    autoComplete={false}
                                  />
                                )}

                                <FormField
                                  text="Any other details?"
                                  value={mumukshuForm.mumukshus[index].other}
                                  handleChangeText={(e) =>
                                    handleMumukshuFormChange(index, 'other', e)
                                  }
                                  otherStyles="mt-7"
                                  inputStyles="font-pmedium text-base text-gray-400"
                                  containerStyles="bg-gray-100"
                                  placeholder="Enter details here..."
                                />
                              </View>
                            )}
                          </OtherMumukshuForm>
                        )}
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
                          setGuestForm={setGuestForm}
                          handleGuestFormChange={handleGuestFormChange}
                          addGuestForm={addGuestForm}
                          removeGuestForm={removeGuestForm}
                        >
                          {(index) => (
                            <View>
                              <CustomDropdown
                                otherStyles="mt-7"
                                text={'Package'}
                                placeholder={'Select Package'}
                                data={PACKAGES}
                                value={guestForm.guests[index].package}
                                setSelected={(val) => {
                                  handleGuestFormChange(index, 'package', val);
                                }}
                              />

                              <CustomDropdown
                                otherStyles="mt-7"
                                text={'How will you arrive?'}
                                placeholder={'How will you arrive?'}
                                data={ARRIVAL}
                                value={guestForm.guests[index].arrival}
                                setSelected={(val) => {
                                  setSelfForm({ ...selfForm, arrival: val });
                                }}
                              />

                              {selfForm.arrival == 'car' && (
                                <View>
                                  <FormField
                                    text="Enter Car Number"
                                    value={guestForm.guests[index].carno}
                                    handleChangeText={(e) =>
                                      setSelfForm({ ...selfForm, carno: e })
                                    }
                                    otherStyles="mt-7"
                                    inputStyles="font-pmedium text-base text-gray-400"
                                    containerStyles="bg-gray-100"
                                    placeholder="XX-XXX-XXXX"
                                    maxLength={10}
                                    autoComplete={false}
                                  />
                                </View>
                              )}

                              <FormField
                                text="Any other details?"
                                value={guestForm.guests[index].other}
                                handleChangeText={(e) =>
                                  setSelfForm({ ...selfForm, other: e })
                                }
                                otherStyles="mt-7"
                                inputStyles="font-pmedium text-base text-gray-400"
                                containerStyles="bg-gray-100"
                                placeholder="Enter details here..."
                              />
                            </View>
                          )}
                        </GuestForm>
                      </View>
                    );
                  } else if (item.key === 'confirmButton') {
                    return (
                      <CustomButton
                        handlePress={async () => {
                          setIsSubmitting(true);
                          if (selectedChip == CHIPS[0]) {
                            handleAPICall(
                              'POST',
                              '/utsav/booking',
                              null,
                              {
                                cardno: user.cardno,
                                utsavid: selectedItem.id,
                                packageid: selfForm.package
                              },
                              (res) => {
                                if (res.status == 200) {
                                  setIsModalVisible(false);
                                  setIsSubmitting(false);
                                  queryClient.invalidateQueries([
                                    'utsavBooking',
                                    user.cardno
                                  ]);
                                  Toast.show({
                                    text1: 'Booking Successful!'
                                  });
                                }
                              },
                              () => {
                                setIsSubmitting(false);
                              }
                            );
                          }
                          if (selectedChip == CHIPS[1]) {
                            handleAPICall(
                              'POST',
                              '/utsav/guest',
                              null,
                              {
                                cardno: user.cardno,
                                utsavid: selectedItem.id,
                                guests: guestForm.guests.map((guest) => ({
                                  id: guest.id,
                                  name: guest.name,
                                  gender: guest.gender,
                                  mobno: guest.mobno,
                                  type: guest.guestType,
                                  packageid: guest.package,
                                  arrival: guest.arrival,
                                  carno: guest.carno,
                                  other: guest.other
                                }))
                              },
                              (res) => {
                                if (res.status == 200) {
                                  setIsModalVisible(false);
                                  setIsSubmitting(false);
                                  queryClient.invalidateQueries([
                                    'utsavBooking',
                                    user.cardno
                                  ]);
                                  Toast.show({
                                    text1: 'Booking Successful!'
                                  });
                                }
                              },
                              () => {
                                setIsSubmitting(false);
                              }
                            );
                          }
                          if (selectedChip == CHIPS[2]) {
                            handleAPICall(
                              'POST',
                              '/utsav/mumukshu',
                              null,
                              {
                                cardno: user.cardno,
                                utsavid: selectedItem.id,
                                mumukshus: mumukshuForm.mumukshus.map(
                                  (mumukshu) => ({
                                    mobno: mumukshu.mobno,
                                    packageid: mumukshu.package,
                                    arrival: mumukshu.arrival,
                                    carno: mumukshu.carno,
                                    other: mumukshu.other
                                  })
                                )
                              },
                              (res) => {
                                if (res.status == 200) {
                                  setIsModalVisible(false);
                                  setIsSubmitting(false);
                                  queryClient.invalidateQueries([
                                    'utsavBooking',
                                    user.cardno
                                  ]);
                                  Toast.show({
                                    text1: 'Booking Successful!'
                                  });
                                }
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
                        isLoading={isSubmitting}
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

export default EventBooking;
