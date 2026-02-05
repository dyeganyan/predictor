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

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, splashLoading } = useContext(AuthContext);

  if (splashLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="Palm" component={PalmReadingScreen} />
            <Stack.Screen name="Coffee" component={CoffeeReadingScreen} />
            <Stack.Screen name="Horoscope" component={HoroscopeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
