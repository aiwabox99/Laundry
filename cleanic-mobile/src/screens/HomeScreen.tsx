import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const quickActions = [
  { id: 'wash', title: 'Wash & Fold', icon: 'shirt-outline', color: COLORS.gradient.primary },
  { id: 'dry', title: 'Dry Clean', icon: 'sparkles-outline', color: COLORS.gradient.secondary },
  { id: 'shoes', title: 'Shoe Clean', icon: 'footsteps-outline', color: COLORS.gradient.accent },
  { id: 'carpet', title: 'Carpet Clean', icon: 'home-outline', color: COLORS.gradient.cool },
];

const services = [
  {
    id: 'subscription',
    title: 'Subscription Plans',
    description: 'Save money with our monthly plans',
    icon: 'calendar-outline',
    price: 'From R249/month',
    popular: true,
  },
  {
    id: 'express',
    title: 'Express Service',
    description: '3-hour delivery available',
    icon: 'flash-outline',
    price: '+R99',
    popular: false,
  },
  {
    id: 'eco',
    title: 'Eco-Friendly',
    description: 'Earn points while saving water',
    icon: 'leaf-outline',
    price: 'Earn Points',
    popular: false,
  },
];

const promotions = [
  {
    id: 'welcome',
    title: 'Welcome Bonus',
    description: 'R50 off your first order',
    code: 'WELCOME50',
    color: COLORS.gradient.warm,
  },
  {
    id: 'carpet',
    title: 'Carpet Special',
    description: '10% off carpet cleaning',
    code: 'CARPET10',
    color: COLORS.gradient.cool,
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userStats] = useState({
    name: 'John Doe',
    ecoPoints: 125,
    waterSaved: 1250, // liters
    ordersCompleted: 8,
    subscriptionPlan: 'Pro',
    nextPickup: '2024-01-20',
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderHeader = () => (
    <LinearGradient colors={COLORS.gradient.primary} style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{userStats.name}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.textInverse} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Ionicons name="leaf" size={20} color={COLORS.textInverse} />
          <Text style={styles.statValue}>{userStats.ecoPoints}</Text>
          <Text style={styles.statLabel}>Eco Points</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="water" size={20} color={COLORS.textInverse} />
          <Text style={styles.statValue}>{userStats.waterSaved}L</Text>
          <Text style={styles.statLabel}>Water Saved</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.textInverse} />
          <Text style={styles.statValue}>{userStats.ordersCompleted}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <Animatable.View
            key={action.id}
            animation="fadeInUp"
            delay={index * 100}
            style={styles.quickActionWrapper}
          >
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => onNavigate('services')}
            >
              <LinearGradient colors={action.color} style={styles.quickActionIcon}>
                <Ionicons name={action.icon} size={28} color={COLORS.textInverse} />
              </LinearGradient>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </View>
  );

  const renderServices = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Our Services</Text>
      {services.map((service, index) => (
        <Card key={service.id} animated animation="fadeInLeft" style={styles.serviceCard}>
          <TouchableOpacity
            style={styles.serviceContent}
            onPress={() => onNavigate('services')}
          >
            <View style={styles.serviceIcon}>
              <Ionicons name={service.icon} size={32} color={COLORS.primary} />
            </View>
            <View style={styles.serviceInfo}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                {service.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                )}
              </View>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );

  const renderPromotions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Special Offers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {promotions.map((promo, index) => (
          <Animatable.View
            key={promo.id}
            animation="fadeInRight"
            delay={index * 200}
            style={styles.promotionWrapper}
          >
            <LinearGradient colors={promo.color} style={styles.promotionCard}>
              <Text style={styles.promotionTitle}>{promo.title}</Text>
              <Text style={styles.promotionDescription}>{promo.description}</Text>
              <View style={styles.promotionCode}>
                <Text style={styles.promotionCodeText}>{promo.code}</Text>
              </View>
            </LinearGradient>
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );

  const renderSubscriptionStatus = () => (
    <Card animated style={styles.subscriptionCard}>
      <View style={styles.subscriptionHeader}>
        <View style={styles.subscriptionIcon}>
          <Ionicons name="star" size={24} color={COLORS.accent} />
        </View>
        <View style={styles.subscriptionInfo}>
          <Text style={styles.subscriptionTitle}>Current Plan: {userStats.subscriptionPlan}</Text>
          <Text style={styles.subscriptionNext}>Next pickup: {userStats.nextPickup}</Text>
        </View>
      </View>
      <Button
        title="Manage Subscription"
        onPress={() => onNavigate('subscription')}
        variant="outline"
        size="small"
      />
    </Card>
  );

  const renderFloatingAction = () => (
    <Animatable.View
      animation="pulse"
      iterationCount="infinite"
      style={styles.floatingAction}
    >
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => onNavigate('order')}
      >
        <LinearGradient colors={COLORS.gradient.primary} style={styles.floatingGradient}>
          <Ionicons name="add" size={28} color={COLORS.textInverse} />
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderQuickActions()}
        {renderServices()}
        {renderPromotions()}
        {renderSubscriptionStatus()}
        
        {/* Emergency Contact */}
        <Card animated style={styles.emergencyCard}>
          <View style={styles.emergencyContent}>
            <Ionicons name="headset" size={24} color={COLORS.primary} />
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyTitle}>Need Help?</Text>
              <Text style={styles.emergencyText}>24/7 Customer Support</Text>
            </View>
            <Button
              title="Contact"
              onPress={() => onNavigate('support')}
              variant="outline"
              size="small"
            />
          </View>
        </Card>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {renderFloatingAction()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textInverse,
    opacity: 0.9,
  },
  userName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textInverse,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: SPACING.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textInverse,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h6,
    color: COLORS.textInverse,
    fontWeight: 'bold',
    marginTop: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textInverse,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  section: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionWrapper: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.light,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  serviceCard: {
    marginBottom: SPACING.sm,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  serviceTitle: {
    ...TYPOGRAPHY.h6,
    color: COLORS.text,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  popularText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textInverse,
    fontWeight: 'bold',
  },
  serviceDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  servicePrice: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
  promotionWrapper: {
    marginRight: SPACING.md,
  },
  promotionCard: {
    width: width * 0.7,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
  },
  promotionTitle: {
    ...TYPOGRAPHY.h6,
    color: COLORS.textInverse,
    marginBottom: SPACING.xs,
  },
  promotionDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textInverse,
    opacity: 0.9,
    marginBottom: SPACING.md,
  },
  promotionCode: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xs,
    alignSelf: 'flex-start',
  },
  promotionCodeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textInverse,
    fontWeight: 'bold',
  },
  subscriptionCard: {
    marginBottom: SPACING.md,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  subscriptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    ...TYPOGRAPHY.h6,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subscriptionNext: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  emergencyCard: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  emergencyTitle: {
    ...TYPOGRAPHY.h6,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emergencyText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  floatingAction: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    ...SHADOWS.heavy,
  },
  floatingGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});