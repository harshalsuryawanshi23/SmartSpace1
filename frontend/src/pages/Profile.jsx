import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Building,
  Calendar,
  RefreshCw,
  LogOut,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Button, Badge, ConfirmDialog, PageHeader } from '../components/ui.jsx';
import { useApp } from '../context/AppContext.jsx';

export const Profile = () => {
  const { currentUser, organizations, logout, resetDemoData } = useApp();
  const navigate = useNavigate();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const org = organizations.find((o) => o.id === currentUser?.organizationId);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await resetDemoData();
      setConfirmResetOpen(false);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <PageHeader
        title="Account Profile"
        subtitle="Manage your personal details, role assignments, and active demo session."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="clay p-6 bg-surface flex flex-col items-center text-center border border-white">
          <div className="w-20 h-20 rounded-3xl clay-bubble bg-primary text-white flex items-center justify-center font-heading font-extrabold text-2xl mb-4">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <h2 className="font-heading font-bold text-xl text-ink">
            {currentUser?.name}
          </h2>
          <p className="text-xs text-ink-soft mb-3">{currentUser?.email}</p>
          <Badge variant={currentUser?.role || 'default'}>
            Role: {currentUser?.role}
          </Badge>

          <div className="w-full mt-6 pt-4 border-t border-indigo-100 flex flex-col gap-2">
            <Button
              variant="danger"
              size="sm"
              icon={LogOut}
              className="w-full"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="md:col-span-2 clay p-6 md:p-8 bg-surface border border-white flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-ink mb-4 pb-2 border-b border-indigo-100">
              Account Metadata & Permissions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="clay-inset p-3.5 rounded-2xl bg-[#EAECFA]/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-primary" /> System Access Role
                </span>
                <span className="text-sm font-extrabold text-ink capitalize">
                  {currentUser?.role} Member
                </span>
              </div>

              <div className="clay-inset p-3.5 rounded-2xl bg-[#EAECFA]/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5 mb-1">
                  <Building className="w-3.5 h-3.5 text-accent" /> Assigned Organization
                </span>
                <span className="text-sm font-extrabold text-ink truncate block">
                  {org ? org.name : 'Independent Member (No Org)'}
                </span>
              </div>

              <div className="clay-inset p-3.5 rounded-2xl bg-[#EAECFA]/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Joined Platform On
                </span>
                <span className="text-sm font-extrabold text-ink">
                  {currentUser?.joinedOn || '2025-01-15'}
                </span>
              </div>

              <div className="clay-inset p-3.5 rounded-2xl bg-[#EAECFA]/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Account Status
                </span>
                <span className="text-sm font-extrabold text-emerald-700 capitalize">
                  {currentUser?.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-ink-soft leading-relaxed mb-6">
              <strong className="text-ink">Prototype Environment Note:</strong> All operations
              in this prototype run against client-side mock storage. Data persists across browser
              refreshes via localStorage. You can restore the initial state at any time below.
            </div>
          </div>

          {/* Reset Demo Data Action */}
          <div className="pt-4 border-t border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-ink block">
                Reset Demo Data
              </span>
              <span className="text-[11px] text-ink-soft">
                Revert spaces, bookings, and schedules to fresh demo defaults.
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={() => setConfirmResetOpen(true)}
            >
              Reset All Data
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Mock Data?"
        message="This will reset all spaces, bookings, users, and schedules to their initial demo mock state. Any bookings or spaces you created will be reset."
        confirmText="Yes, Reset Everything"
        isDanger={false}
        isLoading={isResetting}
      />
    </div>
  );
};
