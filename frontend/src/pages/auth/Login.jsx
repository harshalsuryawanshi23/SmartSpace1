import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, User, ShieldCheck, ArrowRight, Building } from 'lucide-react';
import { Input, Button } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'manager') navigate('/manager/dashboard');
      else navigate('/user/home');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
    setError('');
    setIsLoading(true);
    try {
      const user = await login(demoEmail, 'Demo@123');
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'manager') navigate('/manager/dashboard');
      else navigate('/user/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-3xl clay-bubble bg-primary text-white flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-ink">
            Smart Space
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Find & book local society halls, clubhouses, and meeting rooms.
          </p>
        </div>

        {/* Login Clay Card */}
        <div className="clay p-6 md:p-8 bg-surface border border-white">
          <h2 className="text-xl font-bold font-heading text-ink mb-1">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-ink-soft mb-6">
            Enter your credentials to manage or reserve spaces.
          </p>

          {error && (
            <div className="p-3 mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8 text-ink-soft hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Login Buttons */}
          <div className="mt-8 pt-6 border-t border-indigo-100/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block text-center mb-3">
              Quick Demo 1-Click Login
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('user@demo.com')}
                className="clay-inset p-2 rounded-xl text-center hover:border-primary/50 transition-all flex flex-col items-center gap-1 group"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-100 text-primary flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-ink group-hover:text-primary">
                  User
                </span>
                <span className="text-[9px] text-ink-soft">Resident</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('manager@demo.com')}
                className="clay-inset p-2 rounded-xl text-center hover:border-primary/50 transition-all flex flex-col items-center gap-1 group"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Building className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-ink group-hover:text-primary">
                  Manager
                </span>
                <span className="text-[9px] text-ink-soft">Gulmohar Soc.</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin@demo.com')}
                className="clay-inset p-2 rounded-xl text-center hover:border-primary/50 transition-all flex flex-col items-center gap-1 group"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-ink group-hover:text-primary">
                  Admin
                </span>
                <span className="text-[9px] text-ink-soft">System Admin</span>
              </button>
            </div>
            <p className="text-[10px] text-center text-ink-soft/70 mt-2">
              All demo passwords: <code className="font-mono text-ink">Demo@123</code>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-ink-soft">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create User Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
