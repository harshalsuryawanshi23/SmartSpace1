import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  CalendarCheck,
  Calendar,
  Layers,
  QrCode,
  Plus,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Users,
} from 'lucide-react';
import {
  StatCard,
  Button,
  Badge,
  PageHeader,
  EmptyState,
} from '../../components/ui.jsx';
import { SpaceForm } from '../../components/SpaceForm.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { getTodayStr } from '../../services/api.js';

export const ManagerDashboard = () => {
  const { currentUser, spaces, bookings, schedules, organizations } = useApp();
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);

  const today = getTodayStr();
  const orgId = currentUser?.organizationId;
  const currentOrg = organizations.find((o) => o.id === orgId);

  // Filter items scoped to this manager's organization
  const orgSpaces = spaces.filter((s) => s.organizationId === orgId);
  const orgSpaceIds = orgSpaces.map((s) => s.id);

  const orgBookings = bookings.filter((b) => orgSpaceIds.includes(b.spaceId));
  const orgSchedules = schedules.filter((s) => orgSpaceIds.includes(s.spaceId));

  // Stats
  const totalSpaces = orgSpaces.length;
  const activeSpaces = orgSpaces.filter((s) => s.status === 'active').length;
  const inactiveSpaces = totalSpaces - activeSpaces;

  const todayBookings = orgBookings.filter(
    (b) => b.date === today && b.status === 'confirmed'
  );
  const upcomingBookings = orgBookings.filter(
    (b) => b.date >= today && b.status === 'confirmed'
  );

  // Today's schedule events (both bookings & manager blocks)
  const todayBlocks = orgSchedules.filter((s) => s.date === today);

  const todayTimeline = [
    ...todayBookings.map((b) => ({
      id: b.id,
      type: 'Booking',
      title: b.purpose,
      time: `${b.startTime} – ${b.endTime}`,
      spaceId: b.spaceId,
      status: b.entryStatus === 'entered' ? 'Entered' : 'Confirmed',
      ref: b.id,
      badgeVariant: b.entryStatus === 'entered' ? 'entered' : 'confirmed',
    })),
    ...todayBlocks.map((s) => ({
      id: s.id,
      type: 'Block',
      title: s.purpose,
      time: `${s.startTime} – ${s.endTime}`,
      spaceId: s.spaceId,
      status: 'Maintenance Block',
      ref: 'Maint.',
      badgeVariant: 'pending',
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  const recentBookings = orgBookings.slice(0, 5);

  return (
    <div className="py-2">
      <PageHeader
        title={`${currentOrg?.name || 'Organization'} Dashboard`}
        subtitle={`Managing facilities and reservations for ${currentOrg?.city || 'Local Society'}.`}
        action={
          <div className="flex items-center gap-2">
            <Link to="/manager/verify-entry">
              <Button variant="secondary" icon={QrCode}>
                Verify Entry
              </Button>
            </Link>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setSpaceModalOpen(true)}
            >
              Add Space
            </Button>
          </div>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Managed Spaces"
          value={totalSpaces}
          subtitle={`${activeSpaces} active • ${inactiveSpaces} inactive`}
          icon={Building}
          color="primary"
        />
        <StatCard
          title="Today's Reservations"
          value={todayBookings.length}
          subtitle="Confirmed for today"
          icon={CalendarCheck}
          color="success"
        />
        <StatCard
          title="Upcoming Bookings"
          value={upcomingBookings.length}
          subtitle="Next 30 days"
          icon={Calendar}
          color="warning"
        />
        <StatCard
          title="Active vs Inactive"
          value={`${activeSpaces} / ${totalSpaces}`}
          subtitle={`${inactiveSpaces} currently offline`}
          icon={Layers}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule Timeline */}
        <div className="lg:col-span-2 clay p-6 bg-surface border border-white">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-indigo-100">
            <div>
              <h3 className="font-heading font-bold text-lg text-ink">
                Today's Timeline ({today})
              </h3>
              <p className="text-xs text-ink-soft">
                Live bookings and maintenance blocks scheduled for today.
              </p>
            </div>
            <Link
              to="/manager/schedules"
              className="text-xs font-bold text-primary hover:underline"
            >
              Manage Blocks
            </Link>
          </div>

          {todayTimeline.length > 0 ? (
            <div className="divide-y divide-indigo-100/60">
              {todayTimeline.map((item) => {
                const spaceObj = orgSpaces.find((s) => s.id === item.spaceId);
                return (
                  <div
                    key={item.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-indigo-50/30 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl clay-bubble bg-indigo-50 text-primary flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-ink">
                            {spaceObj?.name || 'Space'}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-ink-soft">
                            ({item.ref})
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft">{item.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-ink">
                        {item.time}
                      </span>
                      <Badge variant={item.badgeVariant}>{item.status}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-ink-soft">
              No bookings or maintenance blocks scheduled for today.
            </div>
          )}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="flex flex-col gap-6">
          {/* Watchman Gate Pass Card */}
          <div className="clay p-6 bg-surface border border-white">
            <div className="w-10 h-10 rounded-2xl clay-bubble bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-ink mb-1">
              Watchman Entry Verification
            </h4>
            <p className="text-xs text-ink-soft mb-4 leading-relaxed">
              Verify incoming attendees at the security gate by scanning their QR pass and validating Aadhaar last 4 digits.
            </p>
            <Link to="/manager/verify-entry">
              <Button variant="primary" size="sm" className="w-full">
                Open Watchman Terminal
              </Button>
            </Link>
          </div>

          {/* Recent Bookings Scoped List */}
          <div className="clay p-6 bg-surface border border-white flex-1">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-100">
              <h4 className="font-heading font-bold text-base text-ink">
                Recent Bookings
              </h4>
              <Link
                to="/manager/bookings"
                className="text-xs font-bold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {recentBookings.length > 0 ? (
              <div className="space-y-3">
                {recentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="clay-inset p-3 rounded-2xl bg-[#EAECFA]/70 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-primary block">
                        {b.id}
                      </span>
                      <span className="text-ink-soft text-[11px]">
                        {b.date} • {b.startTime}
                      </span>
                    </div>
                    <Badge variant={b.status}>{b.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-ink-soft">
                No recent bookings recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Space Modal */}
      <SpaceForm
        isOpen={spaceModalOpen}
        onClose={() => setSpaceModalOpen(false)}
      />
    </div>
  );
};
