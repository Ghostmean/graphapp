/**
 * Контекст темы приложения.
 * Управляет светлой и темной темой, предоставляет компоненты переключения темы.
 * 
 * Функции:
 * - ThemeToggle: Кнопка переключения темы с анимацией
 * - ThemeProvider: Провайдер контекста темы
 * - useTheme: Хук для получения текущей темы
 */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useColorScheme, Animated, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Контекст для хранения состояния темы
 */
const ThemeContext = createContext();

const orangeDark = {
  /** Темная оранжевая цветовая схема */
  background: '#1a1209',
  surface: 'rgba(255, 255, 255, 0.08)',
  primary: '#FB923C',
  primaryLight: '#FDBA74',
  accent: '#22C55E',
  text: '#f88400',
  textSecondary: 'rgba(251, 146, 60, 0.7)',
  border: 'rgba(251, 146, 60, 0.3)',
  buttonPrimary: '#F97316',
  buttonSecondary: 'rgba(251, 146, 60, 0.2)',
  error: 'rgba(239, 68, 68, 0.2)',
  errorBorder: 'rgba(239, 68, 68, 0.5)',
  errorText: '#FCA5A5',
};

const orangeLight = {
  /** Светлая оранжевая цветовая схема */
  background: '#FFEDD5',
  surface: 'rgba(249, 115, 22, 0.1)',
  primary: '#EA580C',
  primaryLight: '#FB923C',
  accent: '#16A34A',
  text: '#7C2D12',
  textSecondary: 'rgba(124, 45, 18, 0.7)',
  border: 'rgba(249, 115, 22, 0.3)',
  buttonPrimary: '#EA580C',
  buttonSecondary: 'rgba(249, 115, 22, 0.15)',
  error: 'rgba(239, 68, 68, 0.15)',
  errorBorder: 'rgba(239, 68, 68, 0.4)',
  errorText: '#DC2626',
};

/**
 * Компонент переключателя темы.
 * Отображает анимированную кнопку для переключения между светлой и темной темой.
 * 
 * @param {boolean} isDark - Флаг текущей темы (true - темная)
 * @param {function} toggleTheme - Функция переключения темы
 * @returns {TouchableOpacity} Кнопка переключения темы
 */
export const ThemeToggle = ({ isDark, toggleTheme }) => {
  const translateAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(translateAnim, {
      toValue: isDark ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isDark]);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      style={[
        styles.toggleContainer,
        { backgroundColor: isDark ? 'rgba(251,146,60,0.3)' : 'rgba(249,115,22,0.3)' }
      ]}
    >
      <Animated.View
        style={[
          styles.toggleKnob,
          {
            backgroundColor: isDark ? '#FB923C' : '#EA580C',
            transform: [
              {
                translateX: translateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 26],
                }),
              },
            ],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    width: 56,
    height: 32,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});

/**
 * Провайдер контекста темы.
 * Оборачивает приложение и предоставляет доступ к теме через контекст.
 * 
 * @param {React.ReactNode} children - Дочерние компоненты
 * @returns {ThemeContext.Provider} Провайдер с значение темы
 */
export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(prev => !prev);

  const theme = isDark ? orangeDark : orangeLight;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Хук для получения текущей темы.
 * Используется в компонентах для доступа к теме.
 * 
 * @returns {object} Объект с theme, isDark и toggleTheme
 */
export const useTheme = () => useContext(ThemeContext);
