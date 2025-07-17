import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ServicesScreen } from './src/screens/ServicesScreen';
import { COLORS } from './src/constants/theme';

type AppState = 'loading' | 'welcome' | 'auth' | 'home' | 'services';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched) {
        setIsFirstLaunch(false);
        // Check if user is authenticated
        const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
          setAppState('home');
        } else {
          setAppState('auth');
        }
      } else {
        setAppState('welcome');
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setAppState('welcome');
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      setIsFirstLaunch(false);
      setAppState('auth');
    } catch (error) {
      console.error('Error setting first launch:', error);
      setAppState('auth');
    }
  };

  const handleAuthSuccess = async () => {
    try {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      setAppState('home');
    } catch (error) {
      console.error('Error setting authentication:', error);
      setAppState('home');
    }
  };

  const handleNavigation = (screen: string) => {
    switch (screen) {
      case 'home':
        setAppState('home');
        break;
      case 'services':
        setAppState('services');
        break;
      case 'auth':
        setAppState('auth');
        break;
      case 'welcome':
        setAppState('welcome');
        break;
      default:
        // For other screens like 'checkout', 'support', etc.
        // You can add more screens here or show a placeholder
        console.log(`Navigate to: ${screen}`);
        break;
    }
  };

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      case 'auth':
        return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
      case 'home':
        return <HomeScreen onNavigate={handleNavigation} />;
      case 'services':
        return <ServicesScreen onNavigate={handleNavigation} />;
      default:
        return <View style={styles.container} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor={COLORS.primary} />
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
