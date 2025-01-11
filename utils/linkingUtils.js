import { Linking, Alert } from 'react-native';

export const openApp = async (url) => {
  try {
    // Try to open in Instagram app first
    if (url.includes('instagram.com')) {
      const instagramUrl = url.replace('https://', 'instagram://');
      const canOpenInstagram = await Linking.canOpenURL(instagramUrl);

      if (canOpenInstagram) {
        await Linking.openURL(instagramUrl);
        return;
      }
    }

    // If can't open in app or not Instagram, try web URL
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', "Can't handle url: " + url);
    }
  } catch (err) {
    Alert.alert('Error', 'An error occurred: ' + err);
  }
};
