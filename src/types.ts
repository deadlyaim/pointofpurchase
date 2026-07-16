export type OrderStatus = 'payment_pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  image?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  createdAt: string;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  carrier: string;
  estimatedDelivery: string;
}

export interface ProductColor {
  name: string;
  value: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  rating?: number;
  featured?: boolean;
  sizes?: string[];
  colors?: ProductColor[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
