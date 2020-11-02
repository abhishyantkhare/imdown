import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import BlurModalStyles from './BlurModalStyles';

type BlurModalProps = {
  children: React.ReactNode;
  isCancelVisible?: boolean;
  onCancel?: () => void;
  visible: boolean;
};

const exitButton = require('../../assets/exit_button.png');

const BlurModal = (props: BlurModalProps) => {
  const {
    visible, isCancelVisible, onCancel, children,
  } = props;
  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View style={BlurModalStyles.modalBackgroundBlur}>
        <View style={BlurModalStyles.modalVisibleContainer}>
          {(isCancelVisible)
            ? (
              <TouchableOpacity onPress={onCancel} style={BlurModalStyles.exitButtonContainer}>
                <Image source={exitButton} style={BlurModalStyles.exitButton} />
              </TouchableOpacity>
            ) : null}
          <View style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

BlurModal.defaultProps = {
  isCancelVisible: false,
  onCancel: undefined,
};

export default BlurModal;
