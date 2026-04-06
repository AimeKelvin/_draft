import type { User, DiningTable, MenuCategory, MenuItem, Order } from './types';

function daysAgo(days: number, hours = 0) {
  return new Date(Date.now() - days * 86400000 - hours * 3600000).toISOString();
}

export const mockUsers: User[] = [
{
  id: 'u1',
  fullName: 'Sarah Chen',
  role: 'manager',
  isActive: true,
  createdAt: daysAgo(300)
},
{
  id: 'u2',
  fullName: 'James Wilson',
  role: 'waiter',
  isActive: true,
  createdAt: daysAgo(200)
},
{
  id: 'u3',
  fullName: 'Maria Garcia',
  role: 'waiter',
  isActive: true,
  createdAt: daysAgo(150)
},
{
  id: 'u4',
  fullName: 'Alex Kim',
  role: 'kitchen',
  isActive: true,
  createdAt: daysAgo(180)
},
{
  id: 'u5',
  fullName: 'David Brown',
  role: 'waiter',
  isActive: true,
  createdAt: daysAgo(100)
},
{
  id: 'u6',
  fullName: 'Lisa Park',
  role: 'kitchen',
  isActive: true,
  createdAt: daysAgo(50)
},
{
  id: 'u7',
  fullName: 'Tom Rivera',
  role: 'waiter',
  isActive: false,
  createdAt: daysAgo(40)
}];


export const mockTables: DiningTable[] = [
{ id: 't1', tableNumber: 1, status: 'available', createdAt: daysAgo(300) },
{ id: 't2', tableNumber: 2, status: 'occupied', createdAt: daysAgo(300) },
{ id: 't3', tableNumber: 3, status: 'available', createdAt: daysAgo(300) },
{ id: 't4', tableNumber: 4, status: 'occupied', createdAt: daysAgo(300) },
{ id: 't5', tableNumber: 5, status: 'available', createdAt: daysAgo(300) },
{ id: 't6', tableNumber: 6, status: 'available', createdAt: daysAgo(300) },
{ id: 't7', tableNumber: 7, status: 'available', createdAt: daysAgo(300) },
{ id: 't8', tableNumber: 8, status: 'occupied', createdAt: daysAgo(300) },
{ id: 't9', tableNumber: 9, status: 'available', createdAt: daysAgo(300) },
{ id: 't10', tableNumber: 10, status: 'available', createdAt: daysAgo(300) },
{ id: 't11', tableNumber: 11, status: 'available', createdAt: daysAgo(300) },
{ id: 't12', tableNumber: 12, status: 'available', createdAt: daysAgo(300) }];


export const mockCategories: MenuCategory[] = [
{ id: 'c1', name: 'Appetizers' },
{ id: 'c2', name: 'Main Course' },
{ id: 'c3', name: 'Pasta' },
{ id: 'c4', name: 'Desserts' },
{ id: 'c5', name: 'Beverages' }];


export const mockMenuItems: MenuItem[] = [
{
  id: 'm1',
  categoryId: 'c1',
  name: 'Bruschetta',
  price: 9.99,
  imageUrl:
  'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm2',
  categoryId: 'c1',
  name: 'Calamari Fritti',
  price: 12.99,
  imageUrl:
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm3',
  categoryId: 'c1',
  name: 'Caprese Salad',
  price: 11.99,
  imageUrl:
  'https://images.unsplash.com/photo-1608032077018-c9aad9565d29?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm4',
  categoryId: 'c2',
  name: 'Grilled Salmon',
  price: 24.99,
  imageUrl:
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm5',
  categoryId: 'c2',
  name: 'Ribeye Steak',
  price: 34.99,
  imageUrl:
  'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm6',
  categoryId: 'c2',
  name: 'Chicken Parmesan',
  price: 19.99,
  imageUrl:
  'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop',
  isAvailable: false,
  createdAt: daysAgo(300)
},
{
  id: 'm7',
  categoryId: 'c3',
  name: 'Spaghetti Carbonara',
  price: 16.99,
  imageUrl:
  'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm8',
  categoryId: 'c3',
  name: 'Fettuccine Alfredo',
  price: 15.99,
  imageUrl:
  'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm9',
  categoryId: 'c3',
  name: 'Penne Arrabbiata',
  price: 14.99,
  imageUrl:
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm10',
  categoryId: 'c4',
  name: 'Tiramisu',
  price: 8.99,
  imageUrl:
  'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm11',
  categoryId: 'c4',
  name: 'Panna Cotta',
  price: 7.99,
  imageUrl:
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm12',
  categoryId: 'c5',
  name: 'Espresso',
  price: 3.99,
  imageUrl:
  'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm13',
  categoryId: 'c5',
  name: 'Fresh Lemonade',
  price: 4.99,
  imageUrl:
  'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
},
{
  id: 'm14',
  categoryId: 'c5',
  name: 'Italian Soda',
  price: 3.49,
  imageUrl:
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop',
  isAvailable: true,
  createdAt: daysAgo(300)
}];


