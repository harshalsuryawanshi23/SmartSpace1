import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  MapPin,
  Building,
  ShieldCheck,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button, Select, Input, Badge, EmptyState } from '../../components/ui.jsx';
import { SpaceCard } from '../../components/SpaceCard.jsx';
import { BookingCard } from '../../components/BookingCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { getTodayStr } from '../../services/api.js';

export const Home = () => {
  const { currentUser, spaces, bookings } = useApp();
  const navigate = useNavigate();

  // Quick search state
  const [quickType, setQuickType] = useState('');
  const [quickDate, setQuickDate] = useState('');
  const [quickPeople, setQuickPeople] = useState('');

  const today = getTodayStr();

  // Find user's next upcoming booking
  const userBookings = bookings.filter((b) => b.userId === currentUser?.id);
  const upcomingBookings = userBookings.filter(
    (b) => b.status === 'confirmed' && b.date >= today
  ).sort((a, b) => (a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)));

  const nextBooking = upcomingBookings[0] || null;
  const recentBookings = userBookings.slice(0, 3);

  // Active spaces for featured list
  const activeSpaces = spaces.filter((s) => s.status === 'active');
  const featuredSpaces = activeSpaces.slice(0, 3);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (quickType) params.set('type', quickType);
    if (quickDate) params.set('date', quickDate);
    if (quickPeople) params.set('people', quickPeople);
    navigate(`/user/search?${params.toString()}`);
  };

  const spaceTypes = [
    { value: '', label: 'Any Space Type' },
    { value: 'Community Hall', label: 'Community Hall' },
    { value: 'Society Clubhouse', label: 'Society Clubhouse' },
    { value: 'Meeting Room', label: 'Meeting Room' },
    { value: 'Classroom', label: 'Classroom' },
    { value: 'Terrace Hall', label: 'Terrace Hall' },
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-10 py-2">
      {/* Hero Welcome Banner */}
      <section className="clay p-6 md:p-10 bg-surface border border-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-primary mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Welcome back, {currentUser?.name?.split(' ')[0] || 'Member'}!</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-ink tracking-tight leading-tight mb-3">
            Book physical spaces in your neighborhood.
          </h1>

          <p className="text-sm md:text-base text-ink-soft mb-6 leading-relaxed">
            Reserve community halls, clubhouses, meeting rooms, and classrooms
            instantly with verified QR entry passes and local decorator options.
          </p>

          <Link to="/user/search">
            <Button variant="primary" size="lg" icon={Search} className="gap-2">
              Browse All Spaces
            </Button>
          </Link>
        </div>

        {/* Quick Search Strip */}
        <div className="mt-8 pt-6 border-t border-indigo-100">
          <form
            onSubmit={handleQuickSearch}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#EAECFA]/70 p-3.5 rounded-2xl border border-white"
          >
            <div className="sm:col-span-1">
              <Select
                options={spaceTypes}
                value={quickType}
                onChange={(e) => setQuickType(e.target.value)}
              />
            </div>
            <div className="sm:col-span-1">
              <Input
                type="date"
                min={today}
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                placeholder="Select date"
              />
            </div>
            <div className="sm:col-span-1">
              <Input
                type="number"
                min="1"
                placeholder="Guests count"
                value={quickPeople}
                onChange={(e) => setQuickPeople(e.target.value)}
              />
            </div>
            <div className="sm:col-span-1 flex items-center">
              <Button type="submit" variant="primary" className="w-full">
                Find Spaces
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Next Upcoming Booking Section (Signature Feature) */}
      {nextBooking && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Your Next Reservation
              </span>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-ink">
                Upcoming Booking & QR Pass
              </h2>
            </div>
            <Link
              to="/user/bookings"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>All Bookings ({userBookings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="max-w-xl">
            <BookingCard booking={nextBooking} />
          </div>
        </section>
      )}

      {/* Featured Available Spaces */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              Popular Venues
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-heading text-ink">
              Featured Spaces Nearby
            </h2>
          </div>
          <Link
            to="/user/search"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All ({activeSpaces.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </section>

      {/* Platform Features Pill Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="clay p-5 bg-surface flex items-start gap-3.5 border border-white">
          <div className="w-10 h-10 rounded-2xl clay-bubble bg-indigo-100 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-ink mb-0.5">
              Instant QR Entry Pass
            </h4>
            <p className="text-xs text-ink-soft leading-relaxed">
              Every confirmed booking includes a secure QR pass with Aadhaar verification for gate security.
            </p>
          </div>
        </div>

        <div className="clay p-5 bg-surface flex items-start gap-3.5 border border-white">
          <div className="w-10 h-10 rounded-2xl clay-bubble bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-ink mb-0.5">
              Live Slot Conflict Prevention
            </h4>
            <p className="text-xs text-ink-soft leading-relaxed">
              Only shows halls that are free for your chosen hours with zero double-booking overlap.
            </p>
          </div>
        </div>

        <div className="clay p-5 bg-surface flex items-start gap-3.5 border border-white">
          <div className="w-10 h-10 rounded-2xl clay-bubble bg-orange-100 text-accent flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-ink mb-0.5">
              Local Decorator Matching
            </h4>
            <p className="text-xs text-ink-soft leading-relaxed">
              Find verified floral, balloon, and stage decorators tailored to your venue and occasion.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
