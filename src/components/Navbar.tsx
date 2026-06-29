import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Package, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/button';

// 1. Import Firebase Auth services
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const { cart, wishlist, user, setUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- SEARCH HANDLER ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs out of Firebase
      setUser(null);       // Clears your app state
      navigate('/');
    } catch (error) {
      console.error("Error logging out from Firebase: ", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight">TechHaven</span>
          </Link>
          <div className="hidden md:flex gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Home</Link>
            <Link to="/shop" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Shop</Link>
          </div>
        </div>

        {/* Dynamic Search Form */}
        <div className="flex-1 flex justify-center px-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-neutral-900 text-[10px] font-medium text-white flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-neutral-900 text-[10px] font-medium text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Admin</Button>
                </Link>
              )}
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}