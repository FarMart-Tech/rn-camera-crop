import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import CameraModule from 'rn-camera-crop';

export default function App() {
  const onSuccess = (uri: string) => {
    console.log(uri);
  };

  const onError = (error: Error) => {
    console.error(error.message);
  };

  return (
    <View style={styles.container}>
      <CameraModule
        enablePreview
        rectType='A4'
        enableCrop
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
