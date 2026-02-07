import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import CelestialBackground from '../components/CelestialBackground';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const HistoryScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReading, setSelectedReading] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/readings');
      setReadings(response.data.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
        activeOpacity={0.8}
        style={styles.card} 
        onPress={() => setSelectedReading(item)}
    >
      <View style={styles.cardGlow} />
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
            <Text style={styles.cardType}>{item.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.cardDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.cardSnippet} numberOfLines={2}>{item.result}</Text>
      <View style={styles.viewMoreRow}>
        <Text style={styles.viewMore}>{t('history.read_prophecy')}</Text>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <CelestialBackground>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>{t('history.title')}</Text>
            <Text style={styles.subtitle}>{t('history.subtitle')}</Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>{t('history.loading')}</Text>
          </View>
        ) : (
          <FlatList
            data={readings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyEmoji}>📜</Text>
                <Text style={styles.emptyText}>{t('history.empty_text')}</Text>
                <Text style={styles.emptySub}>{t('history.empty_sub')}</Text>
              </View>
            }
          />
        )}

        <Modal
          visible={!!selectedReading}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedReading(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                  <Text style={styles.modalType}>{selectedReading?.type.toUpperCase()}</Text>
                  <Text style={styles.modalTitle}>{t('history.prophecy_granted')}</Text>
                  <Text style={styles.modalDate}>{new Date(selectedReading?.created_at).toLocaleString()}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalText}>{selectedReading?.result}</Text>
              </ScrollView>
              
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedReading(null)}>
                <Text style={styles.closeBtnText}>{t('history.close_btn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </CelestialBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 60, marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#D4AF37', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#C0C0C0', marginTop: 4, fontStyle: 'italic' },
  
  listContent: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 },
  loadingText: { color: '#D4AF37', marginTop: 15, fontStyle: 'italic', letterSpacing: 1 },
  
  card: { 
    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
    padding: 24, 
    borderRadius: 24, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden'
  },
  cardGlow: { position: 'absolute', top: -50, right: -50, width: 100, height: 100, backgroundColor: 'rgba(212, 175, 55, 0.03)', borderRadius: 50 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  typeBadge: { backgroundColor: 'rgba(212, 175, 55, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  cardType: { color: '#D4AF37', fontWeight: 'bold', fontSize: 11, letterSpacing: 1.5 },
  cardDate: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  cardSnippet: { color: '#C0C0C0', fontSize: 14, lineHeight: 22, opacity: 0.8 },
  viewMoreRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  viewMore: { color: '#D4AF37', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  arrow: { color: '#D4AF37', fontSize: 16, marginLeft: 8 },
  
  emptyEmoji: { fontSize: 50, marginBottom: 20, opacity: 0.5 },
  emptyText: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  emptySub: { color: '#888', marginTop: 8, fontSize: 14, textAlign: 'center' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', padding: 25 },
  modalContent: { 
    backgroundColor: '#050510', 
    borderRadius: 30, 
    padding: 30, 
    maxHeight: '85%', 
    borderWidth: 1, 
    borderColor: 'rgba(212, 175, 55, 0.4)',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalHeader: { alignItems: 'center', marginBottom: 15 },
  modalType: { color: '#D4AF37', fontSize: 12, fontWeight: 'bold', letterSpacing: 3, marginBottom: 8 },
  modalTitle: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'center' },
  modalDate: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 5 },
  divider: { height: 1, backgroundColor: 'rgba(212, 175, 55, 0.2)', width: '60%', alignSelf: 'center', marginVertical: 20 },
  modalScroll: { marginBottom: 25 },
  modalText: { color: '#fff', fontSize: 16, lineHeight: 28, textAlign: 'justify', fontWeight: '400' },
  closeBtn: { 
    backgroundColor: '#D4AF37', 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  closeBtnText: { color: '#000', fontWeight: '900', fontSize: 15, textTransform: 'uppercase', letterSpacing: 1 }
});

export default HistoryScreen;
