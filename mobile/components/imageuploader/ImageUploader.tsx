import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Label from '../label/Label';
import OptionalLabel from '../optionallabel/OptionalLabel';
import ImageUploaderStyles from './ImageUploaderStyles';
import { IMG_URL_BASE_64_PREFIX } from '../../constants';

type ImageUploaderProps = {
    style?: object;
    onSetImage: (imageUrl: string) => void; // eslint-disable-line no-unused-vars
};

const addPhoto = require('../../assets/add_photo.png');

const ImageUploader = (props: ImageUploaderProps) => {
  const { style } = props;
  const [imageUrl, setImageUrl] = useState('');
  const [uploaderText, setUploaderText] = useState('Upload an image');

  const imagePickerOptions = {
    title: 'Select photo',
    customButtons: imageUrl ? [{ name: 'remove', title: 'Remove photo' }] : [],
    maxWidth: 200,
    maxHeight: 200,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const showImagePicker = () => {
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        setImageUrl('');
        setUploaderText('Upload an image');
      } else {
        const imageUrlResponse = `${IMG_URL_BASE_64_PREFIX}${response.data}`;
        setImageUrl(imageUrlResponse);
        setUploaderText('Replace/Remove image');
        props.onSetImage(imageUrlResponse);
      }
    });
  };

  return (
    <View style={style}>
      {imageUrl
        ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ height: 300 }}
          />
        ) : null }
      <View style={[ImageUploaderStyles.imageUploadBox, style]}>
        <TouchableOpacity onPress={showImagePicker}>
          <View style={ImageUploaderStyles.uploadLabelRow}>
            <Image
              source={addPhoto}
            />
            <View style={{ marginLeft: '5%' }}>
              <Label
                labelText={uploaderText}
                size='small'
              />
              {!imageUrl
                ? (
                  <OptionalLabel style={{ marginTop: '5%' }} />
                ) : null }
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

ImageUploader.defaultProps = {
  style: {},
};

export default ImageUploader;
