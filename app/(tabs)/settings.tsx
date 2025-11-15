import React from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/ThemeContext';
import '@/global.css'; // Importa global.css para aplicar estilos Tailwind

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'light' || theme === 'christmas-light' 
      ? 'christmas-dark' 
      : 'christmas-light';
    setTheme(newTheme);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cambiar a tema navideño oscuro</Text>
      <Switch
        onValueChange={toggleTheme}
        value={theme === 'christmas-dark'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});