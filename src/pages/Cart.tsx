import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-neutral-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-white">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md bg-neutral-50" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-500 mb-2">{item.brand}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 border rounded-md px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-neutral-50 p-6 rounded-lg border sticky top-24">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tax (10%)</span>
                <span className="font-medium">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="pt-4 border-t flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <Link to="/checkout" className="block w-full">
              <Button className="w-full flex items-center gap-2">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
