// ============================================
// lib/contexts/AuthContext.tsx (FIX LOADING)
// ============================================
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuario al iniciar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      console.log('🔐 Cargando sesión...');
      const savedUser = await AsyncStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ Sesión encontrada:', userData.email);
      } else {
        console.log('ℹ️ No hay sesión guardada');
      }
    } catch (err) {
      console.error('Error cargando usuario:', err);
    } finally {
      // IMPORTANTE: Siempre setear loading a false
      setLoading(false);
      console.log('✅ AuthContext inicializado');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Intentando login con:', email);
      setLoading(true);
      setError(null);

      const usersData = await AsyncStorage.getItem('registeredUsers');
      const users: Array<{ email: string; password: string; name: string }> = 
        usersData ? JSON.parse(usersData) : [];

      console.log(`📊 Total de usuarios registrados: ${users.length}`);

      const foundUser = users.find(u => u.email === email);

      if (!foundUser) {
        const errorMsg = '❌ Este email no está registrado. Por favor, regístrate primero.';
        console.log(errorMsg);
        throw new Error(errorMsg);
      }

      if (foundUser.password !== password) {
        const errorMsg = '❌ Contraseña incorrecta. Intenta de nuevo.';
        console.log(errorMsg);
        throw new Error(errorMsg);
      }

      const loggedUser: User = {
        uid: Date.now().toString(),
        email: foundUser.email,
        displayName: foundUser.name,
      };

      await AsyncStorage.setItem('currentUser', JSON.stringify(loggedUser));
      setUser(loggedUser);
      console.log('✅ Login exitoso:', loggedUser.email);

    } catch (err: any) {
      console.error('❌ Error en signIn:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 Intentando registro con:', email, name);
      setLoading(true);
      setError(null);

      const usersData = await AsyncStorage.getItem('registeredUsers');
      const users: Array<{ email: string; password: string; name: string }> = 
        usersData ? JSON.parse(usersData) : [];

      if (users.some(u => u.email === email)) {
        const errorMsg = '❌ Este email ya está registrado. Por favor, inicia sesión.';
        console.log(errorMsg);
        throw new Error(errorMsg);
      }

      users.push({ email, password, name });
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));

      const newUser: User = {
        uid: Date.now().toString(),
        email,
        displayName: name,
      };

      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
      console.log('✅ Usuario registrado y logueado:', newUser.email);

    } catch (err: any) {
      console.error('❌ Error en signUp:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Cerrando sesión');
      setLoading(true);
      await AsyncStorage.removeItem('currentUser');
      setUser(null);
      console.log('✅ Sesión cerrada');
    } catch (err: any) {
      console.error('❌ Error al cerrar sesión:', err);
      setError('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

