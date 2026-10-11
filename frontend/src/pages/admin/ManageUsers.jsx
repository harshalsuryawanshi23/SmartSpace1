import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Power,
  ShieldAlert,
  Shield,
  UserCheck,
  Calendar,
} from 'lucide-react';
import {
  Input,
  Select,
  Badge,
  PageHeader,
  DataTable,
  Button,
} from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const ManageUsers = () => {
  const { users, currentUser, toggleUserStatus, organizations } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filteredUsers = users
    .filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const match =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

  const columns = [
    {
      header: 'Full Name',
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
            {u.name.charAt(0)}
          </div>
          <div>
            <strong className="font-heading font-bold text-ink text-sm block">
              {u.name}
            </strong>
            {u.id === currentUser?.id && (
              <span className="text-[10px] font-bold text-primary">
                (You / Current Session)
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Email Address',
      render: (u) => <span className="text-xs text-ink-soft">{u.email}</span>,
    },
    {
      header: 'System Role',
      render: (u) => (
        <Badge
          variant={
            u.role === 'admin'
              ? 'completed'
              : u.role === 'manager'
              ? 'confirmed'
              : 'default'
          }
        >
          {u.role}
        </Badge>
      ),
    },
    {
      header: 'Organization',
      render: (u) => {
        const org = organizations.find((o) => o.id === u.organizationId);
        return (
          <span className="text-xs text-ink-soft">
            {org?.name || '—'}
          </span>
        );
      },
    },
    {
      header: 'Joined On',
      render: (u) => (
        <span className="text-xs text-ink-soft font-mono">{u.joinedOn}</span>
      ),
    },
    {
      header: 'Status',
      render: (u) => <Badge variant={u.status}>{u.status}</Badge>,
    },
    {
      header: 'Actions',
      render: (u) => {
        const isSelf = u.id === currentUser?.id;
        return (
          <button
            onClick={() => toggleUserStatus(u.id)}
            disabled={isSelf}
            className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
              isSelf
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : u.status === 'active'
                ? 'text-rose-600 hover:bg-rose-50'
                : 'text-emerald-600 hover:bg-emerald-50'
            }`}
            title={
              isSelf
                ? 'Cannot deactivate yourself'
                : u.status === 'active'
                ? 'Deactivate Account'
                : 'Activate Account'
            }
          >
            <Power className="w-3.5 h-3.5" />
            <span>{u.status === 'active' ? 'Deactivate' : 'Activate'}</span>
          </button>
        );
      },
    },
  ];

  return (
    <div className="py-2">
      <PageHeader
        title="Manage User Accounts"
        subtitle="View all platform residents, managers, and administrators; manage active access."
      />

      {/* Filters row */}
      <div className="clay p-4 bg-surface border border-white mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or role..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={[
              { value: '', label: 'All Roles' },
              { value: 'user', label: 'User (Resident)' },
              { value: 'manager', label: 'Space Manager' },
              { value: 'admin', label: 'Administrator' },
            ]}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        emptyMessage="No users found matching your search."
      />
    </div>
  );
};
