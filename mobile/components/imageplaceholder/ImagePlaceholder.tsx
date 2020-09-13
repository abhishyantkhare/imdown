import React, { useState } from "react"
import ImageUploaderStyles from "./ImagePlaceholderStyles";
import { LinearGradient } from 'expo-linear-gradient';

type ImagePlaceholderProps = {
  style: object
}

const ImagePlaceholder = (props: ImagePlaceholderProps) => {
  return(
    <LinearGradient
      start={{x: 0.0, y: 0.25}} end={{x: 0.95, y: 1.0}}
      colors={['#84D3FF', '#CFFFFF']}
      style={props.style}
    /> 
  );
}

export default ImagePlaceholder