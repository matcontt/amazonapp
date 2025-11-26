import { ScrollView, View, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/schemas/authSchemas';
import { useAuth } from '@/lib/contexts/AuthContext';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemedInput from '@/components/ThemedInput';
import ThemedButton from '@/components/ThemedButton';
import SnowAnimation from '@/components/SnowAnimation';
import { useTheme } from '@/lib/contexts/ThemeContext';
import '@/global.css';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading, error, clearError } = useAuth();
  const { theme } = useTheme();
  const isChristmas = theme.includes('christmas');

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('✅ ZOD validó correctamente:', data);
    Keyboard.dismiss();
    
    try {
      clearError();
      await signIn(data.email, data.password);
      router.replace('/(tabs)');
    } catch (err: any) {
      // El error ya está en el estado 'error' del contexto
    }
  };

  return (
    <ThemedView variant="screen" className="flex-1">
      <SnowAnimation enabled={isChristmas} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
        className="flex-1"
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-center p-6" style={{ minHeight: 600 }}>
              <View className="items-center mb-8">
                <ThemedText 
                  variant="title" 
                  color="primary" 
                  className="mb-2"
                  style={isChristmas ? { fontFamily: 'Pacifico_400Regular' } : {}}
                >
                  {isChristmas ? '🎄 Bienvenido 🎁' : 'Bienvenido'}
                </ThemedText>
                <ThemedText variant="body" color="secondary">
                  Inicia sesión en tu cuenta
                </ThemedText>
              </View>

              <ThemedView variant="card" className="p-6 rounded-2xl mb-4">
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

                {error && (
                  <ThemedView className="bg-red-100 border border-red-400 p-4 rounded-xl mb-4">
                    <ThemedText className="text-red-700 text-center font-medium">
                      {error}
                    </ThemedText>
                  </ThemedView>
                )}

                <ThemedButton
                  title="Iniciar Sesión"
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  className="mb-3"
                />
              </ThemedView>

              <View className="flex-row justify-center items-center">
                <ThemedText variant="body" color="secondary">
                  ¿No tienes cuenta?{' '}
                </ThemedText>
                <TouchableOpacity onPress={() => {
                  clearError();
                  router.push('/(auth)/register');
                }}>
                  <ThemedText variant="body" color="accent" className="font-semibold">
                    Regístrate aquí
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <ThemedView variant="section" className="p-3 rounded-lg mt-4">
                <ThemedText variant="caption" color="secondary" className="text-center">
                  💡 Primero regístrate, luego inicia sesión
                </ThemedText>
              </ThemedView>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}