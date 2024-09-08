import { View, Text } from 'react-native';
import React from 'react';
import PageHeader from '../../components/PageHeader';
import { icons } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const wifi = () => {
  return (
    <SafeAreaView>
      <PageHeader title="Wifi" icon={icons.backArrow} />
    </SafeAreaView>
  );
};

export default wifi;
