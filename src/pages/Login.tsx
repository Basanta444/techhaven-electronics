import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/button';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { setUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, password, name };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      setUser(data.user);
      
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect') || '/';
      navigate(redirect);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-24 flex flex-col items-center">
      <div className="w-full bg-white p-8 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Welcome Back' : 'Create an Account'}</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-10 px-3 rounded-md border focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-md border focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-10 px-3 rounded-md border focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <Button type="submit" className="w-full">{isLogin ? 'Sign In' : 'Sign Up'}</Button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-black hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
        
        {isLogin && (
          <div className="mt-4 text-center text-xs text-neutral-400">
            Admin Demo: admin@techhaven.com / password
          </div>
        )}
      </div>
    </div>
  );
}
