import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useState } from 'react';
import { icons } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '../../components/PageHeader';
import FormField from '../../components/FormField';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import handleAPICall from '../../utils/HandleApiCall';

const DEPARTMENT_LIST = [
  { key: 'Electrical', value: 'Electrical' },
  { key: 'housekeeping', value: 'House Keeping' },
  { key: 'Maintenance', value: 'Maintenance' }
];

const maintenanceRequest = () => {
  const { user } = useGlobalContext();

  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    department: '',
    work_detail: '',
    area_of_work: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <SafeAreaView className="bg-white h-full flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <PageHeader title="Maintenance Request" icon={icons.backArrow} />

          <View className="mt-6 px-4 flex-1">
            <Text className="text-base font-pregular text-gray-500">
              Dear {user.issuedto}, please register your maintenance request
            </Text>

            <CustomDropdown
              otherStyles="mt-7"
              text={'Department'}
              save={'key'}
              placeholder={'Select Department'}
              data={DEPARTMENT_LIST}
              setSelected={(val) => setForm({ ...form, department: val })}
            />

            <FormField
              text="Detail of Work"
              value={form.work_detail}
              handleChangeText={(e) => setForm({ ...form, work_detail: e })}
              multiline={true}
              minHeight={120}
              maxHeight={250}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              containerStyles={'bg-gray-100'}
              placeholder="Work Description"
            />

            <FormField
              text="Place where work is needed"
              value={form.area_of_work}
              handleChangeText={(e) => setForm({ ...form, area_of_work: e })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              containerStyles={'bg-gray-100'}
              placeholder="Place where work is needed"
            />

            <CustomButton
              text="Submit"
              handlePress={async () => {
                setIsSubmitting(true);
                if (
                  form.department.trim() == '' ||
                  form.work_detail.trim() == '' ||
                  form.area_of_work.trim() == ''
                ) {
                  Alert.alert('Please fill all fields');
                  return;
                }

                const onSuccess = async (_data) => {
                  await queryClient.invalidateQueries(['maintenance']);
                  router.back();
                };
                const onFinally = () => {
                  setIsSubmitting(false);
                };

                await handleAPICall(
                  'POST',
                  '/maintenance/request',
                  null,
                  {
                    cardno: user.cardno,
                    department: form.department,
                    work_detail: form.work_detail,
                    area_of_work: form.area_of_work
                  },
                  onSuccess,
                  onFinally
                );
              }}
              containerStyles="min-h-[62px] mt-7"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default maintenanceRequest;
