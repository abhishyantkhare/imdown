import React, { MutableRefObject } from 'react';
import {
  View,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import ButtonBottomSheetStyles from './ButtonBottomSheetStyles';

type BottomSheetProps = {
    children: React.ReactNode,
    sheetRef: MutableRefObject,
    snapPoints: Array<number>,
    hideBottomSheet: () => void
}

const ButtonBottomSheet = (props: BottomSheetProps) => {
  const { sheetRef, snapPoints } = props;
  const renderHeader = () => (
    <View style={ButtonBottomSheetStyles.headerTop}>
      <View style={ButtonBottomSheetStyles.header}>
        <View
          style={ButtonBottomSheetStyles.headerBar}
        />
      </View>
    </View>
  );

  const renderContent = () => (
    <View style={ButtonBottomSheetStyles.body}>
      {props.children}
    </View>
  );

  return (
    <BottomSheet
      enabledContentTapInteraction={false}
      initialSnap={0}
      ref={sheetRef}
      snapPoints={snapPoints}
      onCloseEnd={() => props.hideBottomSheet()}
      renderHeader={renderHeader}
      renderContent={renderContent}
    />
  );
};

export default ButtonBottomSheet;
