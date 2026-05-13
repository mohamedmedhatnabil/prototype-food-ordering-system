# 🍔 Prototype Food Ordering System

A modern, full-featured food ordering platform built with React, Vite, and Supabase. This application provides a complete user and admin experience for browsing, ordering, and managing food products with multi-language support and real-time authentication.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Approaches](#architecture--approaches)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Development](#development)
- [Environment Variables](#environment-variables)

---

## ✨ Features

### 🛍️ User Features
- **Product Browsing**: Responsive grid layout for viewing all available food items
- **Shopping Cart**: Add/remove items with real-time quantity management
- **Checkout System**: Complete order placement with payment method selection
- **User Authentication**: 
  - Email/password login via Supabase
  - Google OAuth integration
  - Persistent session management
- **Multi-Language Support**: 
  - English & Arabic translations
  - RTL/LTR layout switching
  - Dynamic language persistence
- **Responsive Design**: Mobile-first responsive UI

### 👨‍💼 Admin Features
- **Product Management**: 
  - View all products in a table
  - Add new products with bilingual names and pricing
  - Edit existing products
  - Delete products with confirmation
  - Real-time product updates
- **Order Management**:
  - View all customer orders
  - Track order status (pending, confirmed, completed, cancelled)
  - Update order status in real-time
  - View order details and items
- **Analytics & Statistics**:
  - Total revenue calculation
  - Order statistics
  - Product performance metrics
- **Dark-Themed Dashboard**: Modern, professional admin UI with styled-components

### 🔐 Security & State Management
- **Protected Routes**: Admin section protected by authentication
- **Context API State Management**: 
  - `AuthContext`: User authentication state
  - `CartContext`: Shopping cart management
  - `LanguageContext`: Internationalization
- **Supabase Integration**: Secure backend with built-in authentication

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.6**: Latest React with hooks and compiler optimization
- **Vite 8.0.12**: Lightning-fast build tool with HMR
- **React Router DOM 7.15.0**: Client-side routing
- **Styled Components 6.4.1**: CSS-in-JS styling with component scope
- **Bootstrap 5.3.8**: Responsive utility framework

### Backend & Database
- **Supabase 2.105.4**: 
  - PostgreSQL database
  - Authentication (Email, OAuth providers)
  - Real-time updates
  - RESTful API

### Build & Development Tools
- **ESLint 10.3.0**: Code quality and style enforcement
- **Babel 7.29.0**: JavaScript transpilation
- **React Compiler Plugin**: Optimized component rendering

---

## 📁 Project Structure

```
src/
├── app/
│   ├── App.jsx                    # Root component with providers
│   ├── AppRoutes.jsx              # Route configuration with code splitting
│   └── AdminRoutes.jsx            # Admin-specific route protection
│
├── components/
│   ├── Header.jsx                 # Navigation header with auth/cart/language
│   ├── Footer.jsx                 # Footer component
│   └── foodcard/
│       ├── FoodCard.jsx           # Reusable product card component
│       └── styles.js              # Styled components for cards
│
├── context/
│   ├── AuthContext.jsx            # Authentication state management
│   ├── CartContext.jsx            # Shopping cart state management
│   ├── LanguageContext.js         # Language state (EN/AR)
│   └── LanguageProvider.jsx       # Language provider with translations
│
├── layouts/
│   ├── AdminLayout.jsx            # Admin page wrapper
│   └── UserLayout.jsx             # User page wrapper
│
├── pages/
│   ├── admin/
│   │   └── adminDashboard.jsx     # Admin control panel (lazy-loaded)
│   ├── cart/
│   │   └── Cart.jsx               # Shopping cart & checkout page
│   ├── home/
│   │   └── home.jsx               # Product listing page
│   └── login/
│       └── Login.jsx              # Authentication page
│
├── services/
│   ├── Adminservice.js            # Admin API calls (CRUD operations)
│   ├── orderService.js            # Order & cart operations
│   ├── productService.js          # Product fetching
│   ├── supabase.js                # Supabase client initialization
│   ├── supabaseAuth.js            # Authentication functions
│   └── translationService.js      # Translation fetching from DB
│
├── assets/                        # Images, icons, etc.
└── main.jsx                       # React entry point
```

---

## 🏗️ Architecture & Approaches

### 1. **Context API for State Management**
Rather than Redux, the application uses React Context API for simplicity:
- **AuthContext**: Manages user authentication state with Supabase session listeners
- **CartContext**: Handles shopping cart with database persistence
- **LanguageContext**: Manages internationalization with localStorage

**Advantages**: Minimal dependencies, easier code splitting, built-in React features.

### 2. **Code Splitting & Lazy Loading**
```javascript
// Admin dashboard is lazy-loaded only when accessed
const AdminDashboard = lazy(() => import("../pages/admin/adminDashboard"));
```
- Reduces initial bundle size
- Admin features loaded on-demand
- Improves First Contentful Paint (FCP)

### 3. **Protected Routes**
```javascript
// AdminRoute checks authentication before rendering admin pages
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```
- Prevents unauthorized access to admin panel
- Redirects unauthenticated users to login

### 4. **Bi-Directional Language Support**
- **RTL/LTR Switching**: Document direction changes based on language
- **Dynamic Translations**: Stored in Supabase `translations` table
- **Fallback System**: English text shown if Arabic translation missing
- **localStorage Persistence**: Language preference saved locally

### 5. **Database Schema**
```
Tables:
├── users (managed by Supabase Auth)
├── products
│   ├── id (PK)
│   ├── name_en, name_ar (bilingual)
│   ├── price, image, description
│   └── ...
├── orders
│   ├── id (PK)
│   ├── user_id (FK)
│   ├── status (cart, pending, confirmed, completed, cancelled)
│   ├── total, payment_method
│   └── created_at
├── order_items
│   ├── id (PK)
│   ├── order_id (FK)
│   ├── product_id (FK)
│   └── quantity
└── translations
    ├── id (PK)
    ├── lang (en/ar)
    ├── key, value
    └── ...
```

### 6. **Cart Management Strategy**
- Cart stored as an order with `status = "cart"`
- Each user has at most one active cart order
- Items stored in `order_items` table linked to cart order
- Real-time updates via Context API

**Cart Operations**:
- `fetchCartItems()`: Load cart from DB
- `saveCartItem()`: Add/update item in cart
- `placeOrder()`: Convert cart to confirmed order
- `clearCart()`: Empty cart after checkout

### 7. **Authentication Flow**
- Supabase Auth handles email/password and OAuth
- Session automatically restored on app load via `getSession()`
- Real-time auth state listener updates UI on login/logout
- OAuth redirect handled automatically

### 8. **Component Design Patterns**

**Styled Components with Scoping**:
```javascript
const Shell = styled.div`...`;
const Sidebar = styled.aside`...`;
// Styles scoped to component, no naming conflicts
```

**Responsive Design**:
```javascript
@media (max-width: 768px) {
  // Mobile-specific styles
}
```

**Custom Hooks** (can be extended):
```javascript
const { language, setLanguage, t } = useLanguage();
```

### 9. **Error Handling**
- Try-catch blocks in async operations
- User-friendly error messages displayed in UI
- Console logging for debugging
- Fallback UI states (loading, error, empty)

### 10. **Performance Optimizations**
- **React Compiler**: Automatic memoization via Babel plugin
- **Code Splitting**: Admin features lazy-loaded
- **Vite HMR**: Instant hot module replacement during development
- **Styled Components**: CSS-in-JS with minimal overhead
- **Conditional Rendering**: Header hidden on admin pages

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Supabase account and project setup
- Google OAuth app credentials (optional, for Google sign-in)

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd Prototype-food-ordering-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase Database**

   Run these SQL queries in Supabase SQL Editor:

   ```sql
   -- Create products table
   CREATE TABLE products (
     id BIGSERIAL PRIMARY KEY,
     name_en VARCHAR(255) NOT NULL,
     name_ar VARCHAR(255) NOT NULL,
     price DECIMAL(10, 2) NOT NULL,
     image TEXT,
     description_en TEXT,
     description_ar TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create orders table
   CREATE TABLE orders (
     id BIGSERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     total DECIMAL(10, 2) DEFAULT 0,
     status VARCHAR(50) DEFAULT 'cart',
     payment_method VARCHAR(50) DEFAULT 'cash',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create order_items table
   CREATE TABLE order_items (
     id BIGSERIAL PRIMARY KEY,
     order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
     product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
     quantity INT DEFAULT 1,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create translations table
   CREATE TABLE translations (
     id BIGSERIAL PRIMARY KEY,
     lang VARCHAR(10) NOT NULL,
     key VARCHAR(255) NOT NULL,
     value TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(lang, key)
   );

   -- Create indexes
   CREATE INDEX idx_orders_user_id ON orders(user_id);
   CREATE INDEX idx_order_items_order_id ON order_items(order_id);
   CREATE INDEX idx_translations_lang_key ON translations(lang, key);
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will run on `http://localhost:5173`

---

## 💻 Usage

### User Flow

1. **Visit Home Page** (`/`)
   - Browse available food products
   - Click "Add to Cart" to add items

2. **View Cart** (`/cart`)
   - Adjust quantities
   - See total price
   - Choose payment method
   - Click "Checkout"

3. **Login/Authentication** (`/login`)
   - Sign up with email/password or Google
   - Redirected to home page on success

4. **Admin Panel** (`/admin`)
   - Access after logging in as admin
   - Manage products and orders
   - View analytics

### Admin Flow

1. **Access Admin Panel**
   - Navigate to `/admin` (requires authentication)
   - Only accessible to users with admin privileges

2. **Product Management**
   - View all products in a table
   - Add new products with bilingual names
   - Edit product details
   - Delete products

3. **Order Management**
   - View all customer orders
   - Update order status
   - View order details

---

## 🔧 Development

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint checks
npm run lint
```

### Code Quality

The project uses ESLint with React-specific rules:
- React hooks rules enforcement
- React refresh compatibility
- Standard code style

### Key Development Concepts

**React Hooks Usage**:
```javascript
// Context hooks
const { user } = useContext(AuthContext);

// State management
const [cartItems, setCartItems] = useState([]);

// Side effects
useEffect(() => {
  // Load data on mount
}, []);
```

**Async/Await Pattern**:
```javascript
const loadData = async () => {
  try {
    const data = await fetchFromSupabase();
    setData(data);
  } catch (error) {
    console.error(error);
  }
};
```

---

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note**: Never commit `.env.local` to version control. Add it to `.gitignore`.

---

## 📊 Database Schema Visualization

```
┌─────────────────┐
│   auth.users    │
└────────┬────────┘
         │
    user_id (FK)
         │
    ┌────▼──────────┐
    │    orders     │
    │   (cart/etc)  │
    └────┬──────────┘
         │ order_id (FK)
         │
    ┌────▼─────────────┐
    │  order_items    │
    │  (qty per item) │
    └────┬─────────────┘
         │ product_id (FK)
         │
    ┌────▼──────────┐
    │   products    │
    │  (en/ar text) │
    └───────────────┘

translations (separate)
  lang (en/ar)
  key, value
```

---

## 🎨 UI/UX Features

- **Modern Color Scheme**: Orange gradient header, dark admin panel
- **Responsive Layout**: Mobile-first design with media queries
- **Loading States**: User feedback during async operations
- **Error Messages**: Clear error handling and display
- **Accessibility**: Semantic HTML, language attributes

---

## 🔐 Security Considerations

- ✅ Supabase handles password hashing and OAuth securely
- ✅ Anon key used for public client (limited permissions)
- ✅ Row-level security (RLS) can be configured in Supabase
- ✅ Admin routes protected by authentication check
- ✅ Sensitive data not exposed in localStorage (except language)

---

## 🚦 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Order history/tracking for users
- [ ] Email notifications on order status
- [ ] Product search and filtering
- [ ] User reviews and ratings
- [ ] Inventory management
- [ ] Discount codes and promotions
- [ ] Push notifications
- [ ] Dark/Light theme toggle
- [ ] Analytics dashboard improvements
- [ ] Two-factor authentication
- [ ] Advanced admin reporting

---

## 📝 License

This project is provided as-is for educational and commercial use.

---

## 🤝 Support

For issues or questions about the project, please refer to the source code comments and Supabase documentation.

---

**Version**: 0.0.0  
**Last Updated**: May 2026  
**Built with ❤️ using React, Vite, and Supabase**
