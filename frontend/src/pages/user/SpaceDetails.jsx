import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  MapPin,
  Clock,
  Building,
  Shield,
  Sparkles,
  Phone,
  Star,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ChevronLeft,
  Info,
} from 'lucide-react';
import {
  Button,
  Badge,
  FacilityChips,
  Spinner,
  getSpaceTypeDetails,
} from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { apiGetSpaceById, daysFromNow, getTodayStr, checkOverlap } from '../../services/api.js';

export const SpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { facilities, decorators, bookings, schedules } = useApp();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const prefillDate = searchParams.get('date') || '';
  const prefillStart = searchParams.get('start') || '';
  const prefillEnd = searchParams.get('end') || '';

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const data = await apiGetSpaceById(id);
        setSpace(data);
      } catch (err) {
        setError(err.message || 'Space not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [id]);

  if (loading) {
    return <Spinner message="Loading venue details..." />;
  }

  if (error || !space) {
    return (
      <div className="clay p-8 text-center bg-surface my-8 max-w-xl mx-auto">
        <h3 className="text-xl font-bold font-heading text-danger mb-2">Space Not Found</h3>
        <p className="text-sm text-ink-soft mb-4">{error || 'This space does not exist.'}</p>
        <Link to="/user/search">
          <Button variant="secondary">Back to Search</Button>
        </Link>
      </div>
    );
  }

  const spaceFacilities = facilities.filter((f) =>
    space.facilityIds?.includes(f.id)
  );

  const typeDetails = getSpaceTypeDetails(space.type);
  const TypeIcon = typeDetails.icon;

  // Next 7 days availability matrix
  const next7Days = Array.from({ length: 7 }, (_, i) => daysFromNow(i));

  const handleBookNow = () => {
    let url = `/user/book/${space.id}`;
    const params = new URLSearchParams();
    if (prefillDate) params.set('date', prefillDate);
    if (prefillStart) params.set('start', prefillStart);
    if (prefillEnd) params.set('end', prefillEnd);
    if (params.toString()) url += `?${params.toString()}`;
    navigate(url);
  };

  return (
    <div className="max-w-5xl mx-auto py-2">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Spaces
      </button>

      {/* Main Hero Card */}
      <div className="clay p-6 md:p-8 bg-surface border border-white mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-indigo-100">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-3xl clay-bubble ${typeDetails.bg} ${typeDetails.text} flex items-center justify-center shrink-0 border ${typeDetails.border}`}
            >
              <TypeIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  {space.type}
                </span>
                <Badge variant={space.status}>{space.status}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-ink">
                {space.name}
              </h1>
              <p className="text-xs md:text-sm text-ink-soft mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  {space.area}, {space.city} • {space.building} ({space.floor})
                </span>
              </p>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4 shrink-0 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100/70">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-soft block">
                Standard Rate (Info Only)
              </span>
              <div className="text-2xl font-extrabold font-heading text-ink">
                ₹{space.ratePerHour}{' '}
                <span className="text-xs font-normal text-ink-soft">/ hour</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleBookNow}
              className="w-full sm:w-auto"
            >
              <span>Book This Space</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Key Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-indigo-100">
          <div className="clay-inset p-3 rounded-2xl bg-[#EAECFA]/70 text-center">
            <span className="text-[10px] font-bold uppercase text-ink-soft block">
              Capacity
            </span>
            <span className="text-base font-extrabold text-ink mt-0.5 block">
              Up to {space.capacity} guests
            </span>
          </div>
          <div className="clay-inset p-3 rounded-2xl bg-[#EAECFA]/70 text-center">
            <span className="text-[10px] font-bold uppercase text-ink-soft block">
              Operating Hours
            </span>
            <span className="text-base font-extrabold text-ink mt-0.5 block">
              {space.openTime} – {space.closeTime}
            </span>
          </div>
          <div className="clay-inset p-3 rounded-2xl bg-[#EAECFA]/70 text-center">
            <span className="text-[10px] font-bold uppercase text-ink-soft block">
              Floor / Wing
            </span>
            <span className="text-base font-extrabold text-ink mt-0.5 block">
              {space.floor}
            </span>
          </div>
          <div className="clay-inset p-3 rounded-2xl bg-[#EAECFA]/70 text-center">
            <span className="text-[10px] font-bold uppercase text-ink-soft block">
              Access Type
            </span>
            <span className="text-base font-extrabold text-ink mt-0.5 block">
              QR Gate Pass
            </span>
          </div>
        </div>

        {/* Description & Rules */}
        <div className="py-6 border-b border-indigo-100 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-ink mb-1">
              About This Space
            </h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              {space.description || 'No detailed description provided.'}
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-ink mb-1">
              Venue Guidelines & Rules
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed bg-[#EAECFA]/60 p-3.5 rounded-2xl border border-white">
              {space.rules || 'Standard society community codes apply. Please maintain cleanliness.'}
            </p>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="pt-6">
          <h3 className="font-heading font-bold text-base text-ink mb-3">
            Amenities & Inclusions
          </h3>
          <FacilityChips facilities={spaceFacilities} readonly />
        </div>
      </div>

      {/* 7-Day Slot Availability Strip */}
      <div className="clay p-6 bg-surface border border-white mb-8">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-100">
          <div>
            <h3 className="font-heading font-bold text-lg text-ink">
              7-Day Booking Schedule Overview
            </h3>
            <p className="text-xs text-ink-soft">
              Check daily schedule reservations and manager maintenance blocks.
            </p>
          </div>
          <Calendar className="w-5 h-5 text-primary" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {next7Days.map((dStr, idx) => {
            const dayBookings = bookings.filter(
              (b) => b.spaceId === space.id && b.date === dStr && b.status === 'confirmed'
            );
            const dayBlocks = schedules.filter(
              (s) => s.spaceId === space.id && s.date === dStr
            );
            const totalOccupied = dayBookings.length + dayBlocks.length;

            return (
              <div
                key={dStr}
                className={`clay-inset p-3 rounded-2xl flex flex-col items-center text-center ${
                  totalOccupied > 0 ? 'bg-amber-50/50' : 'bg-emerald-50/50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase text-ink-soft">
                  {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `Day +${idx}`}
                </span>
                <span className="text-xs font-extrabold text-ink my-0.5">
                  {dStr.slice(5)}
                </span>
                {totalOccupied > 0 ? (
                  <span className="text-[10px] font-semibold text-amber-800">
                    {totalOccupied} event{totalOccupied > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-emerald-700">
                    All Slots Free
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Signature Feature: Nearby Local Decorator Suggestions */}
      <div className="clay p-6 md:p-8 bg-surface border border-white">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-indigo-100">
          <div className="w-9 h-9 rounded-2xl clay-bubble bg-orange-100 text-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-ink">
              Recommended Local Decorators
            </h3>
            <p className="text-xs text-ink-soft">
              Verified balloon, floral, and theme decorators near {space.area}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decorators.map((dec) => (
            <div
              key={dec.id}
              className="clay-inset p-4 rounded-2xl bg-[#EAECFA]/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    {dec.speciality}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{dec.rating}</span>
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-ink mb-1">
                  {dec.name}
                </h4>
                <p className="text-xs text-ink-soft flex items-center gap-1 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-ink-soft/70 shrink-0" />
                  <span>{dec.area}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-indigo-100/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] text-ink-soft block">Starts from</span>
                  <strong className="text-ink">₹{dec.startingPrice}</strong>
                </div>
                <a
                  href={`tel:${dec.phone}`}
                  className="clay-pill px-2.5 py-1 bg-white text-primary text-xs font-bold flex items-center gap-1 hover:bg-indigo-50"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
