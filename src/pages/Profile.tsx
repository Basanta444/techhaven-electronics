import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Order } from '../types';

export function Profile() {
  const { user } = useStore();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const message = location.state?.message;

  useEffect(() => {
    if (user) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => setOrders(data));
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-8 border border-green-200">
          {message}
        </div>
      )}

      <div className="bg-neutral-50 rounded-xl p-8 mb-8 border">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-neutral-600"><strong>Name:</strong> {user.name}</p>
        <p className="text-neutral-600"><strong>Email:</strong> {user.email}</p>
        <p className="text-neutral-600"><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
      </div>

      <h2 className="text-xl font-bold mb-6">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-neutral-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-6 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="font-bold mb-1">Order #{order.id}</div>
                <div className="text-sm text-neutral-500">{new Date(order.date).toLocaleDateString()}</div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold">${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-neutral-500">{order.items.length} items</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
