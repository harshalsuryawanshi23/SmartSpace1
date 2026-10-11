import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Building,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import {
  StatCard,
  Button,
  Badge,
  PageHeader,
} from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const AdminDashboard = () => {
  const { users, organizations, spaces, bookings } = useApp();

  const totalUsers = users.length;
  const totalOrgs = organizations.length;
  const totalSpaces = spaces.length;
  const totalBookings = bookings.length;

  // Chart data: Bookings by status (Plain SVG / CSS, no external library)
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const statusCategories = [
    { label: 'Confirmed (Active)', count: confirmedCount, color: '#2FBF8F', bgClass: 'bg-emerald-500' },
    { label: 'Completed', count: completedCount, color: '#5B50E6', bgClass: 'bg-primary' },
    { label: 'Cancelled', count: cancelledCount, color: '#EF5D7A', bgClass: 'bg-rose-500' },
  ];

  const maxStatusCount = Math.max(confirmedCount, completedCount, cancelledCount, 1);

  // Role distribution
  const regularUsers = users.filter((u) => u.role === 'user').length;
  const managers = users.filter((u) => u.role === 'manager').length;
  const admins = users.filter((u) => u.role === 'admin').length;

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="py-2">
      <PageHeader
        title="System Administration Overview"
        subtitle="Cross-organization platform metrics, access distribution, and system-wide bookings."
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Platform Users"
          value={totalUsers}
          subtitle={`${regularUsers} residents • ${managers} managers`}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Partner Organizations"
          value={totalOrgs}
          subtitle="Societies & campuses"
          icon={Building2}
          color="accent"
        />
        <StatCard
          title="Total Listed Venues"
          value={totalSpaces}
          subtitle="Halls, rooms & clubhouses"
          icon={Building}
          color="warning"
        />
        <StatCard
          title="Cumulative Bookings"
          value={totalBookings}
          subtitle="All platform reservations"
          icon={ClipboardList}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simple Plain CSS/SVG Status Chart */}
        <div className="lg:col-span-2 clay p-6 md:p-8 bg-surface border border-white">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-indigo-100">
            <div>
              <h3 className="font-heading font-bold text-lg text-ink">
                Bookings Distribution by Status
              </h3>
              <p className="text-xs text-ink-soft">
                Clean CSS/SVG visualization of system-wide reservation lifecycles.
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-5 mb-8">
            {statusCategories.map((item) => {
              const percent = Math.round((item.count / totalBookings) * 100) || 0;
              const barWidth = Math.round((item.count / maxStatusCount) * 100);

              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-bold text-ink mb-1.5">
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${item.bgClass}`} />
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono text-ink-soft">
                      {item.count} reservations ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-[#EAECFA] p-0.5 clay-inset overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.bgClass} transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Admin Actions Strip */}
          <div className="pt-4 border-t border-indigo-100 flex flex-wrap gap-3">
            <Link to="/admin/users">
              <Button variant="secondary" size="sm" icon={Users}>
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/organizations">
              <Button variant="secondary" size="sm" icon={Building2}>
                Manage Organizations
              </Button>
            </Link>
            <Link to="/admin/spaces">
              <Button variant="secondary" size="sm" icon={Building}>
                Manage Spaces
              </Button>
            </Link>
            <Link to="/admin/bookings">
              <Button variant="secondary" size="sm" icon={ClipboardList}>
                Manage Bookings
              </Button>
            </Link>
          </div>
        </div>

        {/* User Roles Breakdown & Recent Platform Activity */}
        <div className="flex flex-col gap-6">
          <div className="clay p-6 bg-surface border border-white">
            <h4 className="font-heading font-bold text-base text-ink mb-3 pb-2 border-b border-indigo-100">
              Access Roles Distribution
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-soft">Resident Users</span>
                <span className="font-mono font-bold text-ink bg-indigo-50 px-2 py-0.5 rounded-md">
                  {regularUsers}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-soft">Society Managers</span>
                <span className="font-mono font-bold text-ink bg-emerald-50 px-2 py-0.5 rounded-md">
                  {managers}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-soft">System Administrators</span>
                <span className="font-mono font-bold text-ink bg-purple-50 px-2 py-0.5 rounded-md">
                  {admins}
                </span>
              </div>
            </div>
          </div>

          <div className="clay p-6 bg-surface border border-white flex-1">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-100">
              <h4 className="font-heading font-bold text-base text-ink">
                Global Recent Bookings
              </h4>
              <Link
                to="/admin/bookings"
                className="text-xs font-bold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentBookings.map((b) => {
                const sp = spaces.find((s) => s.id === b.spaceId);
                return (
                  <div
                    key={b.id}
                    className="clay-inset p-2.5 rounded-xl bg-[#EAECFA]/70 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-primary text-[11px] block">
                        {b.id}
                      </span>
                      <span className="text-ink text-[11px] font-semibold truncate block max-w-[130px]">
                        {sp?.name || 'Space'}
                      </span>
                    </div>
                    <Badge variant={b.status}>{b.status}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
