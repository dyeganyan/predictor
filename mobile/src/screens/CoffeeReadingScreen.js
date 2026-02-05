import React, { useState, useContext } from 'react';
import { View, Text, Button, Image, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import SmartCameraScreen from './SmartCameraScreen';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CoffeeReadingScreen = ({ navigation }) => {
  const [images, setImages] = useState([]); // Array of URIs
  const [cameraVisible, setCameraVisible] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useContext(AuthContext);

  const handleCapture = (photo) => {
    setImages([...images, photo.uri]);
    setCameraVisible(false);
  };

  const uploadAndAnalyze = async () => {
    if (images.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    images.forEach((uri, index) => {
        formData.append('images[]', {
            uri: uri,
            name: `coffee_${index}.jpg`,
            type: 'image/jpeg',
        });
    });

    try {
      const response = await api.post('/coffee', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.data.result);
      await refreshUser();
    } catch (e) {
      if (e.response?.status === 402) {
          Alert.alert('Insufficient Balance', 'Please add funds.');
      } else {
          Alert.alert('Error', 'Failed to analyze.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cameraVisible) {
    return (
      <SmartCameraScreen
        overlayType="cup"
        onCapture={handleCapture}
        onCancel={() => setCameraVisible(false)}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!result ? (
        <>
          <Text style={styles.title}>Coffee Cup Reading</Text>
          <Text style={styles.desc}>Take photos of your cup from different angles (Top, Side).</Text>

          <ScrollView horizontal style={styles.previewContainer}>
              {images.map((uri, idx) => (
                  <Image key={idx} source={{ uri: uri }} style={styles.preview} />
              ))}
              <View style={[styles.preview, styles.placeholder]}>
                  <Button title="+" onPress={() => setCameraVisible(true)} />
              </View>
          </ScrollView>

          <View style={{ height: 20 }} />

          {images.length > 0 && (
             <Button title={loading ? "Analyzing..." : "Analyze Cup ($5.00)"} onPress={uploadAndAnalyze} disabled={loading} />
          )}
           <View style={{ height: 10 }} />
          {images.length > 0 && (
              <Button title="Clear Images" onPress={() => setImages([])} color="red" />
          )}

          {loading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />}
        </>
      ) : (
        <View>
          <Text style={styles.resultTitle}>Your Reading</Text>
          <Text style={styles.resultText}>{result}</Text>
          <Button title="New Reading" onPress={() => { setResult(null); setImages([]); }} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10, fontWeight: 'bold' },
  desc: { textAlign: 'center', marginBottom: 20, color: '#555' },
  previewContainer: { height: 200, flexGrow: 0 },
  preview: { width: 150, height: 200, marginRight: 10, borderRadius: 10, backgroundColor: '#eee' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  resultTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
  resultText: { fontSize: 16, lineHeight: 24, marginBottom: 30 }
});

export default CoffeeReadingScreen;
