# Zod Gemini Expo App

¡Bienvenidos a mi proyecto final del primer trimestre!

Este es un proyecto desarrollado con **[Expo](https://expo.dev)** y creado mediante `create-expo-app`, para el módulo de **Programación Móvil** (Bachillerato – Área Informática – 3º Curso – Año Lectivo 2025-2026).

La aplicación implementa un sistema completo de **autenticación** (Registro e Inicio de Sesión) utilizando:
- Validación robusta con **Zod**
- Estilos modernos con **Tailwind CSS** (via NativeWind)
- Navegación con **Expo Router**
- Buenas prácticas de UX en formularios móviles

> **Editado y optimizado para correr en IDX** – 25/11/2025  
> **Autor:** Mateo C.  
> **Repositorio:** https://github.com/matcontt/amazonapp

## Demostración en Video

https://github.com/user-attachments/assets/51e45903-a795-4845-957c-52f4851729ff

https://youtube.com/shorts/GRkVnfK-teo?feature=share

## Características Principales

- Autenticación completa (Sign Up / Log In) con validación estricta mediante **Zod**
- Simulación de tienda estilo Amazon con más de 20 productos reales
- Carrito de compras funcional con persistencia local
- Chatbot inteligente impulsado por **Google Gemini 1.5 Flash**  
  → Detecta intención de compra y permite agregar productos al carrito con un solo toque
- Temas dinámicos: Modo oscuro y tema navideño automático
- Animaciones festivas (nieve cayendo en diciembre)
- Experiencia de teclado perfecta en iOS y Android (`KeyboardAvoidingView` + scroll automático)
- Diseño 100% responsive y moderno usando **Tailwind CSS / NativeWind**
- Arquitectura limpia con Context API para estado global (productos, carrito, tema, AI)

## Tecnologías Utilizadas

| Tecnología             | Uso                                      |
|------------------------|-------------------------------------------|
| React Native + Expo    | Base de la aplicación móvil               |
| TypeScript             | Tipado fuerte y seguridad                 |
| Zod                    | Validación de formularios y datos         |
| NativeWind (Tailwind)  | Estilos utility-first                     |
| Expo Router            | Navegación tipo archivo                   |
| Google Gemini API      | Chatbot con detección de intención de compra |
| AsyncStorage           | Persistencia del carrito                  |
| React Context          | Gestión global del estado                 |

## Requisitos Previos

- Node.js 18 o superior
- Expo CLI: `npm install -g expo-cli`
- App Expo Go (iOS/Android) o emulador
- (Opcional) Cuenta en [Google AI Studio](https://aistudio.google.com) para obtener tu **GEMINI_API_KEY**

## Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/matcontt/amazonapp.git
cd amazonapp

# 2. Instalar dependencias
npm install

# 3. (Opcional pero recomendado) Agregar tu API Key de Gemini
cp .env.example .env
# Edita .env y pega tu GEMINI_API_KEY=

# 4. Iniciar el proyecto
npx expo start
