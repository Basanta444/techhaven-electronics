# TechHaven - Next-Gen Electronics Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://techhaven-electronics.vercel.app/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosted-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**TechHaven** is a fully-featured, production-ready e-commerce web application specialized for modern consumer electronics. Built on a serverless frontend architecture using **React 19**, **TypeScript**, and **Vite**, the application utilizes **Firebase (Firestore & Authentication)** for its database, real-time sync, and user session management.

---

## 🚀 Live Application

Explore the fully deployed platform here: **[TechHaven Electronics Live](https://techhaven-electronics.vercel.app/)**

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework:** React 19 (Functional Components, Hooks)
- **Programming Language:** TypeScript (Strict typing for robust error prevention)
- **Build Tool:** Vite (Ultra-fast Hot Module Replacement & bundling)
- **Styling:** Tailwind CSS (Modern, utility-first responsive layout)
- **Database & Backend:** Google Cloud Firestore (NoSQL Serverless Database)
- **Authentication:** Firebase Authentication (Supports Email/Password and Google OAuth)
- **State Management:** React Context API (State persistence with `localStorage` synchronization)
- **Routing:** React Router DOM v7 (Dynamic paths, protected admin routes, search query parameter mapping)
- **Icons:** Lucide React

---

## ✨ Key Features

### 🛒 Client Features

- **Dynamic Catalog:** Browse through categorized products. Filtering options allow refining by **Category** and **Brand** simultaneously.
- **URL-Synced Search Engine:** Integrated search input on the navigation bar that parses URL search parameters to query and filter active products in real-time.
- **State-Persistent Cart & Wishlist:** Custom state provider manages the shopping cart and wishlist counters, using `localStorage` to persist items across browser sessions.
- **Local & International Checkout:** A customized checkout interface supporting credit/debit card simulations alongside localized payment gateway selections (eSewa, Khalti, and Cash on Delivery).
- **Responsive Design:** Designed using a mobile-first approach, scaling elegantly from mobile phones to high-resolution desktop screens.

### 🛡️ Admin & Authentication Features

- **Firebase Authentication:** Secure user signup and signin supporting traditional email/password credentials and native Google Popup OAuth.
- **Role-Based Access Control (RBAC):** Restricts administrative functions. Non-admin accounts or unauthenticated users attempting to access `/admin` are automatically rerouted to the landing page.
- **Real-Time Admin Dashboard:**
  - Aggregated statistical cards showing **Total Revenue**, **Total Orders**, and **Total Products** fetched directly from Firestore.
  - **Firestore CRUD Operations:** Allows admins to write new products or permanently delete existing products from the database live.
  - **Live Order Management:** Allows changing shipping/processing states via dropdowns that sync directly with the orders collection in Firestore.

---

Designed and built by Basanta Khadka.
