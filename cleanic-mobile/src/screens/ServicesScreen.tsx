import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

interface ServicesScreenProps {
  onNavigate: (screen: string) => void;
}

const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 249,
    weight: '30KG',
    features: ['Monthly pickup', 'Basic wash & fold', 'Standard delivery', 'Email support'],
    popular: false,
    color: COLORS.gradient.primary,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    weight: '40KG',
    features: ['Bi-weekly pickup', 'Premium wash & fold', 'Priority delivery', 'Phone support', 'Express option'],
    popular: true,
    color: COLORS.gradient.secondary,
  },
  {
    id: 'family',
    name: 'Family',
    price: 399,
    weight: '55KG',
    features: ['Weekly pickup', 'All services included', 'Express delivery', '24/7 support', 'Stain removal'],
    popular: false,
    color: COLORS.gradient.accent,
  },
  {
    id: 'family-plus',
    name: 'Family Plus',
    price: 499,
    weight: '70KG',
    features: ['Twice weekly pickup', 'Premium services', 'Same-day delivery', 'Dedicated support', 'Eco-friendly'],
    popular: false,
    color: COLORS.gradient.cool,
  },
  {
    id: 'business',
    name: 'Business',
    price: 799,
    weight: '100KG',
    features: ['Daily pickup', 'Commercial grade', 'Bulk discounts', 'Account manager', 'Custom schedule'],
    popular: false,
    color: COLORS.gradient.warm,
  },
];

const payAsYouGoServices = [
  {
    id: 'shoes',
    name: 'Shoe/Sneaker Cleaning',
    price: 45,
    unit: 'pair',
    icon: 'footsteps-outline',
    description: 'Professional cleaning for all types of shoes and sneakers',
    duration: '24 hours',
  },
  {
    id: 'carpet',
    name: 'Carpet Cleaning',
    price: 199,
    unit: '2m²',
    icon: 'home-outline',
    description: 'Deep cleaning for carpets and rugs',
    duration: '48 hours',
  },
  {
    id: 'mattress',
    name: 'Mattress Cleaning',
    price: 399,
    unit: 'item',
    icon: 'bed-outline',
    description: 'Sanitization and deep cleaning of mattresses',
    duration: '72 hours',
  },
];

