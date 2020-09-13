import React, { useState } from "react"
import { View, TouchableOpacity } from "react-native"
import { IMG_URL_BASE_64_PREFIX } from "../../constants"
import { StandardButton } from "../button/Button";
import ImagePicker from 'react-native-image-crop-picker';
import BlurModal from "../blurmodal/BlurModal"
import ImageUploaderStyles from "./ImageUploaderStyles";

type ImageUploaderProps = {
    children: React.ReactNode
    image: string
    imageHeight: number
    imageWidth: number,
    touchableStyle: object,
    onImagePicked: (image: string) => void
}

const ImageUploader = (props: ImageUploaderProps) => {
    const [uploadImageModal, setUploadImageModal] = useState(false)
    const [image, setImage] = useState(props.image)

    const onImageUploaderToggled = () => {
        setUploadImageModal(!uploadImageModal)
    }

    const pickImageFromGallery = () => {
        ImagePicker.openPicker({ 
            width: props.imageWidth,
            height: props.imageHeight,
            cropping: true,
            includeBase64: true
        }).then(image => {
            const imageEncoded = IMG_URL_BASE_64_PREFIX + image.data
            props.onImagePicked(imageEncoded);
            setImage(imageEncoded);
            setUploadImageModal(false)
        });
      }
    
    const pickImageFromCamera = () => {
        ImagePicker.openCamera({
            width: props.imageWidth,
            height: props.imageHeight,
            cropping: true,
            includeBase64: true
        }).then(image => {
            const imageEncoded = IMG_URL_BASE_64_PREFIX + image.data
            props.onImagePicked(imageEncoded);
            setImage(imageEncoded);
            setUploadImageModal(false)
        });
    }

    const deleteImage = () => {
        setImage("");
        props.onImagePicked("");
        setUploadImageModal(false);
    }
    return (
        <View>
            <TouchableOpacity style={props.touchableStyle} onPress={()=> onImageUploaderToggled()}>
                {props.children}
            </TouchableOpacity>
            <BlurModal visible={uploadImageModal} cancel={() => setUploadImageModal(false)}>
                <StandardButton text="Take photo from camera" onPress={() => pickImageFromCamera()} />
                <StandardButton text="Choose photo from gallery" override_style={ImageUploaderStyles.chooseFromGalleryButton} onPress={() => pickImageFromGallery()} />
                {image ? <StandardButton text="Remove image" override_style={ImageUploaderStyles.deleteImageButton} onPress={() => deleteImage()} /> : <View></View> }
            </BlurModal>
        </View>
    );
}

export default ImageUploader