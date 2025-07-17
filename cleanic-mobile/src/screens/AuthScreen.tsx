import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'register' | 'verify';
type Language = 'en' | 'af' | 'zu' | 'xh';

const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  af: { name: 'Afrikaans', flag: '🇿🇦' },
  zu: { name: 'Zulu', flag: '🇿🇦' },
  xh: { name: 'Xhosa', flag: '🇿🇦' },
};

const translations = {
  en: {
    welcome: 'Welcome to Cleanic',
    subtitle: 'Premium Laundry Service',
    login: 'Login',
    register: 'Register',
    phoneNumber: 'Phone Number',
    phonePlaceholder: '+27 XX XXX XXXX',
    fullName: 'Full Name',
    namePlaceholder: 'Enter your full name',
    verificationCode: 'Verification Code',
    codePlaceholder: 'Enter 6-digit code',
    sendCode: 'Send Code',
    verifyCode: 'Verify Code',
    resendCode: 'Resend Code',
    switchToLogin: 'Already have an account? Login',
    switchToRegister: 'Don\'t have an account? Register',
    language: 'Language',
    codeSent: 'Verification code sent to',
    invalidPhone: 'Please enter a valid phone number',
    invalidName: 'Please enter your full name',
    invalidCode: 'Please enter the 6-digit verification code',
  },
  af: {
    welcome: 'Welkom by Cleanic',
    subtitle: 'Premium Wasdiens',
    login: 'Teken In',
    register: 'Registreer',
    phoneNumber: 'Telefoonnommer',
    phonePlaceholder: '+27 XX XXX XXXX',
    fullName: 'Volle Naam',
    namePlaceholder: 'Voer jou volle naam in',
    verificationCode: 'Verifikasiekode',
    codePlaceholder: 'Voer 6-syfer kode in',
    sendCode: 'Stuur Kode',
    verifyCode: 'Verifieer Kode',
    resendCode: 'Stuur Kode Weer',
    switchToLogin: 'Het reeds \'n rekening? Teken In',
    switchToRegister: 'Het nie \'n rekening nie? Registreer',
    language: 'Taal',
    codeSent: 'Verifikasiekode gestuur na',
    invalidPhone: 'Voer asseblief \'n geldige telefoonnommer in',
    invalidName: 'Voer asseblief jou volle naam in',
    invalidCode: 'Voer asseblief die 6-syfer verifikasiekode in',
  },
  zu: {
    welcome: 'Sawubona ku-Cleanic',
    subtitle: 'Isevisi Yokuhlanza Ephakeme',
    login: 'Ngena',
    register: 'Bhalisa',
    phoneNumber: 'Inombolo Yocingo',
    phonePlaceholder: '+27 XX XXX XXXX',
    fullName: 'Igama Eligcwele',
    namePlaceholder: 'Faka igama lakho eligcwele',
    verificationCode: 'Ikhodi Yokuqinisekisa',
    codePlaceholder: 'Faka ikhodi yezinombolo ezi-6',
    sendCode: 'Thumela Ikhodi',
    verifyCode: 'Qinisekisa Ikhodi',
    resendCode: 'Phinda Uthumele Ikhodi',
    switchToLogin: 'Usunayo i-akhawunti? Ngena',
    switchToRegister: 'Awunayo i-akhawunti? Bhalisa',
    language: 'Ulimi',
    codeSent: 'Ikhodi yokuqinisekisa ithunyelwe ku',
    invalidPhone: 'Sicela ufake inombolo yocingo evumelekile',
    invalidName: 'Sicela ufake igama lakho eligcwele',
    invalidCode: 'Sicela ufake ikhodi yokuqinisekisa yezinombolo ezi-6',
  },
  xh: {
    welcome: 'Wamkelekile ku-Cleanic',
    subtitle: 'Inkonzo Yokuhlamba Ephakamileyo',
    login: 'Ngena',
    register: 'Bhalisa',
    phoneNumber: 'Inombolo Yomnxeba',
    phonePlaceholder: '+27 XX XXX XXXX',
    fullName: 'Igama Elipheleleyo',
    namePlaceholder: 'Faka igama lakho elipheleleyo',
    verificationCode: 'Ikhowudi Yokuqinisekisa',
    codePlaceholder: 'Faka ikhowudi yeenombolo ezi-6',
    sendCode: 'Thumela Ikhowudi',
    verifyCode: 'Qinisekisa Ikhowudi',
    resendCode: 'Phinda Uthumele Ikhowudi',
    switchToLogin: 'Unayo i-akhawunti? Ngena',
    switchToRegister: 'Awunayo i-akhawunti? Bhalisa',
    language: 'Ulwimi',
    codeSent: 'Ikhowudi yokuqinisekisa ithunyelwe ku',
    invalidPhone: 'Nceda ufake inombolo yomnxeba esebenzayo',
    invalidName: 'Nceda ufake igama lakho elipheleleyo',
    invalidCode: 'Nceda ufake ikhowudi yokuqinisekisa yeenombolo ezi-6',
  },
};

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [language, setLanguage] = useState<Language>('en');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const t = translations[language];

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+27[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const validateCode = (code: string) => {
    return code.length === 6 && /^\d+$/.test(code);
  };

  const handleSendCode = async () => {
    setErrors({});
    
    if (!validatePhoneNumber(phoneNumber)) {
      setErrors({ phone: t.invalidPhone });
      return;
    }

    if (mode === 'register' && !validateName(fullName)) {
      setErrors({ name: t.invalidName });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Success', `${t.codeSent} ${phoneNumber}`);
      setMode('verify');
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setErrors({});
    
    if (!validateCode(verificationCode)) {
      setErrors({ code: t.invalidCode });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit code
      onAuthSuccess();
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // If it starts with 27, keep it, otherwise add +27
    if (cleaned.startsWith('27')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+27${cleaned.substring(1)}`;
    } else {
      return `+27${cleaned}`;
    }
  };

  const renderLanguageSelector = () => (
    <Card animated style={styles.languageCard}>
      <Text style={styles.languageTitle}>{t.language}</Text>
      {Object.entries(languages).map(([code, lang]) => (
        <TouchableOpacity
          key={code}
          style={[
            styles.languageOption,
            language === code && styles.selectedLanguage,
          ]}
          onPress={() => {
            setLanguage(code as Language);
            setShowLanguageSelector(false);
          }}
        >
          <Text style={styles.languageFlag}>{lang.flag}</Text>
          <Text style={styles.languageName}>{lang.name}</Text>
          {language === code && (
            <Ionicons name="checkmark" size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      ))}
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={COLORS.gradient.primary} style={styles.header}>
        <Animatable.View animation="fadeInDown" style={styles.headerContent}>
          <Text style={styles.logo}>Cleanic</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </Animatable.View>
        
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguageSelector(!showLanguageSelector)}
        >
          <Text style={styles.languageButtonText}>
            {languages[language].flag} {languages[language].name}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.textInverse} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showLanguageSelector && renderLanguageSelector()}

        <Animatable.View animation="fadeInUp" delay={300}>
          <Card animated style={styles.authCard}>
            <Text style={styles.welcomeText}>{t.welcome}</Text>
            
            {mode !== 'verify' && (
              <>
                <Input
                  label={t.phoneNumber}
                  placeholder={t.phonePlaceholder}
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                  keyboardType="phone-pad"
                  icon="call"
                  error={errors.phone}
                  maxLength={12}
                />

                {mode === 'register' && (
                  <Input
                    label={t.fullName}
                    placeholder={t.namePlaceholder}
                    value={fullName}
                    onChangeText={setFullName}
                    icon="person"
                    error={errors.name}
                  />
                )}

                <Button
                  title={t.sendCode}
                  onPress={handleSendCode}
                  loading={loading}
                  style={styles.button}
                />
              </>
            )}

            {mode === 'verify' && (
              <>
                <View style={styles.verificationInfo}>
                  <Ionicons name="mail" size={24} color={COLORS.primary} />
                  <Text style={styles.verificationText}>
                    {t.codeSent} {phoneNumber}
                  </Text>
                </View>

                <Input
                  label={t.verificationCode}
                  placeholder={t.codePlaceholder}
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="numeric"
                  icon="keypad"
                  error={errors.code}
                  maxLength={6}
                />

                <Button
                  title={t.verifyCode}
                  onPress={handleVerifyCode}
                  loading={loading}
                  style={styles.button}
                />

                <Button
                  title={t.resendCode}
                  onPress={handleSendCode}
                  variant="ghost"
                  style={styles.resendButton}
                />
              </>
            )}

            {mode !== 'verify' && (
              <TouchableOpacity
                style={styles.switchMode}
                onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                <Text style={styles.switchModeText}>
                  {mode === 'login' ? t.switchToRegister : t.switchToLogin}
                </Text>
              </TouchableOpacity>
            )}
          </Card>
        </Animatable.View>

        <View style={styles.footer}>
          <View style={styles.securityFeatures}>
            <View style={styles.securityFeature}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
              <Text style={styles.securityText}>Secure</Text>
            </View>
            <View style={styles.securityFeature}>
              <Ionicons name="lock-closed" size={20} color={COLORS.primary} />
              <Text style={styles.securityText}>Encrypted</Text>
            </View>
            <View style={styles.securityFeature}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
              <Text style={styles.securityText}>Verified</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logo: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textInverse,
    fontWeight: 'bold',
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textInverse,
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  languageButtonText: {
    color: COLORS.textInverse,
    marginRight: SPACING.xs,
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  languageCard: {
    marginBottom: SPACING.md,
  },
  languageTitle: {
    ...TYPOGRAPHY.h6,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  selectedLanguage: {
    backgroundColor: COLORS.primaryLight,
  },
  languageFlag: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  languageName: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    flex: 1,
  },
  authCard: {
    marginBottom: SPACING.xl,
  },
  welcomeText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  button: {
    marginTop: SPACING.md,
  },
  verificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  verificationText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    textAlign: 'center',
  },
  resendButton: {
    marginTop: SPACING.sm,
  },
  switchMode: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  switchModeText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: SPACING.xl,
  },
  securityFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  securityFeature: {
    alignItems: 'center',
  },
  securityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});