const staffMembers = [
  {
    id: 'john',
    name: 'John Doe',
    rating: 4.8,
    experience: '5 years',
    specializations: ['Delicate fabrics', 'Stain removal'],
    avatar: '👨‍💼',
    available: true,
  },
  {
    id: 'sarah',
    name: 'Sarah Johnson',
    rating: 4.6,
    experience: '3 years',
    specializations: ['Express service', 'Eco-friendly'],
    avatar: '👩‍💼',
    available: true,
  },
  {
    id: 'mike',
    name: 'Mike Wilson',
    rating: 4.9,
    experience: '7 years',
    specializations: ['Business accounts', 'Bulk orders'],
    avatar: '👨‍🔧',
    available: false,
  },
];

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ onNavigate }) => {
  const [selectedTab, setSelectedTab] = useState<'subscription' | 'payasyougo' | 'staff'>('subscription');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    const plan = subscriptionPlans.find(p => p.id === planId);
    Alert.alert(
      'Confirm Subscription',
      `Subscribe to ${plan?.name} plan for R${plan?.price}/month?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Subscribe', onPress: () => onNavigate('checkout') },
      ]
    );
  };

  const handleServiceOrder = (serviceId: string) => {
    const service = payAsYouGoServices.find(s => s.id === serviceId);
    Alert.alert(
      'Order Service',
      `Order ${service?.name} for R${service?.price}/${service?.unit}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Order', onPress: () => onNavigate('checkout') },
      ]
    );
  };

  const handleStaffSelection = (staffId: string) => {
    setSelectedStaff(staffId);
    const staff = staffMembers.find(s => s.id === staffId);
    Alert.alert(
      'Staff Selected',
      `${staff?.name} has been selected as your preferred staff member.`,
      [{ text: 'OK' }]
    );
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'subscription' && styles.activeTab]}
        onPress={() => setSelectedTab('subscription')}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={selectedTab === 'subscription' ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.tabText, selectedTab === 'subscription' && styles.activeTabText]}>
          Subscriptions
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'payasyougo' && styles.activeTab]}
        onPress={() => setSelectedTab('payasyougo')}
      >
        <Ionicons
          name="card-outline"
          size={20}
          color={selectedTab === 'payasyougo' ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.tabText, selectedTab === 'payasyougo' && styles.activeTabText]}>
          Pay as You Go
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'staff' && styles.activeTab]}
        onPress={() => setSelectedTab('staff')}
      >
        <Ionicons
          name="people-outline"
          size={20}
          color={selectedTab === 'staff' ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.tabText, selectedTab === 'staff' && styles.activeTabText]}>
          Staff
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSubscriptionPlans = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Choose Your Plan</Text>
      <Text style={styles.sectionDescription}>
        Save money with our monthly subscription plans. All plans include pickup and delivery.
      </Text>
      
      {subscriptionPlans.map((plan, index) => (
        <Animatable.View key={plan.id} animation="fadeInUp" delay={index * 100}>
          <Card
            animated
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedPlanCard,
            ]}
          >
            <TouchableOpacity
              style={styles.planContent}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planWeight}>{plan.weight} per month</Text>
                </View>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>R{plan.price}</Text>
                  <Text style={styles.planPeriod}>/month</Text>
                </View>
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.planFeatures}>
                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.feature}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              <Button
                title={selectedPlan === plan.id ? 'Selected' : 'Subscribe'}
                onPress={() => handleSubscribe(plan.id)}
                variant={selectedPlan === plan.id ? 'secondary' : 'primary'}
                style={styles.subscribeButton}
              />
            </TouchableOpacity>
          </Card>
        </Animatable.View>
      ))}
    </View>
  );

  const renderPayAsYouGo = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Pay as You Go Services</Text>
      <Text style={styles.sectionDescription}>
        One-time services for specific cleaning needs. No commitment required.
      </Text>
      
      {payAsYouGoServices.map((service, index) => (
        <Animatable.View key={service.id} animation="fadeInLeft" delay={index * 150}>
          <Card animated style={styles.serviceCard}>
            <View style={styles.serviceContent}>
              <View style={styles.serviceIcon}>
                <Ionicons name={service.icon} size={32} color={COLORS.primary} />
              </View>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <View style={styles.serviceDetails}>
                  <Text style={styles.servicePrice}>R{service.price}/{service.unit}</Text>
                  <Text style={styles.serviceDuration}>• {service.duration}</Text>
                </View>
              </View>
              
              <Button
                title="Order"
                onPress={() => handleServiceOrder(service.id)}
                size="small"
                style={styles.orderButton}
              />
            </View>
          </Card>
        </Animatable.View>
      ))}
      
      <Card animated style={styles.promoCard}>
        <LinearGradient colors={COLORS.gradient.cool} style={styles.promoContent}>
          <Ionicons name="gift-outline" size={24} color={COLORS.textInverse} />
          <View style={styles.promoInfo}>
            <Text style={styles.promoTitle}>Special Offer</Text>
            <Text style={styles.promoText}>Use code CARPET10 for 10% off carpet cleaning</Text>
          </View>
        </LinearGradient>
      </Card>
    </View>
  );

  const renderStaff = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Choose Your Staff</Text>
      <Text style={styles.sectionDescription}>
        Select from our experienced professionals based on their specializations and ratings.
      </Text>
      
      {staffMembers.map((staff, index) => (
        <Animatable.View key={staff.id} animation="fadeInRight" delay={index * 100}>
          <Card
            animated
            style={[
              styles.staffCard,
              selectedStaff === staff.id && styles.selectedStaffCard,
              !staff.available && styles.unavailableStaffCard,
            ]}
          >
            <TouchableOpacity
              style={styles.staffContent}
              onPress={() => staff.available && handleStaffSelection(staff.id)}
              disabled={!staff.available}
            >
              <View style={styles.staffAvatar}>
                <Text style={styles.avatarText}>{staff.avatar}</Text>
              </View>
              
              <View style={styles.staffInfo}>
                <View style={styles.staffHeader}>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  <View style={styles.staffRating}>
                    <Ionicons name="star" size={16} color={COLORS.accent} />
                    <Text style={styles.ratingText}>{staff.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.staffExperience}>{staff.experience} experience</Text>
                
                <View style={styles.specializations}>
                  {staff.specializations.map((spec, idx) => (
                    <View key={idx} style={styles.specializationTag}>
                      <Text style={styles.specializationText}>{spec}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.staffStatus}>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: staff.available ? COLORS.success : COLORS.error }
                  ]} />
                  <Text style={styles.statusText}>
                    {staff.available ? 'Available' : 'Busy'}
                  </Text>
                </View>
              </View>
              
              {selectedStaff === staff.id && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              )}
            </TouchableOpacity>
          </Card>
        </Animatable.View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradient.primary} style={styles.header}>
        <Text style={styles.headerTitle}>Our Services</Text>
        <Text style={styles.headerSubtitle}>Professional cleaning at your fingertips</Text>
      </LinearGradient>
      
      {renderTabBar()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedTab === 'subscription' && renderSubscriptionPlans()}
        {selectedTab === 'payasyougo' && renderPayAsYouGo()}
        {selectedTab === 'staff' && renderStaff()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textInverse,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    ...SHADOWS.medium,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  activeTab: {
    backgroundColor: COLORS.primaryLight,
  },
  tabText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontSize: 12,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  planCard: {
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlanCard: {
    borderColor: COLORS.primary,
  },
  planContent: {
    padding: 0,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    ...TYPOGRAPHY.h5,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  planWeight: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  planPeriod: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  popularBadge: {
    position: 'absolute',
    top: -SPACING.sm,
    right: -SPACING.sm,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  popularText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textInverse,
    fontWeight: 'bold',
  },
  planFeatures: {
    marginBottom: SPACING.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  featureText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  subscribeButton: {
    marginTop: SPACING.sm,
  },
  serviceCard: {
    marginBottom: SPACING.md,
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
  serviceName: {
    ...TYPOGRAPHY.h6,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  serviceDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicePrice: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  serviceDuration: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  orderButton: {
    minWidth: 80,
  },
  promoCard: {
    marginTop: SPACING.md,
    padding: 0,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  promoInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  promoTitle: {
    ...TYPOGRAPHY.h6,
    color: COLORS.textInverse,
    marginBottom: SPACING.xs,
  },
  promoText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textInverse,
    opacity: 0.9,
  },
  staffCard: {
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedStaffCard: {
    borderColor: COLORS.success,
  },
  unavailableStaffCard: {
    opacity: 0.6,
  },
  staffContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 24,
  },
  staffInfo: {
    flex: 1,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  staffName: {
    ...TYPOGRAPHY.h6,
    color: COLORS.text,
  },
  staffRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  staffExperience: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  specializations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  specializationTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  specializationText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  staffStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});