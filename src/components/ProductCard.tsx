import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store';
import { Button } from './ui/button';

export function ProductCard({ product }: { product: Product; key?: React.Key }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.some(item => item.id === product.id);

  return (
    <div className="group relative rounded-lg border bg-white p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-100 mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full mix-blend-multiply hover:scale-105 transition-transform duration-300"
        />
        {product.sale && (
          <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
            Sale
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur transition-colors hover:bg-white ${isWishlisted ? 'text-red-500' : 'text-neutral-500'}`}
        >
          <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="text-xs text-neutral-500 mb-1">{product.category}</div>
        <Link to={`/product/${product.id}`} className="font-medium hover:underline line-clamp-1 mb-1">
          {product.name}
        </Link>
        <div className="text-sm font-bold mt-auto mb-3">${product.price.toLocaleString()}</div>
        <Button onClick={() => addToCart(product)} className="w-full flex gap-2">
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
