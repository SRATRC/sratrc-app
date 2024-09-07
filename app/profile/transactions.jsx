import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '../../components/PageHeader';
import handleAPICall from '../../utils/HandleApiCall';
import { icons, types } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import SearchInput from '../../components/SearchInput';
import CustomChipGroup from '../../components/CustomChipGroup';
import moment from 'moment';
import mergeLists from '../../utils/mergeLists';

const CHIPS = [
  types.transaction_type_all,
  types.transaction_type_pending,
  types.transaction_type_completed,
  types.transaction_type_cancelled,
  types.transaction_type_admin_cancelled
];

const TransactionCategories = () => {
  const [selectedChip, setSelectedChip] = useState(types.transaction_type_all);
  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };
  return (
    <CustomChipGroup
      chips={CHIPS}
      selectedChip={selectedChip}
      handleChipPress={(chip) => setSelectedChip(chip)}
    />
  );
};

const transactions = () => {
  const { user } = useGlobalContext();

  const [transactionList, setTransactionList] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [listEnded, setListEnded] = useState(false);

  useEffect(() => {
    if (!listEnded) requestAPI();
  }, [page]);

  const requestAPI = async () => {};

  const renderItem = ({ item }) => <TransactionItem item={item} />;

  const renderSectionHeader = ({ section: { title } }) => (
    <Text className="font-psemibold text-lg mb-2 mx-1">{title}</Text>
  );

  const renderFooter = () => (
    <View className="items-center">
      {isFetching && <ActivityIndicator />}
      {listEnded && <Text>No more transactions at the moment</Text>}
    </View>
  );

  const renderHeader = () => (
    <View className="flex-col">
      <PageHeader title={'Transaction History'} icon={icons.backArrow} />
      <View className="mx-4">
        <SearchInput placeholder={'Search by type or date'} />
        <TransactionCategories />
      </View>
    </View>
  );

  const fetchMoreData = () => {
    if (!listEnded && !isFetching) {
      setPage(page + 1);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SectionList
          className="py-2 flex-grow-1"
          sections={transactionList}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          nestedScrollEnabled={true}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={renderSectionHeader}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.1}
          onEndReached={fetchMoreData}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const TransactionItem = ({ item }) => {
  return <View></View>;
};

export default transactions;
