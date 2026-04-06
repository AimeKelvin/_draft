import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  User,
  UserRole,
  DiningTable,
  MenuCategory,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  OrderItemStatus,
  TableStatus } from
'./types';
import {
  mockUsers,
  mockTables,
  mockCategories,
  mockMenuItems,
  mockOrders } from
'./mock-data';
import { authService } from './auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
  username: string,
  password: string)
  => Promise<{success: boolean;error?: string;}>;
  register: (
  fullName: string,
  username: string,
  password: string)
  => Promise<{success: boolean;error?: string;}>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const initAuth = () => {
      const token = authService.getStoredToken();
      if (token && authService.isTokenValid(token)) {
        const payload = authService.parseToken(token);
        if (payload) {
          // In a real app, you might fetch the full user profile here
          const found = mockUsers.find((u) => u.id === payload.userId);
          if (found) setUser(found);
        }
      } else {
        authService.clearStoredToken();
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const token = await authService.login(username, password);
      const payload = authService.parseToken(token);
      if (payload) {
        const found = mockUsers.find((u) => u.id === payload.userId);
        if (found) {
          setUser(found);
          return { success: true };
        }
      }
      return { success: false, error: 'User not found' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }, []);

  const register = useCallback(
    async (fullName: string, username: string, password: string) => {
      try {
        const token = await authService.register(fullName, username, password);
        const payload = authService.parseToken(token);
        if (payload) {
          setUser({
            id: payload.userId,
            fullName: payload.fullName,
            role: payload.role,
            isActive: true,
            createdAt: new Date().toISOString()
          });
          return { success: true };
        }
        return { success: false, error: 'Registration failed' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    },
    []
  );

  const logout = useCallback(() => {
    authService.clearStoredToken();
    setUser(null);
  }, []);

  return { user, isLoading, login, register, logout };
}

interface RestaurantContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  tables: DiningTable[];
  addTable: (table: Omit<DiningTable, 'id' | 'createdAt'>) => void;
  updateTable: (id: string, updates: Partial<DiningTable>) => void;
  deleteTable: (id: string) => void;
  updateTableStatus: (tableId: string, status: TableStatus) => void;

  categories: MenuCategory[];
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  addCategory: (cat: Omit<MenuCategory, 'id'>) => void;

  orders: Order[];
  createOrder: (
  tableId: string,
  waiterId: string,
  items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>[])
  => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItemStatus: (
  orderId: string,
  itemId: string,
  status: OrderItemStatus)
  => void;
  addItemsToOrder: (
  orderId: string,
  items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>[])
  => void;
}

export const RestaurantContext = createContext<RestaurantContextType>(
  {} as RestaurantContextType
);

export function useRestaurant() {
  return useContext(RestaurantContext);
}

let nextId = 100;
function genId(prefix: string) {
  nextId++;
  return `${prefix}${nextId}`;
}

export function useRestaurantProvider(): RestaurantContextType {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [tables, setTables] = useState<DiningTable[]>(mockTables);
  const [categories, setCategories] = useState<MenuCategory[]>(mockCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt'>) => {
    setUsers((prev) => [
    ...prev,
    { ...user, id: genId('u'), createdAt: new Date().toISOString() }]
    );
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) =>
    prev.map((u) => u.id === id ? { ...u, ...updates } : u)
    );
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const addTable = useCallback(
    (table: Omit<DiningTable, 'id' | 'createdAt'>) => {
      setTables((prev) => [
      ...prev,
      { ...table, id: genId('t'), createdAt: new Date().toISOString() }]
      );
    },
    []
  );

  const updateTable = useCallback(
    (id: string, updates: Partial<DiningTable>) => {
      setTables((prev) =>
      prev.map((t) => t.id === id ? { ...t, ...updates } : t)
      );
    },
    []
  );

  const deleteTable = useCallback((id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTableStatus = useCallback(
    (tableId: string, status: TableStatus) => {
      setTables((prev) =>
      prev.map((t) => t.id === tableId ? { ...t, status } : t)
      );
    },
    []
  );

  const addMenuItem = useCallback(
    (item: Omit<MenuItem, 'id' | 'createdAt'>) => {
      setMenuItems((prev) => [
      ...prev,
      { ...item, id: genId('m'), createdAt: new Date().toISOString() }]
      );
    },
    []
  );

  const updateMenuItem = useCallback(
    (id: string, updates: Partial<MenuItem>) => {
      setMenuItems((prev) =>
      prev.map((m) => m.id === id ? { ...m, ...updates } : m)
      );
    },
    []
  );

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const toggleItemAvailability = useCallback((id: string) => {
    setMenuItems((prev) =>
    prev.map((m) =>
    m.id === id ? { ...m, isAvailable: !m.isAvailable } : m
    )
    );
  }, []);

  const addCategory = useCallback((cat: Omit<MenuCategory, 'id'>) => {
    setCategories((prev) => [...prev, { ...cat, id: genId('c') }]);
  }, []);

  const createOrder = useCallback(
    (
    tableId: string,
    waiterId: string,
    items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>[]) =>
    {
      const orderId = genId('o');
      const now = new Date().toISOString();
      const orderItems: OrderItem[] = items.map((item) => ({
        ...item,
        id: genId('oi'),
        orderId,
        createdAt: now
      }));
      const total = orderItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      const newOrder: Order = {
        id: orderId,
        tableId,
        waiterId,
        status: 'pending',
        items: orderItems,
        total,
        createdAt: now,
        updatedAt: now,
        completedAt: null
      };

      setOrders((prev) => [newOrder, ...prev]);
      setTables((prev) =>
      prev.map((t) => t.id === tableId ? { ...t, status: 'occupied' } : t)
      );
    },
    []
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      const now = new Date().toISOString();
      setOrders((prev) =>
      prev.map((o) =>
      o.id === orderId ?
      {
        ...o,
        status,
        updatedAt: now,
        completedAt:
        status === 'served' || status === 'cancelled' ?
        now :
        o.completedAt
      } :
      o
      )
      );
      if (status === 'served' || status === 'cancelled') {
        setOrders((prev) => {
          const order = prev.find((o) => o.id === orderId);
          if (order) {
            setTables((t) =>
            t.map((table) =>
            table.id === order.tableId ?
            { ...table, status: 'available' } :
            table
            )
            );
          }
          return prev;
        });
      }
    },
    []
  );

  const updateOrderItemStatus = useCallback(
    (orderId: string, itemId: string, status: OrderItemStatus) => {
      setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedItems = o.items.map((item) =>
        item.id === itemId ? { ...item, status } : item
        );
        const allReady = updatedItems.every(
          (i) => i.status === 'ready' || i.status === 'served'
        );
        const anyCooked = updatedItems.some((i) => i.status === 'cooking');
        let orderStatus = o.status;
        if (allReady && o.status !== 'served' && o.status !== 'cancelled') {
          orderStatus = 'ready';
        } else if (anyCooked && o.status === 'pending') {
          orderStatus = 'preparing';
        }
        return {
          ...o,
          items: updatedItems,
          status: orderStatus,
          updatedAt: new Date().toISOString()
        };
      })
      );
    },
    []
  );

  const addItemsToOrder = useCallback(
    (
    orderId: string,
    items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>[]) =>
    {
      setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const now = new Date().toISOString();
        const newItems: OrderItem[] = items.map((item) => ({
          ...item,
          id: genId('oi'),
          orderId,
          createdAt: now
        }));
        const allItems = [...o.items, ...newItems];
        const total = allItems.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        );
        return {
          ...o,
          items: allItems,
          total,
          updatedAt: now
        };
      })
      );
    },
    []
  );

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    tables,
    addTable,
    updateTable,
    deleteTable,
    updateTableStatus,
    categories,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    addCategory,
    orders,
    createOrder,
    updateOrderStatus,
    updateOrderItemStatus,
    addItemsToOrder
  };
}