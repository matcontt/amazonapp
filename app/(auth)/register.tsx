import SnowAnimation from '@/components/SnowAnimation';
import ThemedButton from '@/components/ThemedButton';
import ThemedInput from '@/components/ThemedInput';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import '@/global.css';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { RegisterFormData, registerSchema } from '@/lib/schemas/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, loading, error, clearError } = useAuth();
  const { theme } = useTheme();
  const isChristmas = theme.includes('christmas');

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log('✅ ZOD validó correctamente:', data);
    Keyboard.dismiss();
    
    try {
      clearError();
      await signUp(data.email, data.password, data.name);
      Alert.alert('🎉 ¡Cuenta creada!', 'Tu cuenta se ha creado exitosamente', [
        { text: 'Continuar', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (err: any) {
      // El error ya está en el estado 'error' del contexto
    }
  };

  return (
    <ThemedView variant="screen" className="flex-1">
      <SnowAnimation enabled={isChristmas} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        className="h-full"
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-center p-6 py-12" style={{ minHeight: 700 }}>
              <View className="items-center mb-8">
                <ThemedText 
                  variant="title" 
                  color="primary" 
                  className="mb-2"
                  style={isChristmas ? { fontFamily: 'Pacifico_400Regular' } : {}}
                >
                  {isChristmas ? '🎁 Crear Cuenta 🎄' : 'Crear Cuenta'}
                </ThemedText>
                <ThemedText variant="body" color="secondary">
                  Únete a nuestra comunidad
                </ThemedText>
              </View>

              <ThemedView variant="card" className="p-6 rounded-2xl mb-4">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                      label="Nombre completo"
                      placeholder="Juan Pérez"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.name?.message}
                      autoCorrect={false}
                      icon={<ThemedText>👤</ThemedText>}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                      label="Email"
                      placeholder="tu@email.com"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon={<ThemedText>📧</ThemedText>}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                      label="Contraseña"
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      secureTextEntry
                      icon={<ThemedText>🔒</ThemedText>}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                      label="Confirmar contraseña"
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.confirmPassword?.message}
                      secureTextEntry
                      icon={<ThemedText>🔑</ThemedText>}
                    />
                  )}
                />

                {error && (
                  <ThemedView className="bg-red-100 border border-red-400 p-4 rounded-xl mb-4">
                    <ThemedText className="text-red-700 text-center font-medium">
                      {error}
                    </ThemedText>
                  </ThemedView>
                )}

                <ThemedButton
                  title="Crear Cuenta"
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  className="mb-3"
                />
              </ThemedView>

              <View className="flex-row justify-center items-center">
                <ThemedText variant="body" color="secondary">
                  ¿Ya tienes cuenta?{' '}
                </ThemedText>
                <TouchableOpacity onPress={() => {
                  clearError();
                  router.back();
                }}>
                  <ThemedText variant="body" color="accent" className="font-semibold">
                    Inicia sesión
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}