import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: 'light' | 'medium' | 'heavy';
  animated?: boolean;
  animation?: string;
  padding?: keyof typeof SPACING;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  shadow = 'medium',
  animated = false,
  animation = 'fadeInUp',
  padding = 'md',
}) => {
  const cardStyle = [
    styles.card,
    SHADOWS[shadow],
    { padding: SPACING[padding] },
    style,
  ];

  if (animated) {
    return (
      <Animatable.View animation={animation} style={cardStyle}>
        {children}
      </Animatable.View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
});