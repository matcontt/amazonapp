import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/schemas/authSchemas';
import { useAuth } from '@/lib/contexts/AuthContext';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemedInput from '@/components/ThemedInput';
import ThemedButton from '@/components/ThemedButton';
import SnowAnimation from '@/components/SnowAnimation';
import { useTheme } from '@/lib/contexts/ThemeContext';
import '@/global.css';

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
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center p-6 py-12">
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

            {/* Error del contexto (email ya registrado) */}
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
              clearError(); // Limpiar error al cambiar de pantalla
              router.back();
            }}>
              <ThemedText variant="body" color="accent" className="font-semibold">
                Inicia sesión
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}