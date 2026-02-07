import React, { useMemo, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const TwinklingStar = ({ size, top, left, delay }) => {
  const opacity = useRef(new Animated.Value(Math.random() * 0.5 + 0.2)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 1500 + Math.random() * 1500,
          delay: delay,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 1500 + Math.random() * 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top,
          left,
          opacity,
          transform: [{ scale: Animated.multiply(opacity, 1.2) }]
        },
      ]}
    />
  );
};

const CelestialBackground = ({ children }) => {
  const stars = useMemo(() => {
    const starArray = [];
    for (let i = 0; i < 60; i++) {
      starArray.push({
        id: i,
        size: Math.random() * 2.5 + 1.2,
        top: Math.random() * height,
        left: Math.random() * width,
        delay: Math.random() * 3000,
      });
    }
    return starArray;
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#050510', '#101025', '#050510']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative Glows */}
      <View style={[styles.glow, { top: -100, left: -100, backgroundColor: 'rgba(48, 43, 99, 0.3)' }]} />
      <View style={[styles.glow, { bottom: -150, right: -150, backgroundColor: 'rgba(36, 36, 62, 0.2)' }]} />

      {stars.map((star) => (
        <TwinklingStar key={star.id} {...star} />
      ))}
      <View style={styles.overlay}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  glow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.5,
  },
  overlay: {
    flex: 1,
  },
});

export default CelestialBackground;
