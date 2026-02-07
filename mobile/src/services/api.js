import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Change this to your machine's IP if running on a physical device
// For Android Emulator, use 'http://10.0.2.2:8080/api'
// For Physical Device / LAN, use the IP below:
const API_URL = 'http://192.168.1.91:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
