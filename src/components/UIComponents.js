import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const GlassInput = ({ label, value, onChangeText, placeholder, multiline, keyboardType }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.inputContainer]}>
      <Text style={[styles.label, { color: theme.primary }]}>{label}</Text>
      <TextInput
        style={[styles.input, {
          backgroundColor: theme.surface,
          color: theme.text,
          borderColor: theme.border,
        }, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const GlassButton = ({ title, onPress, style, variant = 'primary', disabled }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled
            ? 'rgba(128, 128, 128, 0.5)'
            : variant === 'accent'
              ? theme.accent
              : variant === 'secondary'
                ? theme.buttonSecondary
                : theme.buttonPrimary,
          borderColor: variant === 'secondary' ? theme.primary : 'transparent',
          borderWidth: variant === 'secondary' ? 2 : 0,
        },
        disabled && styles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <Text style={[
        styles.buttonText,
        { color: variant === 'secondary' ? theme.primary : '#fff' },
        disabled && styles.buttonTextDisabled
      ]}>{title}</Text>
    </TouchableOpacity>
  );
};

const GlassCard = ({ children, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    }, style]}>
      {children}
    </View>
  );
};

const InputSelector = ({ options, selected, onSelect, labels }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.selectorContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.selectorButton,
            { backgroundColor: theme.surface, borderColor: theme.border },
            selected === option && {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
            }
          ]}
          onPress={() => onSelect(option)}
        >
          <Text style={[
            styles.selectorText,
            { color: selected === option ? '#fff' : theme.text },
            selected === option && { fontWeight: '700' }
          ]}>
            {labels ? labels[index] : option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const NumberInput = ({ label, value, onChangeText, min, max }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.numberInputContainer}>
      <Text style={[styles.label, { color: theme.primary }]}>{label}</Text>
      <View style={styles.numberInputRow}>
        <TouchableOpacity
          style={[styles.numberButton, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 2 }]}
          onPress={() => {
            const newVal = Math.max(min, value - 1);
            onChangeText(newVal);
          }}
        >
          <Text style={[styles.numberButtonText, { color: theme.primary }]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.numberValue, { color: theme.primary }]}>{value}</Text>
        <TouchableOpacity
          style={[styles.numberButton, { backgroundColor: theme.primary, borderWidth: 0 }]}
          onPress={() => {
            const newVal = Math.min(max, value + 1);
            onChangeText(newVal);
          }}
        >
          <Text style={[styles.numberButtonText, { color: '#fff' }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ResultBox = ({ title, content, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.resultBox, {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    }, style]}>
      {title && <Text style={[styles.resultTitle, { color: theme.textSecondary }]}>{title}</Text>}
      <Text style={[styles.resultContent, { color: theme.text }]}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonSecondary: {
    borderWidth: 2,
  },
  buttonDanger: {
  },
  buttonDisabled: {
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  buttonTextDisabled: {
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  selectorButton: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  selectorButtonActive: {},
  selectorText: {
    fontSize: 14,
    fontWeight: '700',
  },
  selectorTextActive: {},
  numberInputContainer: {
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  numberInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  numberButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  numberValue: {
    fontSize: 40,
    fontWeight: '900',
    marginHorizontal: 40,
    minWidth: 60,
    textAlign: 'center',
  },
  resultBox: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  resultContent: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
});

export { GlassInput, GlassButton, GlassCard, InputSelector, NumberInput, ResultBox };