export const mockOrders: Order[] = [
{
  id: 'o1',
  tableId: 't2',
  waiterId: 'u2',
  status: 'preparing',
  createdAt: daysAgo(0, 1),
  updatedAt: daysAgo(0, 0.5),
  completedAt: null,
  total: 52.97,
  items: [
  {
    id: 'oi1',
    orderId: 'o1',
    menuItemId: 'm1',
    quantity: 1,
    unitPrice: 9.99,
    status: 'ready',
    createdAt: daysAgo(0, 1)
  },
  {
    id: 'oi2',
    orderId: 'o1',
    menuItemId: 'm5',
    quantity: 1,
    unitPrice: 34.99,
    status: 'cooking',
    createdAt: daysAgo(0, 1)
  },
  {
    id: 'oi3',
    orderId: 'o1',
    menuItemId: 'm12',
    quantity: 2,
    unitPrice: 3.99,
    status: 'served',
    createdAt: daysAgo(0, 1)
  }]

},
{
  id: 'o2',
  tableId: 't4',
  waiterId: 'u3',
  status: 'pending',
  createdAt: daysAgo(0, 0.2),
  updatedAt: daysAgo(0, 0.2),
  completedAt: null,
  total: 47.97,
  items: [
  {
    id: 'oi4',
    orderId: 'o2',
    menuItemId: 'm3',
    quantity: 1,
    unitPrice: 11.99,
    status: 'pending',
    createdAt: daysAgo(0, 0.2)
  },
  {
    id: 'oi5',
    orderId: 'o2',
    menuItemId: 'm7',
    quantity: 1,
    unitPrice: 16.99,
    status: 'pending',
    createdAt: daysAgo(0, 0.2)
  },
  {
    id: 'oi6',
    orderId: 'o2',
    menuItemId: 'm4',
    quantity: 1,
    unitPrice: 24.99,
    status: 'pending',
    notes: 'No lemon',
    createdAt: daysAgo(0, 0.2)
  }]

},
{
  id: 'o3',
  tableId: 't8',
  waiterId: 'u2',
  status: 'ready',
  createdAt: daysAgo(0, 1.5),
  updatedAt: daysAgo(0, 0.1),
  completedAt: null,
  total: 36.97,
  items: [
  {
    id: 'oi7',
    orderId: 'o3',
    menuItemId: 'm8',
    quantity: 1,
    unitPrice: 15.99,
    status: 'ready',
    createdAt: daysAgo(0, 1.5)
  },
  {
    id: 'oi8',
    orderId: 'o3',
    menuItemId: 'm9',
    quantity: 1,
    unitPrice: 14.99,
    status: 'ready',
    createdAt: daysAgo(0, 1.5)
  },
  {
    id: 'oi9',
    orderId: 'o3',
    menuItemId: 'm13',
    quantity: 2,
    unitPrice: 4.99,
    status: 'served',
    notes: 'Extra mint',
    createdAt: daysAgo(0, 1.5)
  }]

},
{
  id: 'o4',
  tableId: 't3',
  waiterId: 'u3',
  status: 'served',
  createdAt: daysAgo(0, 3),
  updatedAt: daysAgo(0, 2),
  completedAt: daysAgo(0, 2),
  total: 62.96,
  items: [
  {
    id: 'oi10',
    orderId: 'o4',
    menuItemId: 'm2',
    quantity: 1,
    unitPrice: 12.99,
    status: 'served',
    createdAt: daysAgo(0, 3)
  },
  {
    id: 'oi11',
    orderId: 'o4',
    menuItemId: 'm5',
    quantity: 1,
    unitPrice: 34.99,
    status: 'served',
    createdAt: daysAgo(0, 3)
  },
  {
    id: 'oi12',
    orderId: 'o4',
    menuItemId: 'm10',
    quantity: 1,
    unitPrice: 8.99,
    status: 'served',
    createdAt: daysAgo(0, 3)
  },
  {
    id: 'oi13',
    orderId: 'o4',
    menuItemId: 'm13',
    quantity: 1,
    unitPrice: 4.99,
    status: 'served',
    createdAt: daysAgo(0, 3)
  }]

},
{
  id: 'o5',
  tableId: 't1',
  waiterId: 'u2',
  status: 'served',
  createdAt: daysAgo(1, 2),
  updatedAt: daysAgo(1, 1),
  completedAt: daysAgo(1, 1),
  total: 45.97,
  items: [
  {
    id: 'oi14',
    orderId: 'o5',
    menuItemId: 'm1',
    quantity: 1,
    unitPrice: 9.99,
    status: 'served',
    createdAt: daysAgo(1, 2)
  },
  {
    id: 'oi15',
    orderId: 'o5',
    menuItemId: 'm4',
    quantity: 1,
    unitPrice: 24.99,
    status: 'served',
    createdAt: daysAgo(1, 2)
  },
  {
    id: 'oi16',
    orderId: 'o5',
    menuItemId: 'm10',
    quantity: 1,
    unitPrice: 8.99,
    status: 'served',
    createdAt: daysAgo(1, 2)
  }]

},
{
  id: 'o6',
  tableId: 't5',
  waiterId: 'u5',
  status: 'served',
  createdAt: daysAgo(1, 4),
  updatedAt: daysAgo(1, 3),
  completedAt: daysAgo(1, 3),
  total: 78.96,
  items: [
  {
    id: 'oi17',
    orderId: 'o6',
    menuItemId: 'm2',
    quantity: 2,
    unitPrice: 12.99,
    status: 'served',
    createdAt: daysAgo(1, 4)
  },
  {
    id: 'oi18',
    orderId: 'o6',
    menuItemId: 'm7',
    quantity: 2,
    unitPrice: 16.99,
    status: 'served',
    createdAt: daysAgo(1, 4)
  },
  {
    id: 'oi19',
    orderId: 'o6',
    menuItemId: 'm11',
    quantity: 2,
    unitPrice: 7.99,
    status: 'served',
    createdAt: daysAgo(1, 4)
  }]

},
{
  id: 'o7',
  tableId: 't7',
  waiterId: 'u3',
  status: 'served',
  createdAt: daysAgo(1, 5),
  updatedAt: daysAgo(1, 4),
  completedAt: daysAgo(1, 4),
  total: 89.95,
  items: [
  {
    id: 'oi20',
    orderId: 'o7',
    menuItemId: 'm5',
    quantity: 2,
    unitPrice: 34.99,
    status: 'served',
    createdAt: daysAgo(1, 5)
  },
  {
    id: 'oi21',
    orderId: 'o7',
    menuItemId: 'm12',
    quantity: 2,
    unitPrice: 3.99,
    status: 'served',
    createdAt: daysAgo(1, 5)
  },
  {
    id: 'oi22',
    orderId: 'o7',
    menuItemId: 'm14',
    quantity: 2,
    unitPrice: 3.49,
    status: 'served',
    createdAt: daysAgo(1, 5)
  }]

},
{
  id: 'o8',
  tableId: 't6',
  waiterId: 'u2',
  status: 'served',
  createdAt: daysAgo(2, 3),
  updatedAt: daysAgo(2, 2),
  completedAt: daysAgo(2, 2),
  total: 55.96,
  items: [
  {
    id: 'oi23',
    orderId: 'o8',
    menuItemId: 'm3',
    quantity: 2,
    unitPrice: 11.99,
    status: 'served',
    createdAt: daysAgo(2, 3)
  },
  {
    id: 'oi24',
    orderId: 'o8',
    menuItemId: 'm8',
    quantity: 2,
    unitPrice: 15.99,
    status: 'served',
    createdAt: daysAgo(2, 3)
  }]

},
{
  id: 'o9',
  tableId: 't9',
  waiterId: 'u5',
  status: 'served',
  createdAt: daysAgo(2, 5),
  updatedAt: daysAgo(2, 4),
  completedAt: daysAgo(2, 4),
  total: 41.97,
  items: [
  {
    id: 'oi25',
    orderId: 'o9',
    menuItemId: 'm1',
    quantity: 1,
    unitPrice: 9.99,
    status: 'served',
    createdAt: daysAgo(2, 5)
  },
  {
    id: 'oi26',
    orderId: 'o9',
    menuItemId: 'm9',
    quantity: 1,
    unitPrice: 14.99,
    status: 'served',
    createdAt: daysAgo(2, 5)
  },
  {
    id: 'oi27',
    orderId: 'o9',
    menuItemId: 'm7',
    quantity: 1,
    unitPrice: 16.99,
    status: 'served',
    createdAt: daysAgo(2, 5)
  }]

},
{
  id: 'o10',
  tableId: 't10',
  waiterId: 'u3',
  status: 'served',
  createdAt: daysAgo(3, 2),
  updatedAt: daysAgo(3, 1),
  completedAt: daysAgo(3, 1),
  total: 67.96,
  items: [
  {
    id: 'oi28',
    orderId: 'o10',
    menuItemId: 'm4',
    quantity: 2,
    unitPrice: 24.99,
    status: 'served',
    createdAt: daysAgo(3, 2)
  },
  {
    id: 'oi29',
    orderId: 'o10',
    menuItemId: 'm10',
    quantity: 2,
    unitPrice: 8.99,
    status: 'served',
    createdAt: daysAgo(3, 2)
  }]

},
{
  id: 'o11',
  tableId: 't12',
  waiterId: 'u2',
  status: 'cancelled',
  createdAt: daysAgo(3, 6),
  updatedAt: daysAgo(3, 5.5),
  completedAt: daysAgo(3, 5.5),
  total: 20.98,
  items: [
  {
    id: 'oi30',
    orderId: 'o11',
    menuItemId: 'm1',
    quantity: 1,
    unitPrice: 9.99,
    status: 'pending',
    createdAt: daysAgo(3, 6)
  },
  {
    id: 'oi31',
    orderId: 'o11',
    menuItemId: 'm3',
    quantity: 1,
    unitPrice: 11.99,
    status: 'pending',
    createdAt: daysAgo(3, 6)
  }]

},
{
  id: 'o12',
  tableId: 't2',
  waiterId: 'u5',
  status: 'served',
  createdAt: daysAgo(5, 3),
  updatedAt: daysAgo(5, 2),
  completedAt: daysAgo(5, 2),
  total: 94.95,
  items: [
  {
    id: 'oi32',
    orderId: 'o12',
    menuItemId: 'm5',
    quantity: 2,
    unitPrice: 34.99,
    status: 'served',
    createdAt: daysAgo(5, 3)
  },
  {
    id: 'oi33',
    orderId: 'o12',
    menuItemId: 'm4',
    quantity: 1,
    unitPrice: 24.99,
    status: 'served',
    createdAt: daysAgo(5, 3)
  }]

},
{
  id: 'o13',
  tableId: 't4',
  waiterId: 'u2',
  status: 'served',
  createdAt: daysAgo(7, 4),
  updatedAt: daysAgo(7, 3),
  completedAt: daysAgo(7, 3),
  total: 51.96,
  items: [
  {
    id: 'oi34',
    orderId: 'o13',
    menuItemId: 'm7',
    quantity: 2,
    unitPrice: 16.99,
    status: 'served',
    createdAt: daysAgo(7, 4)
  },
  {
    id: 'oi35',
    orderId: 'o13',
    menuItemId: 'm10',
    quantity: 2,
    unitPrice: 8.99,
    status: 'served',
    createdAt: daysAgo(7, 4)
  }]

},
{
  id: 'o14',
  tableId: 't6',
  waiterId: 'u3',
  status: 'served',
  createdAt: daysAgo(7, 6),
  updatedAt: daysAgo(7, 5),
  completedAt: daysAgo(7, 5),
  total: 73.96,
  items: [
  {
    id: 'oi36',
    orderId: 'o14',
    menuItemId: 'm2',
    quantity: 2,
    unitPrice: 12.99,
    status: 'served',
    createdAt: daysAgo(7, 6)
  },
  {
    id: 'oi37',
    orderId: 'o14',
    menuItemId: 'm8',
    quantity: 3,
    unitPrice: 15.99,
    status: 'served',
    createdAt: daysAgo(7, 6)
  }]

}];