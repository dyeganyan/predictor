import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CelestialBackground from '../components/CelestialBackground';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const HoroscopeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useContext(AuthContext);
  
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

  const getHoroscope = async () => {
    setLoading(true);
    try {
      const response = await api.post('/horoscope', {
          period: 'weekly'
      });
      setResult(response.data.data.result);
      await refreshUser();
    } catch (e) {
       if (e.response?.status === 402) {
          Alert.alert(t('auth.insufficient_balance_title') || 'Insufficient Balance', t('auth.insufficient_balance_msg') || 'Please infuse your balance to continue.');
       } else if (e.response?.status === 422) {
           Alert.alert(t('horoscope.profile_incomplete_title') || 'Profile Incomplete', t('horoscope.profile_incomplete_msg') || 'Please update your birth date in settings to receive your horoscope.');
       } else {
          Alert.alert(t('common.error') || 'Error', t('common.error_msg') || 'Failed to fetch horoscope.');
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CelestialBackground>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {!result ? (
          <>
            <View style={styles.header}>
                <Text style={styles.title}>{t('horoscope.title')}</Text>
                <Text style={styles.subtitle}>{t('horoscope.subtitle', { name: user?.name })}</Text>
            </View>
            
            <View style={styles.instructionCard}>
                <Text style={styles.instructionTitle}>{t('palm.instruction_title')}</Text>
                <View style={styles.instructionRow}>
                    <Text style={styles.icon}>🔯</Text>
                    <Text style={styles.desc}>{t('horoscope.desc')}</Text>
                </View>
            </View>

            <View style={{ height: 40 }} />

            {!loading ? (
               <TouchableOpacity style={styles.analyzeBtn} onPress={getHoroscope}>
                    <Text style={styles.analyzeText}>{t('horoscope.get_btn')}</Text>
               </TouchableOpacity>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#D4AF37" />
                    <Text style={styles.loadingText}>{t('horoscope.loading')}</Text>
                </View>
            )}
          </>
        ) : (
          <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
            <Text style={styles.resultTitle}>{t('horoscope.result_title')}</Text>
            <View style={styles.resultCard}>
                <View style={styles.cardGlow} />
                <ScrollView style={styles.resultScroll} showsVerticalScrollIndicator={false}>
                    <Text style={styles.resultText}>{result}</Text>
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.newReadingBtn} onPress={() => { setResult(null); }}>
                <Text style={styles.newReadingText}>{t('horoscope.new_reading_btn')}</Text>
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
  title: { fontSize: 32, fontWeight: '900', color: '#D4AF37', letterSpacing: -1, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#C0C0C0', fontStyle: 'italic', marginTop: 4, textAlign: 'center' },
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
  instructionRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 24, marginRight: 15 },
  desc: { flex: 1, color: '#C0C0C0', fontSize: 16, lineHeight: 24 },
  
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

export default HoroscopeScreen;
