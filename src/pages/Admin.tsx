import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store';
import { Product, Order } from '../types';
import { Button } from '../components/ui/button';
import { Package, ShoppingBag, Plus, Trash2 } from 'lucide-react';

// 1. Import Firebase functions
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function Admin() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch both products and orders from Firebase if user is Admin
  useEffect(() => {
    const fetchAdminData = async () => {
      if (user?.role === 'admin') {
        try {
          setLoading(true);
          
          // Fetch Products
          const prodSnapshot = await getDocs(collection(db, 'products'));
          const prodList = prodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
          setProducts(prodList);

          // Fetch Orders (Will handle empty state cleanly if you don't have orders yet)
          const orderSnapshot = await getDocs(collection(db, 'orders'));
          const orderList = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
          setOrders(orderList);
        } catch (error) {
          console.error("Error fetching admin data: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAdminData();
  }, [user]);

  // Security Check: Redirect non-admins
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // 3. Delete product directly from Firestore
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  // 4. Update Order Status in Firestore
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status: status as any } : o));
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
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

        {loading ? (
          <div className="py-20 text-center text-neutral-500">Loading dashboard...</div>
        ) : activeTab === 'products' ? (
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
        ) : (
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