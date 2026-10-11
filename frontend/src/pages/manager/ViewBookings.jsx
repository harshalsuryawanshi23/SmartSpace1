import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  Input,
  Select,
  Badge,
  PageHeader,
  DataTable,
  Button,
  ConfirmDialog,
} from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const ViewBookings = ({ isAdminView = false }) => {
  const {
    bookings,
    spaces,
    users,
    organizations,
    currentUser,
    cancelBooking,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('');
  const [spaceFilter, setSpaceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const orgId = currentUser?.organizationId;
  const orgSpaces = spaces.filter((s) => {
    if (!isAdminView && currentUser?.role === 'manager') {
      return s.organizationId === orgId;
    }
    return true;
  });
  const orgSpaceIds = orgSpaces.map((s) => s.id);

  const filteredBookings = bookings
    .filter((b) => orgSpaceIds.includes(b.spaceId))
    .filter((b) => {
      if (statusFilter && b.status !== statusFilter) return false;
      if (spaceFilter && b.spaceId !== spaceFilter) return false;
      if (dateFilter && b.date !== dateFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const spaceObj = spaces.find((s) => s.id === b.spaceId);
        const userObj = users.find((u) => u.id === b.userId);
        const match =
          b.id.toLowerCase().includes(q) ||
          b.purpose?.toLowerCase().includes(q) ||
          spaceObj?.name.toLowerCase().includes(q) ||
          userObj?.name.toLowerCase().includes(q) ||
          userObj?.email.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

  const handlePromptCancel = (b) => {
    setBookingToCancel(b);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
      await cancelBooking(bookingToCancel.id);
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    } finally {
      setIsCancelling(false);
    }
  };

  const spaceOptions = [
    { value: '', label: 'All Spaces' },
    ...orgSpaces.map((s) => ({ value: s.id, label: s.name })),
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const columns = [
    {
      header: 'Booking ID',
      render: (b) => (
        <span className="font-mono font-bold text-xs text-primary bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
          {b.id}
        </span>
      ),
    },
    {
      header: 'User / Resident',
      render: (b) => {
        const u = users.find((user) => user.id === b.userId);
        return (
          <div>
            <strong className="text-ink text-sm block font-heading">
              {u?.name || 'Resident'}
            </strong>
            <span className="text-[11px] text-ink-soft">{u?.email}</span>
          </div>
        );
      },
    },
    {
      header: 'Venue',
      render: (b) => {
        const s = spaces.find((space) => space.id === b.spaceId);
        return (
          <div>
            <span className="text-xs font-semibold text-ink block">{s?.name}</span>
            <span className="text-[11px] text-ink-soft">{s?.area}</span>
          </div>
        );
      },
    },
    {
      header: 'Slot Date & Time',
      render: (b) => (
        <div>
          <span className="text-xs font-bold text-ink block">{b.date}</span>
          <span className="text-[11px] font-mono text-ink-soft">
            {b.startTime} – {b.endTime}
          </span>
        </div>
      ),
    },
    {
      header: 'Attendees & Purpose',
      render: (b) => (
        <div className="max-w-xs">
          <span className="text-xs font-semibold text-ink">
            {b.people} guests
          </span>
          <p className="text-[11px] text-ink-soft truncate">{b.purpose}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (b) => <Badge variant={b.status}>{b.status}</Badge>,
    },
    {
      header: 'Gate Entry',
      render: (b) => (
        <Badge variant={b.entryStatus === 'entered' ? 'entered' : 'pending'}>
          {b.entryStatus}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (b) => (
        <div>
          {b.status === 'confirmed' && (
            <button
              onClick={() => handlePromptCancel(b)}
              className="text-xs font-bold text-danger hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="py-2">
      <PageHeader
        title={isAdminView ? 'All Platform Bookings' : 'Organization Bookings'}
        subtitle={
          isAdminView
            ? 'Supervise reservations across all organizations, track entry logs, or manage cancellations.'
            : 'Track incoming reservations, verified entry logs, and attendee volumes.'
        }
      />

      {/* Filter Row */}
      <div className="clay p-4 bg-surface border border-white mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Input
          placeholder="Search by ID, user, or venue..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          options={spaceOptions}
          value={spaceFilter}
          onChange={(e) => setSpaceFilter(e.target.value)}
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredBookings}
        emptyMessage="No reservations match the selected filter criteria."
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Confirmed Booking?"
        message={`Are you sure you want to cancel booking ${bookingToCancel?.id}? The slot will be released immediately.`}
        confirmText="Cancel Reservation"
        isDanger={true}
        isLoading={isCancelling}
      />
    </div>
  );
};
