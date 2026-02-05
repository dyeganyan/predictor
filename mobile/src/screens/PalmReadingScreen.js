import React, { useState, useContext } from 'react';
import { View, Text, Button, Image, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import SmartCameraScreen from './SmartCameraScreen';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const PalmReadingScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useContext(AuthContext);

  const handleCapture = (photo) => {
    setImage(photo.uri);
    setCameraVisible(false);
  };

  const uploadAndAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: 'palm.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await api.post('/palm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.data.result);
      await refreshUser(); // Update balance
    } catch (e) {
      console.log(e);
      if (e.response?.status === 402) {
          Alert.alert('Insufficient Balance', 'Please add funds to your wallet.');
      } else {
          Alert.alert('Error', 'Failed to analyze image. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cameraVisible) {
    return (
      <SmartCameraScreen
        overlayType="palm"
        onCapture={handleCapture}
        onCancel={() => setCameraVisible(false)}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!result ? (
        <>
          <Text style={styles.title}>Palm Reading</Text>
          <Text style={styles.desc}>Take a clear photo of your palm. Make sure the lines are visible.</Text>

          {image ? (
            <Image source={{ uri: image }} style={styles.preview} />
          ) : (
             <View style={styles.placeholder}>
                <Text>No Image Selected</Text>
             </View>
          )}

          <Button title={image ? "Retake Photo" : "Take Photo"} onPress={() => setCameraVisible(true)} />

          <View style={{ height: 10 }} />

          {image && (
             <Button title={loading ? "Analyzing..." : "Analyze Palm ($5.00)"} onPress={uploadAndAnalyze} disabled={loading} />
          )}
          {loading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />}
        </>
      ) : (
        <View>
          <Text style={styles.resultTitle}>Your Reading</Text>
          <Text style={styles.resultText}>{result}</Text>
          <Button title="New Reading" onPress={() => { setResult(null); setImage(null); }} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10, fontWeight: 'bold' },
  desc: { textAlign: 'center', marginBottom: 20, color: '#555' },
  preview: { width: 300, height: 400, marginBottom: 20, borderRadius: 10 },
  placeholder: { width: 300, height: 400, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  resultTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
  resultText: { fontSize: 16, lineHeight: 24, marginBottom: 30 }
});

export default PalmReadingScreen;
