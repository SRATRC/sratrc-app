import { BASE_URL } from '../constants';
import axios from 'axios';
import Toast from 'react-native-toast-message';

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
      timeout: 10000,
      validateStatus: () => true
    });

    if (res.status === 200 || res.status === 201) {
      successCallback(res.data);
    } else {
      console.log('ERROR: ', JSON.stringify(res.data));

      Toast.show({
        type: 'error',
        text1: 'An error occurred!',
        text2: res.data.message
      });
    }
  } catch (error) {
    if (error.response) {
      Toast.show({
        type: 'error',
        text1: 'An error occurred',
        text2: error.message
      });
    }
  } finally {
    if (finallyCallback) finallyCallback();
  }
};

export default handleAPICall;
