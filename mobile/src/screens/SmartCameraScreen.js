import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Dimensions, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const PalmOverlay = () => (
    <View style={styles.handSilhouette}>
        <View style={styles.fingersRow}>
            <View style={[styles.finger, { height: 80, transform: [{rotate: '-15deg'}] }]} />
            <View style={[styles.finger, { height: 110, transform: [{rotate: '-5deg'}], marginBottom: 10 }]} />
            <View style={[styles.finger, { height: 120, transform: [{rotate: '5deg'}], marginBottom: 15 }]} />
            <View style={[styles.finger, { height: 95, transform: [{rotate: '15deg'}], marginBottom: 5 }]} />
        </View>
        <View style={styles.palmCenter} />
        <View style={styles.thumbGuide} />
    </View>
);

const CupOverlay = () => (
    <View style={styles.cupContainer}>
        <View style={styles.cupRim} />
        <View style={styles.cupBody} />
        <View style={styles.cupHandle} />
    </View>
);

const SmartCameraScreen = ({ onCapture, overlayType, onCancel }) => {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: height * 0.7,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 100, color: 'white' }}>{t('camera.permission_msg')}</Text>
        <Button onPress={requestPermission} title={t('camera.grant_btn')} />
        <Button onPress={onCancel} title={t('common.back')} color="red" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
            quality: 0.8,
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
        <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]} />
        <View style={styles.overlayContainer}>
           <View style={styles.guideWrapper}>
                {overlayType === 'cup' ? <CupOverlay /> : <PalmOverlay />}
           </View>
           <Text style={styles.guideText}>
             {t('camera.align_msg')} {overlayType === 'cup' ? t('camera.coffee_cup') : t('camera.palm')}
           </Text>
        </View>

        <View style={styles.controls}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureBtnWrapper} onPress={takePicture}>
                <View style={styles.captureBtnInner} />
            </TouchableOpacity>

            <View style={{ width: 60 }} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  scanLine: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    height: 3, 
    backgroundColor: 'rgba(212, 175, 55, 0.8)',
    zIndex: 10,
    shadowColor: '#D4AF37',
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  guideWrapper: { width: 300, height: 400, justifyContent: 'center', alignItems: 'center' },
  
  // Hand Layout
  handSilhouette: { width: 250, height: 350, alignItems: 'center', justifyContent: 'center' },
  fingersRow: { flexDirection: 'row', alignItems: 'flex-end', height: 150, marginBottom: -10 },
  finger: { width: 35, borderTopLeftRadius: 17, borderTopRightRadius: 17, borderWidth: 2, borderColor: '#D4AF37', marginHorizontal: 3, opacity: 0.6 },
  palmCenter: { width: 180, height: 180, borderBottomLeftRadius: 90, borderBottomRightRadius: 90, borderWidth: 2, borderColor: '#D4AF37', borderTopWidth: 0, opacity: 0.6 },
  thumbGuide: { position: 'absolute', left: -10, bottom: 80, width: 40, height: 90, borderRadius: 20, borderWidth: 2, borderColor: '#D4AF37', transform: [{rotate: '-45deg'}], opacity: 0.6 },

  // Cup Layout
  cupContainer: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  cupRim: { width: 200, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#D4AF37', borderStyle: 'dashed', opacity: 0.6 },
  cupBody: { width: 160, height: 120, borderBottomLeftRadius: 80, borderBottomRightRadius: 80, borderWidth: 2, borderColor: '#D4AF37', marginTop: -50, opacity: 0.6 },
  cupHandle: { position: 'absolute', right: -10, top: 90, width: 50, height: 70, borderTopRightRadius: 35, borderBottomRightRadius: 35, borderWidth: 2, borderColor: '#D4AF37', borderLeftWidth: 0, opacity: 0.6 },

  guideText: {
      color: '#D4AF37',
      marginTop: 20,
      fontSize: 18,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 2,
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3
  },
  controls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 50,
      paddingTop: 20,
      backgroundColor: 'rgba(0,0,0,0.6)'
  },
  captureBtnWrapper: { width: 84, height: 84, borderRadius: 42, borderWidth: 4, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
  captureBtnInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#D4AF37' },
  cancelBtn: { padding: 10 },
  cancelText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default SmartCameraScreen;
