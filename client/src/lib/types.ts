// ============================================
// Restaurant Management System - Type Definitions
// ============================================

export type UserRole = 'manager' | 'waiter' | 'kitchen';

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  userId: string;
  fullName: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export type TableStatus = 'available' | 'occupied';

export interface DiningTable {
  id: string;
  tableNumber: number;
  status: TableStatus;
  createdAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
}

export type OrderStatus =
'pending' |
'preparing' |
'ready' |
'served' |
'cancelled';

export interface Order {
  id: string;
  tableId: string;
  waiterId: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  items: OrderItem[];
}

export type OrderItemStatus = 'pending' | 'cooking' | 'ready' | 'served';

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  status: OrderItemStatus;
  notes?: string;
  createdAt: string;
}