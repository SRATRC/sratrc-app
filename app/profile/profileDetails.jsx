import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '../../components/PageHeader';
import { icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import FormField from '../../components/FormField';
import FormDisplayField from '../../components/FormDisplayField';
import CustomButton from '../../components/CustomButton';
import CustomDropdown from '../../components/CustomDropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { colors } from '../../constants';

const profileDetails = () => {
  const { user } = useGlobalContext();

  const initialFormState = {
    issuedto: user.issuedto,
    gender: user.gender,
    dob: user.dob,
    address: user.address,
    mobno: user.mobno,
    email: user.email,
    country: user.country,
    state: user.state,
    city: user.city,
    pin: user.pin,
    centre: user.centre
  };

  //TODO: add dob similar to date fields, add country in db, give dropdowns for country-state-cities, give multilive view for address, dropdown for centre and gender
  const [form, setForm] = useState(initialFormState);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const genderlist = [
    { key: 'M', value: 'Male' },
    { key: 'F', value: 'Female' }
  ];

  const isFormModified = () => {
    return JSON.stringify(form) !== JSON.stringify(initialFormState);
  };

  const submit = async () => {
    // if (!form.phone || form.phone.length < 10) {
    //   Alert.alert('Error', 'Please fill the fields corectly');
    //   return;
    // }
    // setIsSubmitting(true);
    // const onSuccess = (data) => {};
    // const onFinally = () => {
    //   setIsSubmitting(false);
    // };
    // await handleAPICall(
    //   'PUT',
    //   '/client/profile',
    //   { mobno: form.phone },
    //   null,
    //   onSuccess,
    //   onFinally
    // );
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView alwaysBounceVertical={false}>
          <PageHeader title={'Profile Details'} icon={icons.backArrow} />
          <View className="w-full min-h-[83vh] px-4">
            <FormField
              text="Name"
              value={form.issuedto}
              handleChangeText={(e) => setForm({ ...form, issuedto: e })}
              otherStyles="mt-2"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="default"
              placeholder="Enter Your Name"
              containerStyles={'bg-gray-100'}
            />

            <FormField
              text="Phone Number"
              prefix="+91"
              value={form.mobno.toString()}
              handleChangeText={(e) => setForm({ ...form, mobno: Number(e) })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="number-pad"
              placeholder="Enter Your Phone Number"
              maxLength={10}
              containerStyles={'bg-gray-100'}
            />

            <FormField
              text="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e.trim() })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="email"
              placeholder="Enter Your Email ID"
              maxLength={100}
              containerStyles={'bg-gray-100'}
            />

            <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
              <FormDisplayField
                text="Date of Birth"
                value={form.dob ? form.dob : 'Date of Birth'}
                otherStyles="mt-7"
                backgroundColor={'bg-gray-100'}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={form.dob ? moment(form.dob).toDate() : moment().toDate()}
              onConfirm={(date) => {
                setForm({
                  ...form,
                  dob: moment(date).format('YYYY-MM-DD')
                });
                setDatePickerVisibility(false);
              }}
              onCancel={() => setDatePickerVisibility(false)}
              maximumDate={moment().toDate()}
            />

            <CustomDropdown
              otherStyles="mt-7"
              text={'Gender'}
              placeholder={'Select Gender'}
              data={genderlist}
              setSelected={(val) => setForm({ ...form, gender: val })}
              defaultOption={
                form.gender == 'M'
                  ? { key: 'M', value: 'Male' }
                  : { key: 'F', value: 'Female' }
              }
            />

            <FormField
              text="Centre"
              value={form.centre}
              handleChangeText={(e) => setForm({ ...form, centre: e.trim() })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="default"
              placeholder="Enter Your Centre"
              maxLength={100}
              containerStyles={'bg-gray-100'}
            />

            <FormField
              text="Address"
              value={form.address}
              handleChangeText={(e) => setForm({ ...form, address: e })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="default"
              placeholder="Enter Your Address"
              maxLength={200}
              containerStyles={'bg-gray-100'}
            />

            <FormField
              text="City"
              value={form.city}
              handleChangeText={(e) => setForm({ ...form, city: e })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="default"
              placeholder="Enter Your City"
              autoCapitalize={'characters'}
              maxLength={100}
              containerStyles={'bg-gray-100'}
            />

            <FormField
              text="State"
              value={form.state}
              handleChangeText={(e) => setForm({ ...form, state: e })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="default"
              placeholder="Enter Your State"
              autoCapitalize={'characters'}
              maxLength={100}
              containerStyles={'bg-gray-100'}
            />

            <FormField
              text="Pin Code"
              value={form.pin.toString()}
              handleChangeText={(e) => setForm({ ...form, pin: Number(e) })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="number-pad"
              placeholder="Enter Your pin Code"
              maxLength={6}
              containerStyles={'bg-gray-100'}
            />

            <CustomButton
              text="Update Profile"
              handlePress={submit}
              containerStyles="mt-7 min-h-[62px]"
              isLoading={!isFormModified()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default profileDetails;
