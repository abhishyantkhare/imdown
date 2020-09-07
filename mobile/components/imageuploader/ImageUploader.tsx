import React, { useState } from "react"
import { View, Image, TouchableOpacity } from "react-native"
import SmallLabel from "../smalllabel/SmallLabel"
import OptionalLabel from "../optionallabel/OptionalLabel"
import ImageUploaderStyles from "./ImageUploaderStyles"
import ImagePicker from 'react-native-image-picker';
import { IMG_URL_BASE_64_PREFIX } from "../../constants"
import AuthLoadingScreen from "../../login/AuthLoadingScreen"


type ImageUploaderProps = {
    style?: object,
    onSetImage: (imageUrl: string) => void
}

const ImageUploader = (props: ImageUploaderProps) => {

    const [imageUrl, setImageUrl] = useState("");
    const [uploaderText, setUploaderText] = useState("Upload an image")

    const image_picker_options = {
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
        ImagePicker.showImagePicker(image_picker_options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                setImageUrl("")
                setUploaderText("Upload an image")
            } else {
                const imageUrl = IMG_URL_BASE_64_PREFIX + response.data
                setImageUrl(imageUrl);
                setUploaderText("Replace/Remove image");
                props.onSetImage(imageUrl)
            }
        });
    }
    return (
        <View style={props.style}>
            {imageUrl ?
                <Image source={{ uri: imageUrl }}
                    style={{ height: 300 }}
                />
                :
                null
            }
            <View style={[ImageUploaderStyles.imageUploadBox, props.style]}>
                <TouchableOpacity onPress={showImagePicker}>
                    <View style={ImageUploaderStyles.uploadLabelRow}>
                        <Image
                            source={require("../../assets/add_photo.png")}
                        />
                        <View style={{ marginLeft: "5%" }}>
                            <SmallLabel
                                labelText={uploaderText}
                            />
                            {!imageUrl ?
                                <OptionalLabel style={{ marginTop: "5%" }} />
                                :
                                null
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ImageUploader