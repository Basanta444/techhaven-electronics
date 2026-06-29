export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  specs: string; // (Optional: later you could change this to an array or object if specs get complex)
  featured: boolean;
  newArrival: boolean;
  sale: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface CartItem extends Product {
  quantity: number;
}

// 1. ADD THIS NEW INTERFACE:
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  date: string;
  // 2. CHANGE THIS LINE from 'any' to 'Address':
  shippingAddress: Address; 
  paymentMethod: string;
}