import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// --- In-Memory Data Store ---
let products = [
  { id: '1', name: 'MacBook Pro 16"', price: 2499, category: 'Laptops', brand: 'Apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', specs: 'M3 Max, 32GB RAM, 1TB SSD', featured: true, newArrival: false, sale: false },
  { id: '2', name: 'iPhone 15 Pro', price: 999, category: 'Smartphones', brand: 'Apple', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', specs: 'A17 Pro, 256GB', featured: true, newArrival: true, sale: false },
  { id: '3', name: 'Sony WH-1000XM5', price: 398, category: 'Audio', brand: 'Sony', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800', specs: 'Noise Cancelling, 30h battery', featured: false, newArrival: false, sale: true },
  { id: '4', name: 'Samsung Odyssey G9', price: 1299, category: 'Monitors', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', specs: '49" Curved, 240Hz', featured: true, newArrival: false, sale: true },
  { id: '5', name: 'Dell XPS 15', price: 1899, category: 'Laptops', brand: 'Dell', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800', specs: 'Intel i9, 32GB RAM, RTX 4070', featured: false, newArrival: true, sale: false },
  { id: '6', name: 'Logitech MX Master 3S', price: 99, category: 'Accessories', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800', specs: 'Wireless, Ergonomic', featured: false, newArrival: false, sale: false }
];

let orders: any[] = [];
let users = [{ id: '1', email: 'admin@techhaven.com', password: 'password', role: 'admin', name: 'Admin User' }];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---
  
  // Products
  app.get('/api/products', (req, res) => {
    res.json(products);
  });
  
  app.post('/api/products', (req, res) => {
    const newProduct = { ...req.body, id: Date.now().toString() };
    products.push(newProduct);
    res.json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx > -1) {
      products[idx] = { ...products[idx], ...req.body };
      res.json(products[idx]);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    res.json(orders);
  });

  app.post('/api/orders', (req, res) => {
    const newOrder = { ...req.body, id: 'ORD-' + Math.floor(Math.random() * 1000000), status: 'Processing', date: new Date().toISOString() };
    orders.push(newOrder);
    res.json(newOrder);
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const idx = orders.findIndex(o => o.id === req.params.id);
    if (idx > -1) {
      orders[idx].status = req.body.status;
      res.json(orders[idx]);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  // Auth (Mock)
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      const newUser = { id: Date.now().toString(), email, password, name, role: 'user' };
      users.push(newUser);
      res.json({ user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
