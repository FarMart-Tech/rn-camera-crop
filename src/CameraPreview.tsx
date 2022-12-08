import React from "react";
import {
    StyleSheet, View, LayoutChangeEvent,
    LayoutRectangle, TouchableNativeFeedback, Text, StyleProp, ViewStyle
} from "react-native";
import { Camera, CameraType, FlashMode, CameraCapturedPicture } from 'expo-camera'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const DEFAULT_QUALITY_CROP = 0.95;
const DEFAULT_QUALITY_NORMAL = 0.6;

export interface ICameraPreviewProps {
    /**
     * Default: ``back``
     */
    cameraType?: "front" | "back",
    /**
     * Default: ``off``
     */
    flashMode?: "on" | "off" | "auto" | "torch",
    /**
     * If given A4 or A5 only then rect is enabled.
     * Default to ``undefined`` (not enabled).
     */
    rectType?: "A4" | "A5",
    /**
     * This will override the ``rectType`` prop if given.
     */
    customRect?: { width: number, height: number },
    rectStyle?: { borderColor?: string, borderWidth?: number },
    /**
     * Doesn't work if ``rectType`` or ``customRect`` is not defined.
     * Default: ``false``
     */
    enableCrop?: boolean,
    /**
     * Default: ``true``
     */
    enablePreview?: boolean,
    /**
     * Default: ``0.6``
     * when rect is enabled: ``0.95``
     */
    imageQuality?: number,
    onClosePress?: () => void,
    /**
     * Called after photo captured (and cropped) successfully.
     * In case if preview is enabled this method will be called after preview is accepted.
     */
    onCaptureSuccess: (uri: string) => void,
    onCaptureError: (error: Error) => void,
}

export type CameraPermissionState = {
    granted: boolean,
    error: string | null
}

const CameraPreview = (props: ICameraPreviewProps) => {
    const _cameraRef = React.useRef<Camera>(null);
    const [rectLayout, setRectLayout] = React.useState<LayoutRectangle>();

    const shouldCrop = ((props.rectType || props.customRect) && props.enableCrop);

    const rectStyle = React.useMemo((): StyleProp<ViewStyle> | undefined => {
        if (rectLayout) {
            let borderWidth = 5;
            let borderColor = "#4DD637";
            if (props.rectStyle && props.rectStyle.borderWidth)
                borderWidth = props.rectStyle.borderWidth;
            if (props.rectStyle && props.rectStyle.borderColor)
                borderColor = props.rectStyle.borderColor;
            return {
                position: 'absolute',
                left: rectLayout.x,
                top: rectLayout.y,
                width: rectLayout.width,
                height: rectLayout.height,
                borderRadius: 5,
                borderWidth,
                borderColor
            };
        }
        return undefined;
    }, [rectLayout, props.rectStyle]);

    const onLayoutChange = (event: LayoutChangeEvent) => {
        // default to A4 for now.
        if (props.rectType) {
            const { width, height } = event.nativeEvent.layout;
            const recWidth = 0.8 * width;
            const recHeight = 1.4142 * recWidth;
            const recX = (width - recWidth) / 2;
            const recY = (height - recHeight) / 2;
            if (!rectLayout || rectLayout.height !== recHeight || rectLayout.width !== recWidth
                || rectLayout.x !== recX || rectLayout.y !== recY) {
                setRectLayout({
                    width: recWidth,
                    height: recHeight,
                    x: recX,
                    y: recY
                });
            }
        }
    }

    const onCapturePress = () => {
        if (_cameraRef.current) {
            _cameraRef.current.takePictureAsync({ base64: false })
                .then(photo => {
                    if (shouldCrop)
                        cropPhoto(photo);
                    else {
                        manipulateAsync(photo.uri, [], {
                            compress: props.imageQuality ?? DEFAULT_QUALITY_NORMAL,
                            format: SaveFormat.JPEG, base64: false
                        }).then(result => {
                            props.onCaptureSuccess(result.uri);
                        }).catch(props.onCaptureError)
                    }
                }).catch(err => {
                    props.onCaptureError(err);
                });
        }
    }

    const cropPhoto = (photo: CameraCapturedPicture) => {
        if (rectLayout) {
            const { width } = photo;
            const { height } = photo;
            const viewH = (rectLayout.height + 2 * rectLayout.y);
            const viewW = (rectLayout.width + 2 * rectLayout.x);
            const fx = width / viewW;
            const fy = height / viewH;
            const cropHeight = fy * rectLayout.height;
            const cropWidth = fx * rectLayout.width;
            const cropX = fx * rectLayout.x;
            const cropY = fy * rectLayout.y;
            const cropRect = {
                width: cropWidth,
                height: cropHeight,
                originX: cropX,
                originY: cropY
            };
            manipulateAsync(
                photo.uri,
                [{ crop: cropRect }],
                { compress: props.imageQuality ?? DEFAULT_QUALITY_CROP, format: SaveFormat.JPEG }
            ).then(result => {
                props.onCaptureSuccess(result.uri);
            }).catch(err => {
                props.onCaptureError(err);
            });
        }
    }

    return (
        <View style={styles.main}>
            <Camera
                style={styles.camera}
                ref={_cameraRef}
                type={CameraType[props.cameraType || "back"]}
                flashMode={FlashMode[props.flashMode || "off"]}
                ratio="16:9">
                <View
                    style={styles.overlayView}
                    onLayout={onLayoutChange}>
                    {rectLayout && <View style={rectStyle} />}
                </View>
            </Camera>
            <View style={styles.captureButtonContainer}>
                <TouchableNativeFeedback onPress={onCapturePress}>
                    <View style={styles.captureButton}>
                        <Text style={styles.captureText}>
                            CAPTURE
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        justifyContent: "center",
        flex: 1
    },
    camera: {
        aspectRatio: 9 / 16
    },
    captureButtonContainer:{
        position:'absolute',
        bottom:30,
        alignSelf:'center'
    },
    overlayView: {
        flex: 1,
        width: "100%",
        backgroundColor: "transparent",
    },
    captureButton: {
        backgroundColor: "#1B98F5",
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 26,
        elevation: 4,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    captureText: {
        fontWeight: "bold",
        color: "#fff"
    }
});

export default React.memo(CameraPreview);