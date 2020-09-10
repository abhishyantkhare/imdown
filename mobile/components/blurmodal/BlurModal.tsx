import React from "react"
import { Modal, View, TouchableOpacity, Image } from "react-native"
import BlurModalStyles from "./BlurModalStyles"

type BlurModalProps = {
    children: React.ReactNode,
    cancel?: () => void,
    visible: boolean
}

const BlurModal = (props: BlurModalProps) => {
    return (
        <Modal visible={props.visible} animationType="fade" transparent>
            <View style={BlurModalStyles.modalBackgroundBlur}>
                <View style={BlurModalStyles.modalVisibleContainer}>
                    {props.cancel ?
                        <TouchableOpacity onPress={props.cancel} style={BlurModalStyles.exitButtonContainer} >
                            <Image source={require('../../assets/exit_button.png')} style={BlurModalStyles.exitButton} />
                        </TouchableOpacity>
                        :
                        null
                    }
                    <View style={{
                        marginHorizontal: 15,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {props.children}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default BlurModal