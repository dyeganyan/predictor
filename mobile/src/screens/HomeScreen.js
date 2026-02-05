import React, { useContext, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { user, logout, refreshUser } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      refreshUser();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.name}</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balanceValue}>${user?.balance}</Text>
        <Button title="Add Funds" onPress={() => navigation.navigate('Wallet')} />
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Palm')}>
          <Text style={styles.cardText}>Palm Reading</Text>
          <Text style={styles.cardSub}>$5.00</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Coffee')}>
          <Text style={styles.cardText}>Coffee Cup Reading</Text>
          <Text style={styles.cardSub}>$5.00</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Horoscope')}>
          <Text style={styles.cardText}>Weekly Horoscope</Text>
          <Text style={styles.cardSub}>$5.00</Text>
        </TouchableOpacity>
      </View>

      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  balanceContainer: { padding: 20, backgroundColor: '#f0f0f0', borderRadius: 10, marginBottom: 30, alignItems: 'center' },
  balanceLabel: { fontSize: 16, color: '#666' },
  balanceValue: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  menu: { flex: 1 },
  card: { backgroundColor: '#e6e6fa', padding: 20, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  cardText: { fontSize: 18, fontWeight: 'bold' },
  cardSub: { fontSize: 14, color: '#666' }
});

export default HomeScreen;
