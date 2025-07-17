import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  gradient = true,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[`${size}Button`],
    };

    if (variant === 'outline') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
      };
    }

    if (variant === 'ghost') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    }

    if (variant === 'secondary') {
      return {
        ...baseStyle,
        backgroundColor: COLORS.secondary,
      };
    }

    return {
      ...baseStyle,
      backgroundColor: gradient ? 'transparent' : COLORS.primary,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.buttonText,
      ...styles[`${size}Text`],
    };

    if (variant === 'outline') {
      return {
        ...baseStyle,
        color: COLORS.primary,
      };
    }

    if (variant === 'ghost') {
      return {
        ...baseStyle,
        color: COLORS.primary,
      };
    }

    return {
      ...baseStyle,
      color: COLORS.textInverse,
    };
  };

  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.textInverse}
          style={styles.loader}
        />
      )}
      {icon && !loading && <>{icon}</>}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </>
  );

  const buttonStyle = [getButtonStyle(), style, disabled && styles.disabled];

  if (gradient && variant === 'primary') {
    return (
      <Animatable.View animation="pulse" iterationCount="infinite" direction="alternate">
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || loading}
          style={buttonStyle}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={COLORS.gradient.primary}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ButtonContent />
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyle}
      activeOpacity={0.8}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOWS.light,
  },
  gradient: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  smallButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minHeight: 32,
  },
  mediumButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 48,
  },
  largeButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  buttonText: {
    ...TYPOGRAPHY.button,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  loader: {
    marginRight: SPACING.xs,
  },
});