import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Wishlist } from './pages/Wishlist';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white font-sans text-neutral-950 flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </div>
          <footer className="border-t py-8 text-center text-sm text-neutral-500 mt-auto">
            © {new Date().getFullYear()} TechHaven Electronics. All rights reserved.
          </footer>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
