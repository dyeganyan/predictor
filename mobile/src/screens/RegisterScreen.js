import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(''); // YYYY-MM-DD
  const [time, setTime] = useState(''); // HH:MM
  const [location, setLocation] = useState('');
  const { register, isLoading } = useContext(AuthContext);

  const handleRegister = async () => {
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
      Alert.alert('Registration Failed', 'Please check your inputs');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Join Mystic App</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Text style={styles.label}>Birth Details (for Horoscope)</Text>
      <TextInput style={styles.input} placeholder="Birth Date (YYYY-MM-DD)" value={dob} onChangeText={setDob} />
      <TextInput style={styles.input} placeholder="Birth Time (HH:MM)" value={time} onChangeText={setTime} />
      <TextInput style={styles.input} placeholder="Birth Location (City)" value={location} onChangeText={setLocation} />

      <Button title={isLoading ? "Loading..." : "Register"} onPress={handleRegister} />
      <View style={{ marginTop: 10 }}>
        <Button title="Back to Login" onPress={() => navigation.goBack()} color="gray" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default RegisterScreen;
