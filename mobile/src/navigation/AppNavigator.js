import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import PalmReadingScreen from '../screens/PalmReadingScreen';
import CoffeeReadingScreen from '../screens/CoffeeReadingScreen';
import HoroscopeScreen from '../screens/HoroscopeScreen';
import HistoryScreen from '../screens/HistoryScreen';

import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, splashLoading } = useContext(AuthContext);
  const { t } = useTranslation();

  if (splashLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0c29' }}>
        <ActivityIndicator size="large" animating={true} color="#D4AF37" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
            headerShown: false, 
            gestureEnabled: false,
            headerStyle: { backgroundColor: '#0f0c29' },
            headerTintColor: '#D4AF37',
            headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Wallet" component={WalletScreen} options={{ headerShown: true, title: t('wallet.title') }} />
            <Stack.Screen name="Palm" component={PalmReadingScreen} options={{ headerShown: true, title: t('palm.title') }} />
            <Stack.Screen name="Coffee" component={CoffeeReadingScreen} options={{ headerShown: true, title: t('coffee.title') }} />
            <Stack.Screen name="Horoscope" component={HoroscopeScreen} options={{ headerShown: true, title: t('horoscope.title') }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: true, title: t('history.title') }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: t('auth.register_title') }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
