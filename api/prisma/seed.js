const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('Start seeding...');

  // --------------------
  // 1. USERS
  // --------------------
  const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
  const waiter1Password = await bcrypt.hash('waiter123', SALT_ROUNDS);
  const waiter2Password = await bcrypt.hash('waiter123', SALT_ROUNDS);
  const kitchenPassword = await bcrypt.hash('kitchen123', SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: { name: 'Admin', email: 'admin@platr.com', role: 'ADMIN', password: adminPassword },
  });

  const waiter1 = await prisma.user.create({
    data: { name: 'Waiter One', email: 'waiter1@platr.com', role: 'WAITER', password: waiter1Password },
  });

  const waiter2 = await prisma.user.create({
    data: { name: 'Waiter Two', email: 'waiter2@platr.com', role: 'WAITER', password: waiter2Password },
  });

  const kitchen = await prisma.user.create({
    data: { name: 'Kitchen Staff', email: 'kitchen@platr.com', role: 'KITCHEN', password: kitchenPassword },
  });

  console.log('Users created ✅');

  // --------------------
  // 2. TABLES
  // --------------------
  const tables = [];
  for (let i = 1; i <= 5; i++) {
    const table = await prisma.table.create({
      data: { tableNumber: i, capacity: 4, section: 'Main' },
    });
    tables.push(table);
  }
  console.log('Tables created ✅');

  // --------------------
  // 3. MENU ITEMS
  // --------------------
  const menuItemsData = [
    { name: 'Cheeseburger', category: 'Grill', price: 8.99, description: 'Beef burger with cheese' },
    { name: 'Veggie Pizza', category: 'Pizza', price: 10.5, description: 'Tomato, cheese, vegetables' },
    { name: 'Coke', category: 'Drink', price: 2.0, description: 'Cold soft drink' },
    { name: 'Chocolate Cake', category: 'Dessert', price: 5.0, description: 'Rich chocolate cake' },
    { name: 'French Fries', category: 'Sides', price: 3.5, description: 'Crispy potato fries' },
  ];

  const menuItems = [];
  for (const item of menuItemsData) {
    const menuItem = await prisma.menuItem.create({ data: item });
    menuItems.push(menuItem);
  }
  console.log('Menu items created ✅');

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
