import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import SmartCameraScreen from './SmartCameraScreen';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CelestialBackground from '../components/CelestialBackground';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const CoffeeReadingScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useContext(AuthContext);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (result) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [result]);

  const handleCapture = (photo) => {
    setImages([...images, photo.uri]);
    setCameraVisible(false);
  };

  const uploadAndAnalyze = async () => {
    if (images.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    images.forEach((uri, index) => {
        formData.append('images[]', {
            uri: uri,
            name: `coffee_${index}.jpg`,
            type: 'image/jpeg',
        });
    });

    try {
      const response = await api.post('/coffee', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.data.result);
      await refreshUser();
    } catch (e) {
      if (e.response?.status === 402) {
          Alert.alert(t('auth.insufficient_balance_title') || 'Insufficient Balance', t('auth.insufficient_balance_msg') || 'Please infuse your balance to continue.');
      } else {
          Alert.alert(t('coffee.vision_clouded_title') || 'Vision Clouded', t('coffee.vision_clouded_msg') || 'The grounds are silent. Please try another capture.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cameraVisible) {
    return (
      <SmartCameraScreen
        overlayType="cup"
        onCapture={handleCapture}
        onCancel={() => setCameraVisible(false)}
      />
    );
  }

  return (
    <CelestialBackground>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {!result ? (
          <>
            <View style={styles.header}>
                <Text style={styles.title}>{t('coffee.title')}</Text>
                <Text style={styles.subtitle}>{t('coffee.subtitle')}</Text>
            </View>
            
            <View style={styles.instructionCard}>
                <Text style={styles.instructionTitle}>{t('coffee.instruction_title')}</Text>
                <View style={styles.instructionRow}>
                    <Text style={styles.icon}>📸</Text>
                    <Text style={styles.desc}>{t('coffee.instruction_1')}</Text>
                </View>
                <View style={styles.instructionRow}>
                    <Text style={styles.icon}>🔄</Text>
                    <Text style={styles.desc}>{t('coffee.instruction_2')}</Text>
                </View>
                <View style={styles.instructionRow}>
                    <Text style={styles.icon}>✨</Text>
                    <Text style={styles.desc}>{t('coffee.instruction_3')}</Text>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewContainer}>
                {images.map((uri, idx) => (
                    <View key={idx} style={styles.previewWrapper}>
                        <Image source={{ uri: uri }} style={styles.preview} />
                        <TouchableOpacity style={styles.removeBtn} onPress={() => setImages(images.filter((_, i) => i !== idx))}>
                            <Text style={styles.removeText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                
                {images.length < 5 && (
                    <TouchableOpacity style={[styles.preview, styles.placeholder]} onPress={() => setCameraVisible(true)}>
                        <Text style={styles.plusIcon}>+</Text>
                        <Text style={styles.addText}>{t('coffee.add_photo')}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <View style={{ height: 40 }} />

            {images.length > 0 && !loading && (
               <TouchableOpacity style={styles.analyzeBtn} onPress={uploadAndAnalyze}>
                    <Text style={styles.analyzeText}>{t('coffee.analyze_btn')}</Text>
               </TouchableOpacity>
            )}

            {images.length > 0 && !loading && (
               <TouchableOpacity style={styles.clearBtn} onPress={() => setImages([])}>
                    <Text style={styles.clearText}>{t('coffee.clear_btn')}</Text>
               </TouchableOpacity>
            )}

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#D4AF37" />
                    <Text style={styles.loadingText}>{t('coffee.loading')}</Text>
                </View>
            )}
          </>
        ) : (
          <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
            <Text style={styles.resultTitle}>{t('coffee.result_title')}</Text>
            <View style={styles.resultCard}>
                <View style={styles.cardGlow} />
                <ScrollView style={styles.resultScroll} showsVerticalScrollIndicator={false}>
                    <Text style={styles.resultText}>{result}</Text>
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.newReadingBtn} onPress={() => { setResult(null); setImages([]); }}>
                <Text style={styles.newReadingText}>{t('coffee.new_answer')}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </CelestialBackground>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, paddingTop: 60, paddingBottom: 50 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '900', color: '#D4AF37', letterSpacing: -1 },
  subtitle: { fontSize: 13, color: '#C0C0C0', fontStyle: 'italic', marginTop: 4 },
  instructionCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
    padding: 24, 
    borderRadius: 24, 
    width: '100%',
    marginBottom: 35,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)'
  },
  instructionTitle: { color: '#D4AF37', fontWeight: 'bold', fontSize: 14, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' },
  instructionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  icon: { fontSize: 20, marginRight: 15 },
  desc: { flex: 1, color: '#C0C0C0', fontSize: 14, lineHeight: 22 },
  
  previewContainer: { height: 210, flexGrow: 0, width: '100%' },
  previewWrapper: { position: 'relative', marginRight: 15 },
  preview: { width: 150, height: 210, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  removeBtn: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  removeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  placeholder: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.03)', 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: 'rgba(212, 175, 55, 0.3)' 
  },
  plusIcon: { fontSize: 40, color: '#D4AF37', marginBottom: 5, opacity: 0.8 },
  addText: { color: '#D4AF37', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  
  analyzeBtn: { 
    backgroundColor: '#D4AF37', 
    width: '100%',
    paddingVertical: 18, 
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  analyzeText: { color: '#000', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 },
  
  clearBtn: { marginTop: 25, alignSelf: 'center' },
  clearText: { color: '#666', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' },
  
  loadingContainer: { marginTop: 10, alignItems: 'center' },
  loadingText: { color: '#D4AF37', marginTop: 15, fontSize: 14, fontStyle: 'italic', letterSpacing: 1 },
  
  resultContainer: { width: '100%', alignItems: 'center' },
  resultTitle: { fontSize: 32, fontWeight: '900', color: '#D4AF37', marginBottom: 30, textAlign: 'center' },
  resultCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    padding: 28, 
    borderRadius: 30, 
    width: '100%', 
    maxHeight: 500,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden'
  },
  cardGlow: { position: 'absolute', top: -100, left: -100, width: 250, height: 250, backgroundColor: 'rgba(212, 175, 55, 0.03)', borderRadius: 125 },
  resultScroll: { flexGrow: 0 },
  resultText: { fontSize: 17, lineHeight: 30, color: '#fff', textAlign: 'justify', fontWeight: '400' },
  newReadingBtn: { 
    paddingHorizontal: 40, 
    paddingVertical: 15, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)'
  },
  newReadingText: { color: '#D4AF37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, fontSize: 13 }
});

export default CoffeeReadingScreen;
