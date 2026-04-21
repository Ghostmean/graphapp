import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

const purpleDark = {
  background: '#1a1a2e',
  surface: 'rgba(255, 255, 255, 0.08)',
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  accent: '#22C55E',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  border: 'rgba(255, 255, 255, 0.15)',
  buttonPrimary: '#4F46E5',
  buttonSecondary: 'rgba(255, 255, 255, 0.1)',
  error: 'rgba(239, 68, 68, 0.2)',
  errorBorder: 'rgba(239, 68, 68, 0.5)',
  errorText: '#FCA5A5',
};

const purpleLight = {
  background: '#EEF2FF',
  surface: 'rgba(79, 70, 229, 0.08)',
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  accent: '#22C55E',
  text: '#312E81',
  textSecondary: 'rgba(49, 46, 129, 0.7)',
  border: 'rgba(79, 70, 229, 0.2)',
  buttonPrimary: '#4F46E5',
  buttonSecondary: 'rgba(79, 70, 229, 0.1)',
  error: 'rgba(239, 68, 68, 0.15)',
  errorBorder: 'rgba(239, 68, 68, 0.4)',
  errorText: '#DC2626',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(prev => !prev);

  const theme = isDark ? purpleDark : purpleLight;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);