import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  History,
  XCircle,
  Search,
  Filter,
} from 'lucide-react';
import { Button, PageHeader, EmptyState } from '../../components/ui.jsx';
import { BookingCard } from '../../components/BookingCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { getTodayStr } from '../../services/api.js';

export const MyBookings = () => {
  const { currentUser, bookings } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past' | 'cancelled' | 'all'

  const today = getTodayStr();

  // Filter bookings for current logged in user
  const userBookings = bookings.filter((b) => b.userId === currentUser?.id);

  const upcomingBookings = userBookings.filter(
    (b) => b.status === 'confirmed' && b.date >= today
  ).sort((a, b) => a.date.localeCompare(b.date));

  const pastBookings = userBookings.filter(
    (b) => b.status === 'completed' || (b.status === 'confirmed' && b.date < today)
  ).sort((a, b) => b.date.localeCompare(a.date));

  const cancelledBookings = userBookings.filter(
    (b) => b.status === 'cancelled'
  ).sort((a, b) => b.date.localeCompare(a.date));

  let displayedBookings = userBookings;
  if (activeTab === 'upcoming') displayedBookings = upcomingBookings;
  else if (activeTab === 'past') displayedBookings = pastBookings;
  else if (activeTab === 'cancelled') displayedBookings = cancelledBookings;

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length, icon: Calendar },
    { id: 'past', label: 'Past & Completed', count: pastBookings.length, icon: History },
    { id: 'cancelled', label: 'Cancelled', count: cancelledBookings.length, icon: XCircle },
    { id: 'all', label: 'All History', count: userBookings.length, icon: CalendarCheck },
  ];

  return (
    <div className="py-2">
      <PageHeader
        title="My Space Bookings"
        subtitle="Manage your reservations, view instant QR entry passes, or cancel upcoming events."
        action={
          <Link to="/user/search">
            <Button variant="primary" icon={Search}>
              Book Another Space
            </Button>
          </Link>
        }
      />

      {/* Tabs Filter Strip */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 clay-inset bg-[#EAECFA] rounded-2xl w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all select-none ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-soft hover:text-ink hover:bg-white/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-ink-soft'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookings Grid or Empty State */}
      {displayedBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBookings.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title={`No ${activeTab} bookings`}
          description={
            activeTab === 'upcoming'
              ? 'You do not have any active upcoming reservations. Browse nearby community spaces to book.'
              : `You do not have any bookings in the ${activeTab} category.`
          }
          actionText="Find Spaces"
          onAction={() => window.location.assign('/user/search')}
        />
      )}
    </div>
  );
};
