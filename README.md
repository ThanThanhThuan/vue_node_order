## Order Management System (OMS)

📦 Order Management System (OMS)

A full-stack B2B web application designed to manage the entire lifecycle of sales orders, customers, and product inventories. The system features Role-Based Access Control (RBAC) allowing both 
Administrators to manage the business and Customers to track their own orders.

<img width="1612" height="953" alt="image" src="https://github.com/user-attachments/assets/4c2fbf82-ebf5-4088-a618-9452331a2c2a" />

🛠 Technical Stack

Frontend (Client)

    Framework: Vue.js 3 (Composition API)

    Build Tool: Vite

    Styling: Tailwind CSS (Custom Config, Inter Font)

    State/Routing: Vue Router

    API Client: Axios (with Interceptors)

    Internationalization: Vue I18n (English & Vietnamese)

Backend (Server)

    Runtime: Node.js

    Framework: Express.js

    ORM: Sequelize

    Database: PostgreSQL

    Dev Tools: Nodemon

🚀 Key Features

1. Authentication & Security

    Simple Login: Email-based authentication.

    Role-Based Access Control (RBAC):

        Admin: Full access to all modules (Dashboard, Orders, Customers, Products).

        Customer: Restricted access. Can only view their own Dashboard stats and their own Orders.

    Secure Navbar: Menu items (Customers/Products) are physically hidden from non-admin users.

2. Order Management (The Core)

    Multi-Item Support: Orders are not just text; they support multiple product lines (Product + Qty + Unit Price).

    Auto-Calculation: Total order value is calculated automatically based on selected items.

    Status Workflow: Quick status updates (New → Processing → Completed → Cancelled) directly from the list view.

    Advanced Filtering: Filter by Order Status, Date Range, and Customer.

    Details View: Modal popup to view line items and delete orders.

3. Product & Inventory

    Product Catalog: Manage products with SKU, Name, Price, and Stock.

    Integration: Products are linked to Order Items, automatically populating unit prices during order creation.

4. Customer Management

    CRM Features: Create, Edit, and Delete customer profiles.

    User Linking: Link a "Customer Profile" to a "User Account" (user_id), enabling specific customers to log in and see only their data.

5. Dashboard & Reporting

    KPI Cards: Real-time metrics for Total Revenue and Total Orders.

    Data Isolation:

        Admins see global stats.

        Customers see stats specific only to their orders.

6. UX/UI Polish

    Global Styling: Centralized CSS using Tailwind (.btn-primary, .card, .input).

    Multi-Language: Instant switching between English and Vietnamese.

    Modals: Used for creating/editing data to keep context (no page reloads).

🗄 Database Schema

The system uses a Relational Database (PostgreSQL) with the following structure:

    users: Stores login credentials and Roles (ADMIN, CUSTOMER).

    customers: Stores profile info. Linked to users via user_id.

    products: Stores inventory items.

    orders: The master order record (Total Value, Status, Code). Linked to customers.

    order_items: The details of an order. Linked to orders and products.

📂 Project Structure
code Bash

    
OMS_Project/
├── server/                 # Node.js Backend
│   ├── config/             # DB Connection
│   ├── controllers/        # Business Logic (Order, Customer, Product)
│   ├── models/             # Sequelize Definitions (Database Tables)
│   ├── routes/             # API Endpoints
│   ├── .env                # Database Credentials
│   └── index.js            # Entry Point
│
└── client/                 # Vue.js Frontend
    ├── src/
    │   ├── api/            # Axios setup
    │   ├── components/     # Reusable UI (Navbar, Modal)
    │   ├── locales/        # JSON Translations (en.json, vi.json)
    │   ├── views/          # Pages (Login, Dashboard, OrderList, etc.)
    │   ├── router/         # Navigation Rules
    │   └── style.css       # Global Tailwind Styles
    ├── tailwind.config.js  # Color & Font themes
    └── vite.config.js      # Build configuration

✅ How to Run

    Database: Ensure PostgreSQL is running and oms_db exists.

    Backend:
cd server
npm run dev

 Frontend:
 
cd client
npm run dev






  

Access: Open http://localhost:5173.
