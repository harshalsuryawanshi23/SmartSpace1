import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { Toast, Button } from './ui.jsx';
import {
  Sparkles,
  Home,
  Search,
  CalendarCheck,
  User,
  LayoutDashboard,
  Building,
  CheckCircle2,
  CalendarRange,
  ClipboardList,
  ShieldCheck,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  RefreshCw,
  QrCode,
  Layers,
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { currentUser, logout, switchDemoRole, toast, closeToast, resetDemoData } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const role = currentUser?.role || 'user';

  const handleRoleChange = async (targetRole) => {
    if (targetRole === role) return;
    setSwitchingRole(true);
    try {
      await switchDemoRole(targetRole);
      // Redirect to that role's default page
      if (targetRole === 'user') navigate('/user/home');
      else if (targetRole === 'manager') navigate('/manager/dashboard');
      else if (targetRole === 'admin') navigate('/admin/dashboard');
    } finally {
      setSwitchingRole(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Nav configurations per role
  const userNavLinks = [
    { label: 'Home', path: '/user/home', icon: Home },
    { label: 'Search Spaces', path: '/user/search', icon: Search },
    { label: 'My Bookings', path: '/user/bookings', icon: CalendarCheck },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const managerNavLinks = [
    { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
    { label: 'Spaces', path: '/manager/spaces', icon: Building },
    { label: 'Facilities', path: '/manager/facilities', icon: Layers },
    { label: 'Schedules', path: '/manager/schedules', icon: CalendarRange },
    { label: 'Bookings', path: '/manager/bookings', icon: ClipboardList },
    { label: 'Verify Entry', path: '/manager/verify-entry', icon: QrCode },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const adminNavLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Organizations', path: '/admin/organizations', icon: Building2 },
    { label: 'Spaces', path: '/admin/spaces', icon: Building },
    { label: 'Bookings', path: '/admin/bookings', icon: ClipboardList },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const currentNavLinks =
    role === 'admin'
      ? adminNavLinks
      : role === 'manager'
      ? managerNavLinks
      : userNavLinks;

  // Demo switcher component
  const DemoRoleSwitcher = () => (
    <div className="flex items-center gap-1.5 p-1 bg-[#EAECFA] rounded-full border border-white/70">
      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft px-2 hidden sm:inline">
        Demo Mode:
      </span>
      {['user', 'manager', 'admin'].map((r) => {
        const isActive = role === r;
        return (
          <button
            key={r}
            type="button"
            disabled={switchingRole}
            onClick={() => handleRoleChange(r)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize transition-all ${
              isActive
                ? 'bg-primary text-white shadow-xs'
                : 'text-ink-soft hover:text-ink hover:bg-white/60'
            }`}
          >
            {r}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      {/* USER ROLE: Floating Top Navbar */}
      {role === 'user' && (
        <header className="sticky top-4 z-40 px-4 md:px-8 mb-6">
          <nav className="max-w-7xl mx-auto clay px-4 sm:px-6 py-3.5 flex items-center justify-between border border-white/80">
            {/* Logo */}
            <NavLink to="/user/home" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl clay-bubble bg-primary text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-lg text-ink leading-tight group-hover:text-primary transition-colors">
                  Smart Space
                </span>
                <span className="text-[10px] text-ink-soft font-semibold tracking-wider uppercase">
                  Community Venue Booking
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {userNavLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-ink-soft hover:text-ink hover:bg-indigo-50/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Right Controls: Role Switcher & User Pill */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <DemoRoleSwitcher />
              </div>

              <NavLink
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full clay-inset bg-[#EAECFA] text-xs font-semibold text-ink hover:border-primary/50"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <span>{currentUser?.name?.split(' ')[0]}</span>
              </NavLink>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-indigo-50"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>

          {/* Mobile Drawer for User */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 max-w-7xl mx-auto clay p-4 flex flex-col gap-3 border border-white">
              <div className="py-2 border-b border-indigo-100 flex justify-between items-center">
                <DemoRoleSwitcher />
              </div>
              <div className="flex flex-col gap-1">
                {userNavLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-ink-soft hover:bg-indigo-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-indigo-100 flex items-center justify-between">
                <div className="text-xs text-ink-soft">
                  Logged in as <strong className="text-ink">{currentUser?.name}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold text-danger flex items-center gap-1 hover:underline"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>
          )}
        </header>
      )}

      {/* MANAGER & ADMIN ROLES: Left Sidebar Layout */}
      {(role === 'manager' || role === 'admin') && (
        <div className="flex min-h-screen">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-72 p-5 border-r border-indigo-100/70 bg-surface/80 backdrop-blur-md shrink-0">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-100">
              <div className="w-10 h-10 rounded-2xl clay-bubble bg-primary text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg text-ink block leading-tight">
                  Smart Space
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {role === 'manager' ? 'Space Manager' : 'System Admin'}
                </span>
              </div>
            </div>

            {/* Demo Role Switcher in Sidebar */}
            <div className="mb-6">
              <DemoRoleSwitcher />
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft px-3 mb-1">
                Management Menu
              </span>
              {currentNavLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-ink-soft hover:text-ink hover:bg-indigo-50/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Current user card & quick logout */}
            <div className="pt-4 border-t border-indigo-100 flex flex-col gap-3">
              <div className="clay-inset p-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {currentUser?.name?.charAt(0) || 'M'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-ink truncate">
                    {currentUser?.name}
                  </span>
                  <span className="text-[10px] text-ink-soft truncate">
                    {currentUser?.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-danger hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Mobile Topbar for Manager/Admin */}
          <div className="flex-1 flex flex-col min-w-0">
            <header className="lg:hidden sticky top-0 z-30 px-4 py-3 bg-surface/90 backdrop-blur-md border-b border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <span className="font-heading font-extrabold text-base text-ink">
                  Smart Space
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary ml-1">
                  ({role})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-ink hover:bg-indigo-50"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </header>

            {/* Mobile Drawer for Manager/Admin */}
            {mobileMenuOpen && (
              <div className="lg:hidden bg-surface p-5 border-b border-indigo-100 flex flex-col gap-4 animate-fade-in">
                <DemoRoleSwitcher />
                <div className="flex flex-col gap-1">
                  {currentNavLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-ink-soft hover:bg-indigo-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-indigo-100 flex items-center justify-between">
                  <span className="text-xs text-ink-soft">{currentUser?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-danger flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </div>
            )}

            {/* Main content viewport */}
            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      )}

      {/* For User Role: Standard Container */}
      {role === 'user' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pb-12">
          {children}
        </main>
      )}

      {/* Shared Footer */}
      <footer className="mt-auto py-6 border-t border-indigo-100/60 text-center text-xs text-ink-soft">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Smart Space — Local Community Halls & Meeting Spaces</p>
          <div className="flex items-center gap-4">
            <button
              onClick={resetDemoData}
              className="text-primary hover:underline flex items-center gap-1 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Data
            </button>
          </div>
        </div>
      </footer>

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};
