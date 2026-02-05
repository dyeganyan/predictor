import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const SmartCameraScreen = ({ onCapture, overlayType, onCancel }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
        <Button onPress={onCancel} title="Cancel" color="red" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
            quality: 0.7,
            base64: false,
        });
        onCapture(photo);
      } catch (e) {
          console.log(e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        <View style={styles.overlayContainer}>
           {/* Guide Overlay */}
           <View style={[styles.guideFrame, overlayType === 'cup' ? styles.circle : styles.oval]} />
           <Text style={styles.guideText}>
             Align your {overlayType === 'cup' ? 'Coffee Cup' : 'Palm'} here
           </Text>
        </View>

        <View style={styles.controls}>
            <TouchableOpacity onPress={onCancel} style={styles.btn}>
                <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />

            <View style={styles.btn} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  guideFrame: {
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.8)',
      backgroundColor: 'transparent',
      borderStyle: 'dashed',
  },
  circle: { width: 250, height: 250, borderRadius: 125 },
  oval: { width: 250, height: 380, borderRadius: 125 },
  guideText: {
      color: 'white',
      marginTop: 20,
      fontSize: 18,
      fontWeight: 'bold',
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5
  },
  controls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 40,
      paddingTop: 20,
      backgroundColor: 'rgba(0,0,0,0.8)'
  },
  captureBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', borderWidth: 5, borderColor: '#ccc' },
  btn: { padding: 10, minWidth: 60 },
  btnText: { color: 'white', fontSize: 16 }
});

export default SmartCameraScreen;
