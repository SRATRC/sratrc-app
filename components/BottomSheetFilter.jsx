import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFlashList
} from '@gorhom/bottom-sheet';

const BottomSheetFilter = React.forwardRef((props, ref) => {
  const handleSelect = (selectedItem) => {
    props.onSelect(selectedItem);
  };

  return (
    <BottomSheetModal
      snapPoints={['40%']}
      // enableDynamicSizing={false}
      ref={ref}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...props}
        />
      )}
      index={0}
    >
      <BottomSheetFlashList
        data={props.data}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: 16,
          paddingBottom: 48
        }}
        keyExtractor={(item) => item.key || item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <Text className="py-2">{item.value || item}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <Text className="text-xl font-psemibold text-black mb-4">
            {props.title}
          </Text>
        }
        estimatedItemSize={43.3}
      />
    </BottomSheetModal>
  );
});

export default BottomSheetFilter;
