import React from 'react';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import AuthLoadingScreenStyles from './AuthLoadingScreenStyles';

const downFilled = require('../assets/down_filled.png');

const AuthLoadingScreen = () => (
  <LinearGradient colors={['#84D3FF', '#CFFFFF']} style={AuthLoadingScreenStyles.background}>
    <Image source={downFilled} />
  </LinearGradient>
);

export default AuthLoadingScreen;
