/**
 * Главный компонент приложения Graph Explorer.
 * Отвечает за навигацию и тему приложения.
 * 
 * Функции:
 * - NavigationTheme: Обертка для навигации с темой
 * - AppNavigator: Настраивает стек навигации между экранами
 */
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { MainMenuScreen, TasksListScreen, LibraryScreen, AboutScreen, TaskScreen } from './src/screens/TaskScreens';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const Stack = createNativeStackNavigator();

/**
 * Компонент обертка для NavigationContainer с применением темы.
 * Применяет цветовую схему темы к навигации.
 * 
 * @param {object} props.isDark - Флаг темной темы
 * @param {function} props.toggleTheme - Функция переключения темы
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @returns {NavigationContainer} Контейнер навигации с темой
 */
const NavigationTheme = ({ isDark, children }) => {
  const { theme } = useTheme();
  
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.background,
      text: theme.text,
      border: theme.border,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {children}
    </NavigationContainer>
  );
};

/**
 * Компонент навигации стека. Определяет маршруты между экранами.
 * Включает: MainMenuScreen, TasksListScreen, TaskScreen, LibraryScreen, AboutScreen
 * 
 * @returns {Stack.Navigator} Навигатор стека с экранами
 */
const AppNavigator = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.primary,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
          animation: 'slide_from_right',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainMenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TasksList"
          component={TasksListScreen}
          options={{
            title: 'Задачи',
            headerBackTitle: 'Назад',
          }}
        />
        <Stack.Screen
          name="Task"
          component={TaskScreen}
          options={({ route }) => ({
            title: `Задача ${route.params.taskIndex}`,
            headerBackTitle: 'Назад',
          })}
        />
        <Stack.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            title: 'Библиотека',
            headerBackTitle: 'Назад',
          }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{
            title: 'Об авторах',
            headerBackTitle: 'Назад',
          }}
        />
      </Stack.Navigator>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
};

/**
 * Корневой компонент приложения.
 * Оборачивает приложение в провайдеры темы и жестов.
 * 
 * @returns {GestureHandlerRootView} Корневой вид с навигацией
 */
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <NavigationTheme>
          <AppNavigator />
        </NavigationTheme>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
