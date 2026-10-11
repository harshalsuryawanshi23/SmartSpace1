import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Input, Button } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/user/home');
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
            Join Smart Space
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Book halls, clubhouses, and meeting spaces in seconds.
          </p>
        </div>

        {/* Register Clay Card */}
        <div className="clay p-6 md:p-8 bg-surface border border-white">
          <h2 className="text-xl font-bold font-heading text-ink mb-1">
            Create User Account
          </h2>
          <p className="text-xs text-ink-soft mb-6">
            Register as a community member to browse and reserve nearby venues.
          </p>

          {error && (
            <div className="p-3 mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />

            <div className="text-[11px] text-ink-soft/80 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
              Note: New accounts are registered with the standard <strong>User</strong> role. Manager and Admin credentials are assigned by organization administrators.
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Register & Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-ink-soft">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
