import type { ImageResult } from 'expo-image-manipulator';
import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import CameraModule from 'rn-camera-crop';

export default function App() {
  const onSuccess = (imageResult: ImageResult) => {
    console.log(imageResult);
  };

  const onError = (error: Error) => {
    console.error(error.message);
  };

  return (
    <View style={styles.container}>
      <CameraModule
        enablePreview
        rectType='A4'
        enableCrop={false}
        onCaptureSuccess={onSuccess}
        onCaptureError={onError}
        imageQuality={0.6}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
});
