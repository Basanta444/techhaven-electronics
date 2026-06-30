import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/button';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function Checkout() {
  const { cart, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
  });

  const handleShippingChange = (field: keyof typeof shipping) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping(prev => ({ ...prev, [field]: e.target.value }));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.id,
        items: cart,
        subtotal,
        tax,
        total,
        paymentMethod,
        shippingAddress: {
          firstName: shipping.firstName,
          lastName: shipping.lastName,
          street: shipping.address,
          city: shipping.city,
          zip: shipping.zip,
        },
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // Only clear the cart and navigate away after the order is confirmed saved.
      clearCart();
      navigate('/profile', { state: { message: 'Order placed successfully!' } });
    } catch (err) {
      console.error('Order creation failed:', err);
      setError('Something went wrong placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          {/* Shipping Info */}
          <div>
            <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="First Name"
                value={shipping.firstName}
                onChange={handleShippingChange('firstName')}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                required
                type="text"
                placeholder="Last Name"
                value={shipping.lastName}
                onChange={handleShippingChange('lastName')}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                required
                type="text"
                placeholder="Address"
                value={shipping.address}
                onChange={handleShippingChange('address')}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm md:col-span-2"
              />
              <input
                required
                type="text"
                placeholder="City"
                value={shipping.city}
                onChange={handleShippingChange('city')}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                required
                type="text"
                placeholder="ZIP Code"
                value={shipping.zip}
                onChange={handleShippingChange('zip')}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${paymentMethod === 'card' ? 'border-black bg-neutral-50' : 'hover:bg-neutral-50'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <span className="font-medium">Credit/Debit Card</span>
              </label>
              <label className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${paymentMethod === 'esewa' ? 'border-green-600 bg-green-50' : 'hover:bg-neutral-50'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'esewa'} onChange={() => setPaymentMethod('esewa')} />
                <span className="font-medium text-green-700">eSewa</span>
              </label>
              <label className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${paymentMethod === 'khalti' ? 'border-purple-600 bg-purple-50' : 'hover:bg-neutral-50'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'khalti'} onChange={() => setPaymentMethod('khalti')} />
                <span className="font-medium text-purple-700">Khalti</span>
              </label>
              <label className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${paymentMethod === 'cod' ? 'border-black bg-neutral-50' : 'hover:bg-neutral-50'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <span className="font-medium">Cash on Delivery</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <input type="text" placeholder="Card Number" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm col-span-2" />
                <input type="text" placeholder="MM/YY" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm" />
                <input type="text" placeholder="CVC" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm" />
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-neutral-50 p-6 rounded-lg border sticky top-24">
            <h2 className="text-lg font-bold mb-6">Order Total</h2>
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tax</span>
                <span className="font-medium">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-4 border-t flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : `Pay $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
