import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store';
import { Product, Order } from '../types';
import { Button } from '../components/ui/button';
import { Package, Users, ShoppingBag, Plus, Trash2 } from 'lucide-react';

export function Admin() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch('/api/products').then(res => res.json()).then(setProducts);
      fetch('/api/orders').then(res => res.json()).then(setOrders);
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleDeleteProduct = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status: status as any } : o));
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-2">
        <h2 className="font-bold text-xl mb-6">Admin Panel</h2>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${activeTab === 'products' ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'}`}
        >
          <Package className="h-5 w-5" /> Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'}`}
        >
          <ShoppingBag className="h-5 w-5" /> Orders
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-neutral-500 text-sm font-medium mb-2">Total Revenue</h3>
            <div className="text-3xl font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-neutral-500 text-sm font-medium mb-2">Total Orders</h3>
            <div className="text-3xl font-bold">{orders.length}</div>
          </div>
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-neutral-500 text-sm font-medium mb-2">Total Products</h3>
            <div className="text-3xl font-bold">{products.length}</div>
          </div>
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Manage Products</h3>
              <Button size="sm" className="flex items-center gap-2"><Plus className="h-4 w-4"/> Add Product</Button>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b">
                  <tr>
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="p-4 flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        <span className="font-medium">{product.name}</span>
                      </td>
                      <td className="p-4">${product.price}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h3 className="text-xl font-bold mb-6">Manage Orders</h3>
            <div className="border rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b">
                  <tr>
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="p-4 font-medium">{order.id}</td>
                      <td className="p-4 text-neutral-500">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="p-4 font-medium">${order.total.toLocaleString()}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="border rounded-md px-2 py-1 text-sm bg-transparent"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
