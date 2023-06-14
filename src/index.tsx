import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Camera, PermissionStatus } from 'expo-camera';
import CameraPreview, { CameraPermissionState, ICameraPreviewProps } from "./CameraPreview";
import CapturePreview, { ICapturePreviewProps } from "./CapturePreview";
import type { ImageResult } from "expo-image-manipulator";

export interface ICameraModuleProps extends ICameraPreviewProps { }

const CameraModule = (props: ICameraModuleProps) => {
    const [cameraPermission, setCameraPermission] = React.useState<CameraPermissionState>({
        granted: false,
        error: null
    });
    const [imageResult, setImageResult] = React.useState<ImageResult>();
    // preview default--> true.
    const enablePreview = props.enablePreview ?? true;

    React.useEffect(() => {
        askPermission();
    }, []);

    const askPermission = () => {
        Camera.requestCameraPermissionsAsync().then(result => {
            if (result.granted || result.status === PermissionStatus.GRANTED) {
                setCameraPermission({ granted: true, error: null });
            } else {
                setCameraPermission({ granted: false, error: "Camera permission is required." });
            }
        }).catch(err => {
            setCameraPermission({ granted: false, error: err.message ?? "Unable to load camera." });
        });
    }

    const onPreviewRetake = React.useCallback(() => {
        setImageResult(undefined);
    }, []);

    const onPreviewAccept = React.useCallback(() => {
        if (imageResult?.uri) {
            props.onCaptureSuccess(imageResult);
            setImageResult(undefined);
        }
    }, [imageResult?.uri]);

    const onCaptureSuccess = React.useCallback((imageResult: ImageResult) => {
        if (enablePreview)
        setImageResult(imageResult);
        else
            props.onCaptureSuccess(imageResult);
    }, [enablePreview]);

    const onCaptureError = React.useCallback((error: Error) => {
        props.onCaptureError(error);
    }, []);

    const Content = React.useMemo(() => {
        if (cameraPermission.granted) {
            if (enablePreview && imageResult?.uri) {
                return <CapturePreview
                    imageResult={imageResult}
                    onAcceptPress={onPreviewAccept}
                    onRetakePress={onPreviewRetake} />;
            }
            return <CameraPreview
                {...props}
                onCaptureSuccess={onCaptureSuccess}
                onCaptureError={onCaptureError} />;

        }
        // incase of any error display the error message.
        if (!cameraPermission.granted && cameraPermission.error)
            return (<Text style={styles.error}>
                {cameraPermission.error}
            </Text>);

        return null;
    }, [cameraPermission, imageResult?.uri, enablePreview]);

    return (
        <View style={styles.main}>
            {Content}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center"
    },
    error: {
        textAlign: "center",
        fontSize: 17,
        color: "#fff",
        paddingVertical: 18
    }
});

export default React.memo(CameraModule);

export type {
    ICameraPreviewProps,
    ICapturePreviewProps
}