import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Button } from '../components/ui/button';

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'Logitech'];
const CATEGORIES = ['Laptops', 'Smartphones', 'Audio', 'Monitors', 'Accessories'];

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);

  const categoryFilter = searchParams.get('category');
  const brandFilter = searchParams.get('brand');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    let result = products;
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (brandFilter) {
      result = result.filter(p => p.brand === brandFilter);
    }
    setFiltered(result);
  }, [categoryFilter, brandFilter, products]);

  const updateFilter = (type: 'category' | 'brand', value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(type, value);
    } else {
      newParams.delete(type);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div>
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-500">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => updateFilter('category', null)}
              className={`block text-sm hover:underline ${!categoryFilter ? 'font-bold' : ''}`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => updateFilter('category', cat)}
                className={`block text-sm hover:underline ${categoryFilter === cat ? 'font-bold' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-500">Brands</h3>
          <div className="space-y-2">
            <button
              onClick={() => updateFilter('brand', null)}
              className={`block text-sm hover:underline ${!brandFilter ? 'font-bold' : ''}`}
            >
              All Brands
            </button>
            {BRANDS.map(brand => (
              <button
                key={brand}
                onClick={() => updateFilter('brand', brand)}
                className={`block text-sm hover:underline ${brandFilter === brand ? 'font-bold' : ''}`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Shop</h1>
          <span className="text-sm text-neutral-500">{filtered.length} products</span>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-neutral-500">
            No products match your filters.
          </div>
        )}
      </main>
    </div>
  );
}
