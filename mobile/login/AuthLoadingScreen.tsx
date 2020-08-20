import React from "react"
import { Image } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import { AuthLoadingScreenStyles } from "./AuthLoadingScreenStyles"


const AuthLoadingScreen = () => {

    return (
        <LinearGradient colors={['#84D3FF', '#CFFFFF']} style={AuthLoadingScreenStyles.background}>
            <Image source={require('../assets/down_filled.png')} />
        </LinearGradient>
    )
}

export default AuthLoadingScreen