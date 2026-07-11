# Fashion E-Commerce Platform

A full-stack, responsive fashion e-commerce marketplace built in a 24-hour window for the technical assessment.

## Tech Stack & Rationale

- **Backend**: Node.js, Express (JavaScript). Chosen for rapid API development and easy readability.
- **Database**: SQLite with Prisma ORM. SQLite was selected intentionally so the reviewer can clone and run this project with zero database installation or configuration required. Prisma provides a highly typed and clean way to query the database.
- **Frontend**: React (via Vite) and Vanilla CSS. Built to be responsive with a modern, premium aesthetic without relying on heavy UI libraries. Context API is used for lean state management.

## Features Implemented

### Tier 1 (Must Have)
✅ Real persisted database (SQLite via Prisma) with relations
✅ JWT-based Auth (hashed passwords, protected routes)
✅ Product Catalog & Details (browsing by category)
✅ Cart (server-side persistence)
✅ Checkout & Orders (simulated payment, stock decrement)
✅ Admin Panel (Manage products, view orders, update status)
✅ Seed data script

### Tier 2 (Should Have)
✅ Search, filtering, and sorting (by category, price, newest)
✅ Wishlist functionality
✅ Meaningful client & server-side validation (e.g. out-of-stock prevention, cart limits)
✅ Pagination on product listing
✅ Responsive layout for mobile & desktop
✅ Editable order status lifecycle visible to users

## Quick Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install

# Create the SQLite database and run migrations
npx prisma db push

# Seed the database with categories, products, and users
npm run db:seed

# Start the server (runs on port 5000)
npm run dev
```

### 2. Frontend Setup (in a new terminal tab)

```bash
cd frontend
npm install

# Start the Vite dev server (runs on port 3000)
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000)

## Demo Credentials

- **Admin Account**: `admin@shop.com` / `admin123`
- **User Account**: `user@shop.com` / `password123`

## Environment Variables (.env.example)

A `.env.example` file is included in the `backend/` directory. By default, the `.env` provided already works perfectly for a local SQLite setup.

```
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-key-for-assessment"
```

## Known Limitations / What I'd Do With More Time

1. **Images**: Currently using placeholder image URLs. With more time, I'd integrate AWS S3 or Cloudinary via Multer for actual image uploads.
2. **Payment Gateway**: Integration with Stripe for real transactions.
3. **Tests**: Add Jest/Supertest for API integration tests and React Testing Library for frontend components.
4. **Caching**: Implement Redis to cache product listings for faster retrieval.

## AI Usage Note

AI was utilized as a coding accelerator during this build to rapidly scaffold boilerplate (like the Express server configuration, Vite setup, and base CSS variables). It was also used to quickly generate the large array of realistic seed data products to ensure the application is immediately demo-able. All architecture decisions, database modeling, business logic (stock validation, cart logic), and final structure were heavily directed and customized manually.
