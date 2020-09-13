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
  cancel?: () => void;
  visible: boolean;
};

const exitButton = require('../../assets/exit_button.png');

const BlurModal = (props: BlurModalProps) => {
  const { visible, cancel, children } = props;
  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View style={BlurModalStyles.modalBackgroundBlur}>
        <View style={BlurModalStyles.modalVisibleContainer}>
          {cancel
            ? (
              <TouchableOpacity onPress={cancel} style={BlurModalStyles.exitButtonContainer}>
                <Image source={exitButton} style={BlurModalStyles.exitButton} />
              </TouchableOpacity>
            ) : null}
          <View style={{
            marginHorizontal: 15,
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
  cancel: () => {},
};

export default BlurModal;
