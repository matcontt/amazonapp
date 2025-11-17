export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  // NUEVO: Campo de descuento calculado
  discount?: number; // Porcentaje de descuento (0-50)
  originalPrice?: number; // Precio original antes del descuento
}

export interface Category {
  name: string;
  count: number;
}