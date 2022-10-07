import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Camera, PermissionStatus } from 'expo-camera';
import CameraPreview, { CameraPermissionState, ICameraPreviewProps } from "./CameraPreview";
import CapturePreview, { ICapturePreviewProps } from "./CapturePreview";

export interface ICameraModuleProps extends ICameraPreviewProps { }

const CameraModule = (props: ICameraModuleProps) => {
    const [cameraPermission, setCameraPermission] = React.useState<CameraPermissionState>({
        granted: false,
        error: null
    });
    const [previewUri, setPreviewUri] = React.useState<string>();
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
        setPreviewUri(undefined);
    }, []);

    const onPreviewAccept = React.useCallback(() => {
        if (previewUri) {
            props.onCaptureSuccess(`${previewUri}`);
            setPreviewUri(undefined);
        }
    }, [previewUri]);

    const onCaptureSuccess = React.useCallback((uri: string) => {
        if (enablePreview)
            setPreviewUri(uri);
        else
            props.onCaptureSuccess(uri);
    }, [enablePreview]);

    const onCaptureError = React.useCallback((error: Error) => {
        props.onCaptureError(error);
    }, []);

    const Content = React.useMemo(() => {
        if (cameraPermission.granted) {
            if (enablePreview && previewUri) {
                return <CapturePreview
                    uri={previewUri}
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
    }, [cameraPermission, previewUri, enablePreview]);

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