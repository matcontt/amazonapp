export interface CartItem {
    productId: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
  }
  
  export interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
  }
  