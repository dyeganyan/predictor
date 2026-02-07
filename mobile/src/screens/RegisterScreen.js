import React, { useContext, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import CelestialBackground from '../components/CelestialBackground';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const RegisterScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(''); // YYYY-MM-DD
  const [time, setTime] = useState(''); // HH:MM
  const [location, setLocation] = useState('');
  const { register, isLoading } = useContext(AuthContext);
  
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
        Alert.alert(t('auth.missing_info_title') || 'Missing Info', t('auth.missing_info_msg') || 'Please provide at least your name, email and password.');
        return;
    }
    try {
      await register({
          name,
          email,
          password,
          birth_date: dob,
          birth_time: time,
          birth_location: location
      });
    } catch (e) {
      Alert.alert(t('auth.registration_failed_title') || 'Registration Failed', t('auth.registration_failed_msg') || 'The stars did not align for your registration. Please check your inputs.');
    }
  };

  return (
    <CelestialBackground>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.formCard}>
                <View style={styles.cardGlow} />
                <Text style={styles.title}>{t('auth.register_title')}</Text>
                <Text style={styles.subtitle}>{t('auth.register_subtitle')}</Text>
                
                <View style={styles.inputWrapper}>
                    <TextInput style={styles.input} placeholder={t('auth.name_placeholder')} placeholderTextColor="rgba(212, 175, 55, 0.3)" value={name} onChangeText={setName} />
                </View>

                <View style={styles.inputWrapper}>
                    <TextInput style={styles.input} placeholder={t('auth.email_placeholder')} placeholderTextColor="rgba(212, 175, 55, 0.3)" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                </View>

                <View style={styles.inputWrapper}>
                    <TextInput style={styles.input} placeholder={t('auth.password_placeholder')} placeholderTextColor="rgba(212, 175, 55, 0.3)" value={password} onChangeText={setPassword} secureTextEntry={true} />
                </View>
                
                <View style={styles.divider}>
                    <Text style={styles.label}>{t('auth.birth_details_label')}</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.inputWrapper}>
                    <TextInput style={styles.input} placeholder={t('auth.dob_placeholder')} placeholderTextColor="rgba(212, 175, 55, 0.3)" value={dob} onChangeText={setDob} />
                </View>

                <View style={styles.inputWrapper}>
                    <TextInput style={styles.input} placeholder={t('auth.time_placeholder')} placeholderTextColor="rgba(212, 175, 55, 0.3)" value={time} onChangeText={setTime} />
                </View>

                <View style={styles.inputWrapper}>
                    <TextInput style={styles.input} placeholder={t('auth.location_placeholder')} placeholderTextColor="rgba(212, 175, 55, 0.3)" value={location} onChangeText={setLocation} />
                </View>

                <TouchableOpacity 
                    activeOpacity={1}
                    onPress={handleRegister}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={isLoading}
                    style={{ width: '100%' }}
                >
                    <Animated.View style={[styles.registerBtn, isLoading && styles.disabledBtn, { transform: [{ scale: buttonScale }] }]}>
                        {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.registerBtnText}>{t('auth.register_btn')}</Text>}
                    </Animated.View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
                    <Text style={styles.loginText}>{t('auth.already_initiate')} <Text style={styles.loginHighlight}>{t('auth.return_login')}</Text></Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CelestialBackground>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, paddingTop: 60, paddingBottom: 60 },
  formCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    padding: 30, 
    borderRadius: 35, 
    borderWidth: 1, 
    borderColor: 'rgba(212, 175, 55, 0.25)',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardGlow: { position: 'absolute', top: -50, left: -50, width: 150, height: 150, backgroundColor: 'rgba(212, 175, 55, 0.03)', borderRadius: 75 },
  title: { fontSize: 32, fontWeight: '900', color: '#D4AF37', marginBottom: 5, letterSpacing: -1 },
  subtitle: { color: '#C0C0C0', textAlign: 'center', marginBottom: 35, fontSize: 13, fontStyle: 'italic', letterSpacing: 0.5 },
  
  inputWrapper: { 
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    marginBottom: 12
  },
  input: { 
    color: '#fff',
    padding: 15, 
    fontSize: 15 
  },
  
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 20, marginBottom: 20 },
  label: { color: 'rgba(212, 175, 55, 0.6)', fontSize: 11, fontWeight: 'bold', marginRight: 15, textTransform: 'uppercase', letterSpacing: 1.5 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(212, 175, 55, 0.15)' },
  
  registerBtn: { 
    backgroundColor: '#D4AF37', 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  registerBtnText: { color: '#000', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 },
  disabledBtn: { opacity: 0.6 },
  loginLink: { marginTop: 25 },
  loginText: { color: '#888', fontSize: 13, letterSpacing: 0.5 },
  loginHighlight: { color: '#D4AF37', fontWeight: 'bold' }
});

export default RegisterScreen;
