# rn-camera-crop
camera with crop functionality
## Installation

```sh
npm install rn-camera-crop
```

or

```sh
yarn add rn-camera-crop
```

#### Note
This library depends upon expo. If you're using it on a bare react-native project, please setup expo first.

Afer successfully setting up the expo install the peer dependencies-
```sh
expo-cli install expo-camera expo-image-manipulator
```

## Usage

```tsx
import CameraModule from "rn-camera-crop";

// ...

const onSuccess = (uri: string) => {
    // do whatever you want
}

const onError = (error: Error) => {
    // do whatever you want
}

<CameraModule
    rectType='A4'
    enableCrop
    enablePreview
    onCaptureSuccess={onSuccess}
    onCaptureError={onError}/>
```

If you are getting this error ``Could not find com.google.android:cameraview:1.0.0`` while building your project.
Try to add this line-
``android/build.gradle`` at the bottom of allprojects -> repositories

``maven { url "$rootDir/../node_modules/expo-camera/android/maven" }``

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
