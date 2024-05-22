import axios from 'axios';
import { Alert } from 'react-native';
import { BASE_URL } from '../constants';

const handleAPICall = async (
  method,
  endpoint,
  params,
  body,
  successCallback,
  finallyCallback
) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const res = await axios({
      method: method,
      url: url,
      params: params,
      data: body,
      validateStatus: () => true
    });
    if (res.status === 200 || res.status === 201) {
      successCallback(res.data);
    } else {
      Alert.alert('Success Error', res.data.message);
    }
  } catch (error) {
    if (error.response) {
      Alert.alert('Failure Error', error.message);
    }
    console.log(error);
  } finally {
    if (finallyCallback) finallyCallback();
  }
};

export default handleAPICall;
