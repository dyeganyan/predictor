import React, { useContext, useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, Modal } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import CelestialBackground from '../components/CelestialBackground';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ProphecyCard = ({ title, price, desc, icon, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity 
        activeOpacity={1}
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.cardGlow} />
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{icon} {title}</Text>
            <View style={styles.badge}>
                <Text style={styles.cardPrice}>{price}</Text>
            </View>
        </View>
        <Text style={styles.cardDesc}>{desc}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const { user, logout, refreshUser } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [langModalVisible, setLangModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshUser();
    }, [])
  );

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangModalVisible(false);
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'hy', label: 'Հայերեն', flag: '🇦🇲' },
  ];

  return (
    <CelestialBackground>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <View>
                    <Text style={styles.welcome}>{t('home.welcome_title')}</Text>
                    <Text style={styles.userName}>{t('home.greeting')}, {user?.name}</Text>
                </View>
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => setLangModalVisible(true)} style={styles.headerBtnWrapper}>
                        <Text style={styles.headerBtnText}>🌐</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.headerBtnWrapper}>
                        <Text style={styles.headerBtnText}>📜</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
             <Text style={styles.balanceLabel}>{t('home.essence_label')}</Text>
             <View style={styles.dot} />
          </View>
          <Text style={styles.balanceValue}>${Number(user?.balance || 0).toFixed(2)}</Text>
          <TouchableOpacity style={styles.addFundsBtn} onPress={() => navigation.navigate('Wallet')}>
            <Text style={styles.addFundsText}>{t('home.balance_infuse')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menu}>
          <Text style={styles.sectionTitle}>{t('home.seek_prophecy')}</Text>
          <ProphecyCard 
            title={t('home.palm_reading')} 
            price="$5.00" 
            icon="✋"
            desc={t('home.palm_desc')}
            onPress={() => navigation.navigate('Palm')}
          />
          <ProphecyCard 
            title={t('home.coffee_reading')} 
            price="$5.00" 
            icon="☕"
            desc={t('home.coffee_desc')}
            onPress={() => navigation.navigate('Coffee')}
          />
          <ProphecyCard 
            title={t('home.horoscope')} 
            price="$5.00" 
            icon="✨"
            desc={t('home.horoscope_desc')}
            onPress={() => navigation.navigate('Horoscope')}
          />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>{t('home.logout_btn')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={langModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language / Ընտրել լեզուն</Text>
            {languages.map((item) => (
              <TouchableOpacity 
                key={item.code} 
                style={[styles.langItem, i18n.language === item.code && styles.langItemSelected]} 
                onPress={() => changeLanguage(item.code)}
              >
                <Text style={styles.langFlag}>{item.flag}</Text>
                <Text style={styles.langLabel}>{item.label}</Text>
                {i18n.language === item.code && <Text style={styles.langCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setLangModalVisible(false)}>
              <Text style={styles.closeBtnText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </CelestialBackground>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 35 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcome: { fontSize: 26, fontWeight: '900', color: '#D4AF37', letterSpacing: -0.5 },
  userName: { fontSize: 14, color: '#C0C0C0', marginTop: 2, fontStyle: 'italic' },
  headerButtons: { flexDirection: 'row', gap: 10 },
  headerBtnWrapper: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: 'rgba(212, 175, 55, 0.15)', 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)'
  },
  headerBtnText: { fontSize: 20 },
  balanceCard: { 
    padding: 24, 
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 40, 
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  balanceLabel: { fontSize: 12, color: '#C0C0C0', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 'bold' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D4AF37', marginLeft: 8 },
  balanceValue: { fontSize: 42, fontWeight: '900', color: '#fff', marginVertical: 12, letterSpacing: -1 },
  addFundsBtn: { 
    backgroundColor: '#D4AF37', 
    paddingHorizontal: 28, 
    paddingVertical: 12, 
    borderRadius: 30,
    marginTop: 5
  },
  addFundsText: { color: '#000', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 13, letterSpacing: 1 },
  sectionTitle: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 15, opacity: 0.8 },
  menu: { gap: 18, marginBottom: 50 },
  card: { 
    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden'
  },
  cardGlow: { 
    position: 'absolute', top: -50, right: -50, width: 120, height: 120, 
    backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: 60 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  badge: { backgroundColor: 'rgba(212, 175, 55, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  cardPrice: { fontSize: 13, color: '#D4AF37', fontWeight: 'bold' },
  cardDesc: { fontSize: 14, color: '#999', lineHeight: 22, fontWeight: '400' },
  logoutBtn: { padding: 15, alignItems: 'center' },
  logoutText: { color: '#666', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 25 },
  modalContent: { 
    backgroundColor: '#050510', 
    borderRadius: 30, 
    padding: 30, 
    borderWidth: 1, 
    borderColor: 'rgba(212, 175, 55, 0.4)',
    alignItems: 'center'
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#D4AF37', marginBottom: 25, textAlign: 'center' },
  langItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    padding: 18, 
    borderRadius: 15, 
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)'
  },
  langItemSelected: { backgroundColor: 'rgba(212, 175, 55, 0.15)', borderColor: 'rgba(212, 175, 55, 0.3)', borderWidth: 1 },
  langFlag: { fontSize: 24, marginRight: 15 },
  langLabel: { flex: 1, color: '#fff', fontSize: 16, fontWeight: 'bold' },
  langCheck: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold' },
  closeBtn: { marginTop: 20, padding: 10 },
  closeBtnText: { color: '#666', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }
});

export default HomeScreen;
