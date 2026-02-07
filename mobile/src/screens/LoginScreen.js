import React, { useContext, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import CelestialBackground from '../components/CelestialBackground';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useContext(AuthContext);
  
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert(t('common.error'), t('auth.missing_records_alert') || 'Please provide both email and password to enter the Oracle.');
        return;
    }
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert(t('auth.access_denied_title') || 'Access Denied', t('auth.access_denied_msg') || 'Your credentials did not align with our records. Please try again.');
    }
  };

  return (
    <CelestialBackground>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.formCard}>
            <View style={styles.cardGlow} />
            <Text style={styles.title}>{t('auth.login_title')}</Text>
            <Text style={styles.subtitle}>{t('auth.login_subtitle')}</Text>
            
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder={t('auth.email_placeholder')}
                    placeholderTextColor="rgba(212, 175, 55, 0.3)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>
            
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder={t('auth.password_placeholder')}
                    placeholderTextColor="rgba(212, 175, 55, 0.3)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
            </View>

            <TouchableOpacity 
                activeOpacity={1}
                onPress={handleLogin}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isLoading}
                style={{ width: '100%' }}
            >
                <Animated.View style={[styles.loginBtn, isLoading && styles.disabledBtn, { transform: [{ scale: buttonScale }] }]}>
                    {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginBtnText}>{t('auth.login_btn')}</Text>}
                </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>{t('auth.new_initiate')} <Text style={styles.registerHighlight}>{t('auth.begin_journey')}</Text></Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </CelestialBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center' },
  formCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    padding: 35, 
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
  title: { fontSize: 34, fontWeight: '900', color: '#D4AF37', marginBottom: 5, letterSpacing: -1 },
  subtitle: { color: '#C0C0C0', textAlign: 'center', marginBottom: 40, fontSize: 13, fontStyle: 'italic', letterSpacing: 1 },
  
  inputWrapper: { 
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  input: { 
    color: '#fff',
    padding: 16, 
    fontSize: 15 
  },
  
  loginBtn: { 
    backgroundColor: '#D4AF37', 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  loginBtnText: { color: '#000', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 },
  disabledBtn: { opacity: 0.6 },
  registerLink: { marginTop: 30 },
  registerText: { color: '#888', fontSize: 13, letterSpacing: 0.5 },
  registerHighlight: { color: '#D4AF37', fontWeight: 'bold' }
});

export default LoginScreen;
