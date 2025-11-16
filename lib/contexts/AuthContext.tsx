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
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: '@amazonapp:currentUser',
  REGISTERED_USERS: '@amazonapp:registeredUsers',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('🔐 [AUTH] Inicializando autenticación...');
      await loadUser();
    } catch (err) {
      console.error('❌ [AUTH] Error en inicialización:', err);
    } finally {
      setLoading(false);
      console.log('✅ [AUTH] Inicialización completa');
    }
  };

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ [AUTH] Usuario cargado:', userData.email);
      } else {
        console.log('ℹ️ [AUTH] No hay sesión activa');
        setUser(null);
      }
    } catch (err) {
      console.error('❌ [AUTH] Error cargando usuario:', err);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 [AUTH] Intentando login:', email);
      setLoading(true);
      setError(null);

      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      const users: Array<{ email: string; password: string; name: string }> = 
        usersData ? JSON.parse(usersData) : [];

      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        throw new Error('Este email no está registrado. Por favor, regístrate primero.');
      }

      if (foundUser.password !== password) {
        throw new Error('Contraseña incorrecta. Intenta de nuevo.');
      }

      const loggedUser: User = {
        uid: Date.now().toString(),
        email: foundUser.email,
        displayName: foundUser.name,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(loggedUser));
      setUser(loggedUser);
      console.log('✅ [AUTH] Login exitoso:', loggedUser.email);

    } catch (err: any) {
      const errorMsg = err.message || 'Error desconocido al iniciar sesión';
      console.error('❌ [AUTH] Error en signIn:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 [AUTH] Intentando registro:', email, name);
      setLoading(true);
      setError(null);

      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      const users: Array<{ email: string; password: string; name: string }> = 
        usersData ? JSON.parse(usersData) : [];

      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Este email ya está registrado. Por favor, inicia sesión.');
      }

      users.push({ email, password, name });
      await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));

      const newUser: User = {
        uid: Date.now().toString(),
        email,
        displayName: name,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      setUser(newUser);
      console.log('✅ [AUTH] Usuario registrado:', newUser.email);

    } catch (err: any) {
      const errorMsg = err.message || 'Error desconocido al registrarse';
      console.error('❌ [AUTH] Error en signUp:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 [AUTH] Cerrando sesión...');
      setLoading(true);
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setUser(null);
      console.log('✅ [AUTH] Sesión cerrada');
    } catch (err: any) {
      console.error('❌ [AUTH] Error al cerrar sesión:', err);
      setError('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        isAuthenticated: !!user,
        signIn, 
        signUp, 
        signOut, 
        clearError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};