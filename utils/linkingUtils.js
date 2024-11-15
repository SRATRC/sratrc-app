import { Linking, Alert } from 'react-native';

export const openApp = (url) => {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', "Can't handle url: " + url);
      }
    })
    .catch((err) => Alert.alert('Error', 'An error occurred: ' + err));
};
