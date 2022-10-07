# rn-camera-crop
camera with crop functionality
## Installation

```sh
npm install rn-camera-crop
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

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
