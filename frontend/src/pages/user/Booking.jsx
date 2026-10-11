import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Sparkles,
  Building,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  Input,
  Textarea,
  Select,
  Checkbox,
  Button,
  Spinner,
  PageHeader,
  Badge,
} from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { apiGetSpaceById, getTodayStr } from '../../services/api.js';

export const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, decorators, createBooking } = useApp();

  const today = getTodayStr();

  const [space, setSpace] = useState(null);
  const [loadingSpace, setLoadingSpace] = useState(true);

  // Form states
  const [date, setDate] = useState(searchParams.get('date') || today);
  const [startTime, setStartTime] = useState(searchParams.get('start') || '10:00');
  const [endTime, setEndTime] = useState(searchParams.get('end') || '13:00');
  const [people, setPeople] = useState('25');
  const [purpose, setPurpose] = useState('');
  const [idLast4, setIdLast4] = useState('');
  const [needsDecoration, setNeedsDecoration] = useState(false);
  const [selectedDecoratorId, setSelectedDecoratorId] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const data = await apiGetSpaceById(id);
        setSpace(data);
        if (data.capacity < 25) setPeople(String(data.capacity));
      } catch (err) {
        setErrors({ general: 'Space not found or failed to load.' });
      } finally {
        setLoadingSpace(false);
      }
    };
    fetchSpace();
  }, [id]);

  if (loadingSpace) {
    return <Spinner message="Preparing booking checkout..." />;
  }

  if (!space) {
    return (
      <div className="clay p-8 text-center bg-surface my-8 max-w-md mx-auto">
        <h3 className="text-xl font-bold font-heading text-danger mb-2">Space Not Found</h3>
        <p className="text-xs text-ink-soft mb-4">Please return to search and select an active space.</p>
        <Link to="/user/search">
          <Button variant="secondary">Back to Spaces</Button>
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!date) errs.date = 'Date is required.';
    else if (date < today) errs.date = 'Selected date cannot be in the past.';

    if (!startTime) errs.startTime = 'Start time is required.';
    if (!endTime) errs.endTime = 'End time is required.';
    if (startTime && endTime && startTime >= endTime) {
      errs.endTime = 'End time must be strictly later than start time.';
    }

    if (!people || Number(people) <= 0) {
      errs.people = 'Please specify valid attendee count.';
    } else if (Number(people) > space.capacity) {
      errs.people = `Selected space maximum capacity is ${space.capacity} people.`;
    }

    if (!purpose.trim()) {
      errs.purpose = 'Event purpose is required.';
    }

    if (!idLast4 || !/^\d{4}$/.test(idLast4.trim())) {
      errs.idLast4 = 'Valid 4-digit Aadhaar last 4 digits are required for entry verification.';
    }

    if (needsDecoration && !selectedDecoratorId) {
      errs.decorator = 'Please select a preferred decorator partner.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      const newBooking = await createBooking({
        userId: currentUser?.id,
        spaceId: space.id,
        date,
        startTime,
        endTime,
        people: Number(people),
        purpose: purpose.trim(),
        idLast4: idLast4.trim(),
        decoratorId: needsDecoration ? selectedDecoratorId : null,
      });
      setConfirmedBooking(newBooking);
    } catch (err) {
      setErrors({ submit: err.message || 'Booking conflict or submission failure.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (confirmedBooking) {
    return (
      <div className="max-w-xl mx-auto py-4 animate-fade-in">
        <div className="clay p-6 md:p-8 bg-surface border border-white text-center">
          <div className="w-16 h-16 rounded-3xl clay-bubble bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Booking Confirmed
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-ink mt-2 mb-1">
            Reservation Confirmed!
          </h2>
          <p className="text-xs text-ink-soft mb-6">
            Your booking reference is{' '}
            <strong className="font-mono text-primary text-sm font-bold">
              {confirmedBooking.id}
            </strong>
          </p>

          {/* QR Code Pass */}
          <div className="clay p-6 bg-white rounded-3xl mb-4 border border-indigo-100 shadow-sm max-w-[220px] mx-auto">
            <QRCodeSVG
              value={confirmedBooking.qrToken}
              size={180}
              level="H"
              fgColor="#26253F"
            />
          </div>

          <div className="font-mono text-xs font-bold text-primary bg-indigo-50 px-3 py-1 rounded-full max-w-xs mx-auto mb-4">
            {confirmedBooking.qrToken}
          </div>

          {/* Details Summary */}
          <div className="clay-inset p-4 rounded-2xl bg-[#EAECFA] text-left text-xs mb-6 space-y-2.5">
            <div className="flex justify-between">
              <span className="text-ink-soft">Reserved Venue:</span>
              <span className="font-bold text-ink">{space.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Date & Time:</span>
              <span className="font-bold text-ink">
                {confirmedBooking.date} ({confirmedBooking.startTime}–{confirmedBooking.endTime})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Guests:</span>
              <span className="font-bold text-ink">{confirmedBooking.people} people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Registered Aadhaar Last 4:</span>
              <span className="font-bold text-ink">•••• {confirmedBooking.idLast4}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Entry Verification Status:</span>
              <Badge variant="pending">Pending Scan</Badge>
            </div>
          </div>

          <div className="text-xs text-ink-soft bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 mb-6 text-left flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              Save or screenshot this QR entry pass. At the venue gate, the watchman will scan this code and verify your Aadhaar last 4 digits ({confirmedBooking.idLast4}) before allowing entrance.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/user/bookings" className="flex-1">
              <Button variant="primary" className="w-full">
                Go to My Bookings
              </Button>
            </Link>
            <Link to="/user/search" className="flex-1">
              <Button variant="secondary" className="w-full">
                Browse More Spaces
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // BOOKING FORM
  return (
    <div className="max-w-3xl mx-auto py-2">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <PageHeader
        title={`Reserve ${space.name}`}
        subtitle={`Schedule your slot at ${space.area}, ${space.city}. Operating hours: ${space.openTime} – ${space.closeTime}.`}
      />

      <div className="clay p-6 md:p-8 bg-surface border border-white">
        {/* Selected Space Overview Snippet */}
        <div className="clay-inset p-4 rounded-2xl bg-[#EAECFA]/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
              Selected Venue
            </span>
            <h3 className="font-heading font-bold text-base text-ink">
              {space.name}
            </h3>
            <p className="text-xs text-ink-soft mt-0.5">
              {space.building} ({space.floor}) • Capacity: max {space.capacity} guests
            </p>
          </div>
          <div className="text-right sm:border-l sm:border-indigo-200 sm:pl-4">
            <span className="text-[10px] text-ink-soft uppercase block">Hourly Rate</span>
            <span className="font-heading font-extrabold text-lg text-ink">
              ₹{space.ratePerHour}
              <span className="text-xs font-normal text-ink-soft">/hr</span>
            </span>
          </div>
        </div>

        {/* Conflict or Submission Error Banner */}
        {errors.submit && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-danger flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Date & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Reservation Date"
              type="date"
              min={today}
              icon={Calendar}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
              required
            />
            <Input
              label="Start Time"
              type="time"
              step="1800"
              icon={Clock}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              error={errors.startTime}
              required
            />
            <Input
              label="End Time"
              type="time"
              step="1800"
              icon={Clock}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              error={errors.endTime}
              required
            />
          </div>

          {/* Number of People & ID Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`Estimated Attendees (Max ${space.capacity})`}
              type="number"
              min="1"
              max={space.capacity}
              icon={Users}
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              error={errors.people}
              required
            />

            <Input
              label="ID Verification (Aadhaar Last 4 Digits)"
              type="text"
              maxLength="4"
              icon={ShieldCheck}
              placeholder="e.g. 4821"
              value={idLast4}
              onChange={(e) => setIdLast4(e.target.value.replace(/\D/g, ''))}
              error={errors.idLast4}
              helper="Required for gate entry security verification."
              required
            />
          </div>

          {/* Event Purpose */}
          <Textarea
            label="Purpose of Booking"
            placeholder="e.g. Daughter's 10th Birthday party, committee meeting, society reading group"
            rows={2}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            error={errors.purpose}
            required
          />

          {/* Optional Local Decorator Picker */}
          <div className="clay-inset p-4 rounded-2xl bg-[#EAECFA]/70 border border-white flex flex-col gap-3">
            <Checkbox
              label="I need decoration services for this event"
              description="Connect with top-rated nearby decorators for balloons, flowers, and backdrop setup."
              checked={needsDecoration}
              onChange={(e) => setNeedsDecoration(e.target.checked)}
            />

            {needsDecoration && (
              <div className="pt-2 animate-fade-in">
                <Select
                  label="Choose Local Decorator Partner"
                  options={[
                    { value: '', label: '-- Select a decorator --' },
                    ...decorators.map((d) => ({
                      value: d.id,
                      label: `${d.name} (${d.speciality} • Starts ₹${d.startingPrice})`,
                    })),
                  ]}
                  value={selectedDecoratorId}
                  onChange={(e) => setSelectedDecoratorId(e.target.value)}
                  error={errors.decorator}
                  required
                />
              </div>
            )}
          </div>

          {/* Notice */}
          <div className="text-[11px] text-ink-soft bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-start gap-2">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              By clicking "Confirm & Generate Pass", this slot will be securely locked. You will instantly receive a digital QR entry pass.
            </span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="px-8"
            >
              Confirm & Generate QR Pass
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
