import type { ImageResult } from "expo-image-manipulator";
import React from "react";
import { StyleSheet, View, TouchableNativeFeedback, Text, Image } from "react-native";

export interface ICapturePreviewProps {
    imageResult: ImageResult,
    onRetakePress: () => void,
    onAcceptPress: () => void
}

const CapturePreview = (props: ICapturePreviewProps) => (
    <View style={styles.main}>
        <Image style={styles.image} source={{ uri: props.imageResult.uri }} />
        <View style={styles.actionRow}>
            <TouchableNativeFeedback onPress={props.onRetakePress}>
                <View style={[styles.captureButton, { backgroundColor: "#B4161B" }]}>
                    <Text style={styles.captureText}>
                        RETAKE
                    </Text>
                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={props.onAcceptPress}>
                <View style={styles.captureButton}>
                    <Text style={styles.captureText}>
                        ACCEPT
                    </Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    </View>
)

const styles = StyleSheet.create({
    main: {
        width: "100%",
        flex: 1,
        backgroundColor: "#000"
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
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
    },
    actionRow: {
        position: "absolute",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        bottom: 32
    }
});

export default React.memo(CapturePreview);