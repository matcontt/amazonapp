import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Cart } from '@/lib/types/cart';
import { Product } from '@/lib/types/product';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Cargar carrito al iniciar
  useEffect(() => {
    loadCart();
  }, []);

  // Guardar carrito cuando cambie
  useEffect(() => {
    if (!loading) {
      saveCart();
    }
  }, [cart]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
        console.log('🛒 Carrito cargado');
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error guardando carrito:', error);
    }
  };

  const calculateTotals = (items: CartItem[]): { total: number; itemCount: number } => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((item) => item.productId === product.id);
      let newItems: CartItem[];

      if (existingItem) {
        // Incrementar cantidad si ya existe
        newItems = prevCart.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        console.log(`🛒 Cantidad incrementada: ${product.title} (${existingItem.quantity + quantity})`);
      } else {
        // Agregar nuevo item
        newItems = [
          ...prevCart.items,
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity,
          },
        ];
        console.log(`🛒 Producto agregado: ${product.title}`);
      }

      const { total, itemCount } = calculateTotals(newItems);
      return { items: newItems, total, itemCount };
    });
  };

  const removeFromCart = async (productId: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.productId !== productId);
      const { total, itemCount } = calculateTotals(newItems);
      console.log(`🛒 Producto eliminado: ${productId}`);
      return { items: newItems, total, itemCount };
    });
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const { total, itemCount } = calculateTotals(newItems);
      console.log(`🛒 Cantidad actualizada: ${productId} -> ${quantity}`);
      return { items: newItems, total, itemCount };
    });
  };

  const clearCart = async () => {
    setCart({ items: [], total: 0, itemCount: 0 });
    console.log('🛒 Carrito limpiado');
  };

  const isInCart = (productId: number): boolean => {
    return cart.items.some((item) => item.productId === productId);
  };

  const getItemQuantity = (productId: number): number => {
    const item = cart.items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};