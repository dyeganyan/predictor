import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CelestialBackground from '../components/CelestialBackground';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const WalletScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useContext(AuthContext);
  
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert(t('common.error'), t('wallet.invalid_amount_msg') || 'Please specify a valid amount of essence to infuse.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/wallet/deposit', {
        amount: parseFloat(amount),
      });

      Alert.alert(t('wallet.infusion_success_title') || 'Infusion Successful', t('wallet.infusion_success_msg') || 'Your celestial balance has been replenished.');
      await refreshUser();
      navigation.goBack();
    } catch (e) {
      Alert.alert(t('wallet.infusion_failed_title') || 'The Void Resists', t('wallet.infusion_failed_msg') || 'Failed to infuse essence. Check your connection to the cosmos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CelestialBackground>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
            <Text style={styles.label}>{t('wallet.essence_label')}</Text>
            <Text style={styles.balance}>${Number(user?.balance || 0).toFixed(2)}</Text>
        </View>

        <View style={styles.formCard}>
            <View style={styles.cardGlow} />
            <Text style={styles.title}>{t('wallet.title')}</Text>
            <Text style={styles.subtitle}>{t('wallet.subtitle')}</Text>
            
            <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="rgba(212, 175, 55, 0.3)"
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                />
            </View>

            <TouchableOpacity 
                activeOpacity={1}
                onPress={handleDeposit}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={loading}
                style={{ width: '100%' }}
            >
                <Animated.View style={[styles.depositBtn, loading && styles.disabledBtn, { transform: [{ scale: buttonScale }] }]}>
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.depositBtnText}>{t('wallet.infuse_btn')}</Text>}
                </Animated.View>
            </TouchableOpacity>

            <Text style={styles.note}>{t('wallet.note')}</Text>
        </View>
      </KeyboardAvoidingView>
    </CelestialBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 50 },
  label: { color: '#C0C0C0', textTransform: 'uppercase', letterSpacing: 3, fontSize: 13, fontWeight: 'bold' },
  balance: { color: '#fff', fontSize: 48, fontWeight: '900', marginTop: 10, letterSpacing: -1 },
  
  formCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    padding: 30, 
    borderRadius: 30, 
    borderWidth: 1, 
    borderColor: 'rgba(212, 175, 55, 0.25)',
    alignItems: 'center',
    overflow: 'hidden'
  },
  cardGlow: { position: 'absolute', bottom: -50, right: -50, width: 150, height: 150, backgroundColor: 'rgba(212, 175, 55, 0.03)', borderRadius: 75 },
  title: { fontSize: 22, fontWeight: '800', color: '#D4AF37', marginBottom: 10 },
  subtitle: { color: '#AAA', textAlign: 'center', marginBottom: 35, fontSize: 13, lineHeight: 20 },
  
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    paddingHorizontal: 20,
    marginBottom: 25
  },
  currencySymbol: { fontSize: 24, color: '#D4AF37', fontWeight: 'bold' },
  input: { 
    flex: 1,
    color: '#fff',
    padding: 18, 
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 10
  },
  
  depositBtn: { 
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
  depositBtnText: { color: '#000', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 },
  disabledBtn: { opacity: 0.6 },
  note: { color: '#666', fontSize: 12, marginTop: 25, textAlign: 'center', fontStyle: 'italic' }
});

export default WalletScreen;
