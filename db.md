/*
ERD for Restaurant Management System
Entities: Users, Tables, MenuItems, Orders, OrderItems
Relationships:
- Users (waiters/admins) take Orders
- Orders belong to Tables
- Orders have multiple OrderItems
- OrderItems refer to MenuItems
*/

Users
- id (PK)
- name
- role (waiter/admin)
- email
- password

Tables
- id (PK)
- table_number
- capacity
- section

MenuItems
- id (PK)
- name
- category (grill, drinks, dessert)
- price
- description
- is_available

Orders
- id (PK)
- table_id (FK -> Tables.id)
- waiter_id (FK -> Users.id)
- status (pending, preparing, ready, served)
- timestamp_created
- timestamp_updated

OrderItems
- id (PK)
- order_id (FK -> Orders.id)
- menu_item_id (FK -> MenuItems.id)
- quantity
- special_instructions
