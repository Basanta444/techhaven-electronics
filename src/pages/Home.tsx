import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

// 1. Add Firebase imports
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching from Firebase: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featured = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-neutral-950 text-white py-24 px-4">
        <div className="container mx-auto max-w-7xl flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl">
            Next-Gen Electronics for the Modern World
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-8 max-w-2xl">
            Discover the latest in tech, from high-performance laptops to immersive audio, with guaranteed quality and fast shipping.
          </p>
          <div className="flex gap-4">
            <Link to="/shop">
              <Button size="lg" className="bg-white text-neutral-950 hover:bg-neutral-200">
                Shop Now
              </Button>
            </Link>
            <Link to="/shop?category=Laptops">
              <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-900 bg-white hover:bg-neutral-100 hover:text-neutral-900">
                View Laptops
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
            <Link to="/shop" className="text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-10 text-neutral-500">Loading featured products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">New Arrivals</h2>
            <Link to="/shop" className="text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-10 text-neutral-500">Loading new arrivals...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}