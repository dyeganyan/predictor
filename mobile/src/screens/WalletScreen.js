import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const WalletScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useContext(AuthContext);

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount');
      return;
    }

    setLoading(true);
    try {
      // In a real app, here we would integrate Stripe Frontend SDK (StripeProvider)
      // and send the paymentMethodId.
      // For this mock/prototype, we send just the amount (backend handles mock if no keys).
      await api.post('/wallet/deposit', {
        amount: parseFloat(amount),
        // payment_method_id: 'mock_tok'
      });

      Alert.alert('Success', 'Funds added!');
      await refreshUser();
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Funds</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount ($)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title={loading ? "Processing..." : "Pay with Card"} onPress={handleDeposit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5, fontSize: 18 },
});

export default WalletScreen;
