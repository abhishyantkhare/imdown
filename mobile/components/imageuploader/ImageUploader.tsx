import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import BlurModal from '../blurmodal/BlurModal';
import StandardButton from '../button/Button';
import ImageUploaderStyles from './ImageUploaderStyles';
import { IMG_URL_BASE_64_PREFIX } from '../../constants';

type ImageUploaderProps = {
  children: React.ReactNode;
  image: string;
  imageHeight: number;
  imageWidth: number;
  touchableStyle: object;
  onImagePicked: (image: string) => void; // eslint-disable-line no-unused-vars
}

const ImageUploader = (props: ImageUploaderProps) => {
  const { children, image, touchableStyle } = props;
  const [currentImage, setCurrentImage] = useState(image);
  const [uploadImageModal, setUploadImageModal] = useState(false);

  const deleteImage = () => {
    setCurrentImage('');
    props.onImagePicked('');
    setUploadImageModal(false);
  };

  const pickImageFromCamera = () => {
    ImagePicker.openCamera({
      width: props.imageWidth,
      height: props.imageHeight,
      cropping: true,
      includeBase64: true,
    }).then((chosenImage) => {
      const imageEncoded = IMG_URL_BASE_64_PREFIX + chosenImage.data;
      props.onImagePicked(imageEncoded);
      setCurrentImage(imageEncoded);
      setUploadImageModal(false);
    });
  };

  const pickImageFromGallery = () => {
    ImagePicker.openPicker({
      width: props.imageWidth,
      height: props.imageHeight,
      cropping: true,
      includeBase64: true,
    }).then((chosenImage) => {
      const imageEncoded = IMG_URL_BASE_64_PREFIX + chosenImage.data;
      props.onImagePicked(imageEncoded);
      setCurrentImage(imageEncoded);
      setUploadImageModal(false);
    });
  };

  const onImageUploaderToggled = () => {
    setUploadImageModal(!uploadImageModal);
  };

  return (
    <View>
      <TouchableOpacity style={touchableStyle} onPress={() => onImageUploaderToggled()}>
        {children}
      </TouchableOpacity>
      <BlurModal
        visible={uploadImageModal}
        isCancelVisible
        onCancel={() => setUploadImageModal(false)}
      >
        <View style={{ width: '100%' }}>
          <StandardButton text='Take photo from camera' overrideStyle={ImageUploaderStyles.photoFromCameraButton} onPress={() => pickImageFromCamera()} />
          <StandardButton text='Choose photo from gallery' overrideStyle={ImageUploaderStyles.chooseFromGalleryButton} onPress={() => pickImageFromGallery()} />
          {currentImage ? <StandardButton text='Remove image' overrideStyle={ImageUploaderStyles.deleteImageButton} onPress={() => deleteImage()} /> : <View /> }
        </View>

      </BlurModal>
    </View>
  );
};

ImageUploader.defaultProps = {
};

export default ImageUploader;
