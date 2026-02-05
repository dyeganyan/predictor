import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const HoroscopeScreen = ({ navigation }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useContext(AuthContext);

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
          Alert.alert('Insufficient Balance', 'Please add funds.');
       } else if (e.response?.status === 422) {
           Alert.alert('Profile Incomplete', 'Please update your birth date.');
       } else {
          Alert.alert('Error', 'Failed to fetch horoscope.');
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weekly Horoscope</Text>
      <Text style={styles.subtitle}>For {user?.name}</Text>

      {!result ? (
          <View style={styles.center}>
             <Text style={styles.desc}>Get your weekly mystical insights based on your birth chart.</Text>
             <Button title={loading ? "Consulting the Stars..." : "Get Horoscope ($5.00)"} onPress={getHoroscope} disabled={loading} />
             {loading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />}
          </View>
      ) : (
          <View>
              <Text style={styles.resultText}>{result}</Text>
              <Button title="Back" onPress={() => navigation.goBack()} />
          </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  center: { alignItems: 'center', marginTop: 50 },
  title: { fontSize: 28, marginBottom: 10, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 18, marginBottom: 30, textAlign: 'center', color: '#666' },
  desc: { textAlign: 'center', marginBottom: 20, fontSize: 16 },
  resultText: { fontSize: 16, lineHeight: 26, marginBottom: 30, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 10 }
});

export default HoroscopeScreen;
