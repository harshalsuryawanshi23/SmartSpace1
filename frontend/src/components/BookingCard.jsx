import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { Button, Badge, Modal, ConfirmDialog } from './ui.jsx';
import { useApp } from '../context/AppContext.jsx';

export const BookingCard = ({
  booking,
  space = null,
  user = null,
  showUser = false,
  onCancel = null,
  isCancelling = false,
}) => {
  const { spaces, decorators, cancelBooking } = useApp();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [internalCancelling, setInternalCancelling] = useState(false);

  // If space wasn't passed directly, find in spaces
  const currentSpace = space || spaces.find((s) => s.id === booking.spaceId);
  const decorator = decorators.find((d) => d.id === booking.decoratorId);

  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';
  const isConfirmed = booking.status === 'confirmed';

  const handleConfirmCancel = async () => {
    setInternalCancelling(true);
    try {
      if (onCancel) {
        await onCancel(booking.id);
      } else {
        await cancelBooking(booking.id);
      }
      setConfirmCancelOpen(false);
    } finally {
      setInternalCancelling(false);
    }
  };

  return (
    <>
      <div className="clay p-5 md:p-6 bg-surface flex flex-col justify-between border border-white/80 h-full">
        <div>
          {/* Header: Space Title + Booking ID & Status */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-primary px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                  {booking.id}
                </span>
                <Badge variant={booking.status}>{booking.status}</Badge>
                {booking.entryStatus === 'entered' && (
                  <span className="clay-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                    Entered
                  </span>
                )}
              </div>
              <h4 className="font-heading font-bold text-lg md:text-xl text-ink">
                {currentSpace?.name || 'Smart Space Venue'}
              </h4>
            </div>
          </div>

          {/* User info if in manager/admin view */}
          {showUser && user && (
            <div className="text-xs text-ink-soft mb-2 flex items-center gap-1.5">
              <span>Booked by:</span>
              <strong className="text-ink">{user.name}</strong> ({user.email})
            </div>
          )}

          {/* Time & Location details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft mb-3.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{booking.date}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {booking.startTime} – {booking.endTime}
              </span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-accent" />
              <span>{booking.people} attendees</span>
            </span>
            {currentSpace && (
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>
                  {currentSpace.area}, {currentSpace.city}
                </span>
              </span>
            )}
          </div>

          {/* Purpose */}
          <div className="clay-inset p-3 rounded-2xl bg-[#EAECFA]/80 text-xs mb-3">
            <span className="font-semibold text-ink-soft block mb-0.5">Event Purpose:</span>
            <p className="text-ink font-medium">{booking.purpose || 'Private gathering'}</p>
          </div>

          {/* Decorator Tag if selected */}
          {decorator && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-800 mb-3 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Decorator requested: {decorator.name}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-indigo-100/60 flex flex-wrap items-center justify-between gap-2 mt-auto">
          <div className="text-xs text-ink-soft">
            <span>ID Last 4: </span>
            <strong className="font-mono text-ink">•••• {booking.idLast4}</strong>
          </div>

          <div className="flex items-center gap-2">
            {/* Show QR button */}
            {!isCancelled && (
              <Button
                variant="secondary"
                size="sm"
                icon={QrCode}
                onClick={() => setQrModalOpen(true)}
              >
                Show QR
              </Button>
            )}

            {/* Cancel booking button */}
            {isConfirmed && (
              <Button
                variant="ghost"
                size="sm"
                className="text-danger hover:bg-rose-50"
                onClick={() => setConfirmCancelOpen(true)}
                disabled={isCancelling || internalCancelling}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* QR Pass Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Digital QR Entry Pass"
        subtitle="Present this QR pass and your ID to the security watchman at entrance."
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center text-center p-2">
          {/* QR Code Container */}
          <div className="clay p-6 bg-white rounded-3xl mb-4 border border-indigo-100 shadow-md">
            <QRCodeSVG
              value={booking.qrToken || booking.id}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#26253F"
            />
          </div>

          <div className="font-mono text-xs font-bold text-primary bg-indigo-50 px-3 py-1 rounded-full mb-3">
            {booking.qrToken}
          </div>

          <div className="clay-inset w-full p-4 rounded-2xl bg-[#EAECFA] text-left text-xs mb-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-ink-soft">Venue:</span>
              <span className="font-bold text-ink">{currentSpace?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Date & Time:</span>
              <span className="font-bold text-ink">
                {booking.date} ({booking.startTime}–{booking.endTime})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Aadhaar Last 4:</span>
              <span className="font-bold text-ink">•••• {booking.idLast4}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Entry Status:</span>
              <Badge variant={booking.entryStatus}>{booking.entryStatus}</Badge>
            </div>
          </div>

          <p className="text-xs text-ink-soft max-w-xs leading-relaxed">
            Please arrive 10 minutes before your slot. Verification requires both QR scan and matching the last 4 digits of Aadhaar.
          </p>

          <div className="mt-5 w-full">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setQrModalOpen(false)}
            >
              Close Pass
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel This Booking?"
        message={`Are you sure you want to cancel booking ${booking.id} for "${currentSpace?.name || 'this space'}"? Once cancelled, the slot will be immediately freed for other members.`}
        confirmText="Yes, Cancel Booking"
        isDanger={true}
        isLoading={isCancelling || internalCancelling}
      />
    </>
  );
};
