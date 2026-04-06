Restaurant App Backend Scenario
1. Users
Your restaurant has three types of users:
Manager – oversees everything, manages menu, views all tables and orders.
Waiter – serves customers, creates orders, updates order status to “served”.
Kitchen staff – sees order items in the kitchen, updates item status (pending → cooking → ready → served).
Login flow:
Each user logs in with credentials.
Backend generates a JWT token containing their role.
All requests require this token, and middleware checks role for route access.
2. Dining Tables
Each table has a status: available or occupied.
Business rule: a table becomes occupied when a waiter creates a new order linked to it.
Backend computes this by checking if there are any active orders (status not served or cancelled).
Frontend only displays table status; waiters cannot manually change it.
Example flow:
Waiter sees table 5 is available.
Waiter creates an order for table 5.
Backend sets table 5 to occupied.
Waiter tries to create another order for table 5 → backend rejects it.
3. Menu Categories & Items
Managers can create menu categories (like “Appetizers”, “Main Course”) and menu items.
Menu items contain:
name, price, optional image_url
is_available (true/false) – only managers can toggle availability
Linked to a category
Kitchen staff or waiters cannot edit menu items, they only fetch for order creation.
4. Orders
An order belongs to a table and a waiter.
Statuses: pending → preparing → ready → served (or cancelled if cancelled).
Total price is calculated based on its order items.

Order flow example:

Waiter selects an available table and creates a new order.
Waiter adds menu items with quantities.
Backend calculates unit_price * quantity for each item and sets total for the order.
Kitchen staff sees new order items in their interface and updates their status (pending → cooking → ready → served).
Once all items are served, the order is automatically served.
Backend automatically frees up the table (sets status to available).
5. Order Items
Each order has one or more order items.
Fields:
menu_item_id, quantity, unit_price, status, optional notes.
Kitchen staff updates status per item:
pending → cooking → ready → served
Backend automatically updates the overall order status based on its items:
Example: if all items are ready, order status → ready.
If all items are served, order status → served.
6. Role-Based Endpoint Access (Map)
Role	Actions / Endpoints
Manager	CRUD menu categories & items, view all tables, view all orders, view sales, manage users
Waiter	View available tables, create orders, add items to orders, mark orders served (optional)
Kitchen	View order items, update item status
7. Backend Business Logic Highlights
Table availability is computed, not manually set.
Order totals are calculated automatically.
Order completion updates table status.
JWT authentication + role check for all endpoints.
No user can perform actions outside their role.
8. Sample Scenario: End-to-End
Waiter Alice logs in → receives JWT with role waiter.
Alice sees table 3 is available → clicks to create order.
Alice adds 2 “Cheeseburgers” and 1 “Soda” → backend calculates total = $24.
Table 3 now shows occupied to all waiters.
Kitchen Bob logs in → sees the new order items for table 3.
Bob sets “Cheeseburgers” → cooking, then ready, then served.
Once all items are served, backend updates order → served.
Table 3 automatically becomes available.