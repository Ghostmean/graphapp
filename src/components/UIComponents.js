/**
 * UI компоненты приложения.
 * Содержит переиспользуемые компоненты пользовательского интерфейса.
 * 
 * Компоненты:
 * - GlassInput: Поле ввода с стилизацией под стекло
 * - GlassButton: Кнопка с анимацией нажатия
 * - GlassCard: Карточка с стилизацией под стекло
 * - InputSelector: Переключатель опций
 * - NumberInput: Поле ввода числа с кнопками +/-
 * - ResultBox: Блок для отображения результата
 */
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * Поле ввода с стилизацией под стекло.
 * 
 * @param {string} label - Метка поля
 * @param {string} value - Значение поля
 * @param {function} onChangeText - Обработчик изменения текста
 * @param {string} placeholder - Заполнитель
 * @param {boolean} multiline - Многострочный режим
 * @param {string} keyboardType - Тип клавиатуры
 * @returns {View} Поле ввода
 */
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

/**
 * Кнопка с анимацией при нажатии и эффектом ripple.
 * Поддерживает несколько вариантов: primary, accent, secondary.
 * 
 * @param {string} title - Текст кнопки
 * @param {function} onPress - Обработчик нажатия
 * @param {object} style - Дополнительные стили
 * @param {string} variant - Вариант кнопки (primary, accent, secondary)
 * @param {boolean} disabled - Флаг отключения кнопки
 * @returns {TouchableOpacity} Кнопка
 */
const GlassButton = ({ title, onPress, style, variant = 'primary', disabled }) => {
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rippleAnim = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getColors = () => {
    if (disabled) return { bg: 'rgba(128, 128, 128, 0.5)', text: 'rgba(255, 255, 255, 0.5)', ripple: 'transparent' };
    if (variant === 'accent') {
      return { bg: theme.accent, text: '#fff', ripple: 'rgba(255,255,255,0.4)' };
    }
    if (variant === 'secondary') {
      return { bg: 'transparent', text: theme.primary, ripple: theme.primary };
    }
    return { bg: theme.buttonPrimary, text: '#fff', ripple: 'rgba(255,255,255,0.3)' };
  };

  const colors = getColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: colors.bg,
            borderColor: variant === 'secondary' ? theme.primary : 'transparent',
            borderWidth: variant === 'secondary' ? 2 : 0,
            transform: [{ scale: scaleAnim }],
          },
          disabled && styles.buttonDisabled,
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.ripple,
            {
              backgroundColor: colors.ripple,
              opacity: rippleAnim,
              transform: [{ scale: rippleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.5] }) }],
            },
          ]}
        />
        <Text style={[styles.buttonText, { color: colors.text }, disabled && styles.buttonTextDisabled]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

/**
 * Карточка с стилизацией под стекло.
 * Используется для группировки контента.
 * 
 * @param {React.ReactNode} children - Дочерние элементы
 * @param {object} style - Дополнительные стили
 * @returns {View} Карточка
 */
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

/**
 * Переключатель опций.
 * Позволяет выбрать одну из нескольких опций.
 * 
 * @param {string[]} options - Массив значений опций
 * @param {string} selected - Выбранная опция
 * @param {function} onSelect - Обработчик выбора
 * @param {string[]} labels - Метки для отображения
 * @returns {View} Контейнер с переключателем
 */
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

/**
 * Поле ввода числа с кнопками инкремента и декремента.
 * Позволяет изменять число в заданном диапазоне.
 * 
 * @param {string} label - Метка поля
 * @param {number} value - Текущее значение
 * @param {function} onChangeText - Обработчик изменения
 * @param {number} min - Минимальное значение
 * @param {number} max - Максимальное значение
 * @returns {View} Поле ввода числа
 */
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

/**
 * Блок для отображения результата.
 * Показывает заголовок и содержание результата.
 * 
 * @param {string} title - Заголовок результата
 * @param {string} content - Содержание результата
 * @param {object} style - Дополнительные стили
 * @returns {View} Блок результата
 */
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
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
  },
  buttonSecondary: {
    borderWidth: 2,
  },
  buttonDanger: {
  },
  buttonDisabled: {
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

/** Экспорт UI компонентов */
export { GlassInput, GlassButton, GlassCard, InputSelector, NumberInput, ResultBox };
