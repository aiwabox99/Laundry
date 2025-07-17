import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string[];
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Premium Laundry Service',
    description: 'Professional cleaning with eco-friendly products delivered to your door',
    icon: 'shirt-outline',
    color: COLORS.gradient.primary,
  },
  {
    id: '2',
    title: 'Choose Your Staff',
    description: 'Select from our skilled professionals based on ratings and specializations',
    icon: 'people-outline',
    color: COLORS.gradient.secondary,
  },
  {
    id: '3',
    title: 'Eco-Friendly Rewards',
    description: 'Earn eco-points with every service and help save water while getting rewards',
    icon: 'leaf-outline',
    color: COLORS.gradient.cool,
  },
];

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      onGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const renderOnboardingItem = (item: OnboardingItem, index: number) => (
    <View key={item.id} style={styles.slide}>
      <LinearGradient colors={item.color} style={styles.iconContainer}>
        <Ionicons name={item.icon} size={80} color={COLORS.textInverse} />
      </LinearGradient>
      
      <Animatable.View
        animation="fadeInUp"
        delay={300}
        style={styles.textContainer}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animatable.View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentIndex ? COLORS.primary : COLORS.textLight,
              width: index === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={COLORS.gradient.primary} style={styles.header}>
        <Animatable.View animation="bounceIn" delay={500}>
          <Text style={styles.logo}>Cleanic</Text>
          <Text style={styles.subtitle}>Premium Laundry Service</Text>
        </Animatable.View>
      </LinearGradient>

      {/* Onboarding Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => renderOnboardingItem(item, index))}
      </ScrollView>

      {/* Pagination */}
      {renderPagination()}

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <Button
              title="Previous"
              onPress={handlePrevious}
              variant="outline"
              style={styles.button}
            />
          )}
          
          <Button
            title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            style={[styles.button, { flex: currentIndex === 0 ? 1 : 0.6 }]}
          />
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Safe & Secure</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.featureText}>24/7 Service</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="star" size={20} color={COLORS.accent} />
            <Text style={styles.featureText}>5-Star Rated</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  logo: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textInverse,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  button: {
    flex: 0.48,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});