import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Building,
  Calendar,
  Clock,
  Users,
  Search,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  Button,
  Input,
  PageHeader,
  Badge,
} from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { apiVerifyEntry, getTodayStr } from '../../services/api.js';

export const VerifyEntry = () => {
  const { refreshData } = useApp();
  const [query, setQuery] = useState('');
  const [idLast4, setIdLast4] = useState('');
  const [result, setResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationError, setValidationError] = useState('');

  const today = getTodayStr();

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setValidationError('');
    setResult(null);

    if (!query.trim()) {
      setValidationError('Please input Booking ID (e.g. BK-1001) or scan/paste the QR token.');
      return;
    }
    if (!idLast4.trim() || idLast4.trim().length !== 4) {
      setValidationError('Please enter the 4-digit Aadhaar ID number for visitor verification.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await apiVerifyEntry(query.trim(), idLast4.trim());
      setResult(res);
      if (res.success) {
        await refreshData();
      }
    } catch (err) {
      setValidationError(err.message || 'Error executing verification check.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickFill = (testCode, testId) => {
    setQuery(testCode);
    setIdLast4(testId);
    setValidationError('');
    setResult(null);
  };

  const handleReset = () => {
    setQuery('');
    setIdLast4('');
    setResult(null);
    setValidationError('');
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      <PageHeader
        title="Security Gate Entry Verification"
        subtitle="Watchman terminal: Verify visitor QR tokens and Aadhaar last 4 digits for physical gate entry."
      />

      {/* Main Terminal Input Card */}
      <div className="clay p-6 md:p-8 bg-surface border border-white mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-100">
          <div className="w-12 h-12 rounded-2xl clay-bubble bg-teal-100 text-teal-800 flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-ink">
              Gate Pass Scanner
            </h3>
            <p className="text-xs text-ink-soft">
              Scan barcode/QR scanner input or manually enter reference code.
            </p>
          </div>
        </div>

        {validationError && (
          <div className="p-3 mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-danger flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Booking ID or Pasted QR Token"
                placeholder="e.g. BK-1001 or BK-1001-QR-9428-AUTH"
                icon={Search}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div>
              <Input
                label="Aadhaar Last 4 Digits"
                placeholder="e.g. 4821"
                maxLength="4"
                icon={ShieldCheck}
                value={idLast4}
                onChange={(e) => setIdLast4(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-ink-soft hover:text-ink flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear inputs
            </button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="px-8"
              isLoading={isVerifying}
            >
              Verify Pass
            </Button>
          </div>
        </form>

        {/* 1-Click Quick Demo Test Scenarios */}
        <div className="mt-8 pt-5 border-t border-indigo-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block mb-2.5">
            1-Click Demo Reviewer Scenarios (Test All Verification Rules):
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('BK-1001', '4821')}
              className="clay-pill px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              ✓ Test Valid Today (BK-1001 / 4821)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('BK-1001', '9999')}
              className="clay-pill px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors border border-rose-200"
            >
              ✕ Test ID Mismatch (BK-1001 / 9999)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('BK-1003', '9921')}
              className="clay-pill px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors border border-amber-200"
            >
              ✕ Test Already Entered (BK-1003)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('BK-1005', '4821')}
              className="clay-pill px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors border border-rose-200"
            >
              ✕ Test Cancelled Booking (BK-1005)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('BK-1002', '4821')}
              className="clay-pill px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-colors border border-indigo-200"
            >
              ✕ Test Tomorrow's Pass (BK-1002)
            </button>
          </div>
        </div>
      </div>

      {/* VERIFICATION RESULT CARD */}
      {result && (
        <div className="animate-fade-in">
          {result.success ? (
            /* SUCCESS CARD */
            <div className="clay p-6 md:p-8 bg-emerald-50/90 border-2 border-emerald-300">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-emerald-200">
                <div className="w-14 h-14 rounded-3xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
                    GATE ACCESS APPROVED
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl text-emerald-950">
                    Valid Pass — Allow Entry
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Visitor identity matched with registered record. Entry status marked as "Entered".
                  </p>
                </div>
              </div>

              {/* Attendee & Space Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/70 rounded-2xl border border-emerald-200/60">
                  <span className="text-ink-soft text-[10px] uppercase font-bold block">
                    Booked Venue
                  </span>
                  <strong className="text-ink text-sm block">
                    {result.space?.name || 'Community Hall'}
                  </strong>
                  <span className="text-ink-soft text-[11px]">
                    {result.space?.building} ({result.space?.floor})
                  </span>
                </div>

                <div className="p-3 bg-white/70 rounded-2xl border border-emerald-200/60">
                  <span className="text-ink-soft text-[10px] uppercase font-bold block">
                    Visitor / Host Name
                  </span>
                  <strong className="text-ink text-sm block">
                    {result.user?.name || 'Rahul Sharma'}
                  </strong>
                  <span className="text-ink-soft text-[11px]">
                    Verified ID: •••• {result.booking?.idLast4}
                  </span>
                </div>

                <div className="p-3 bg-white/70 rounded-2xl border border-emerald-200/60">
                  <span className="text-ink-soft text-[10px] uppercase font-bold block">
                    Time Window Today
                  </span>
                  <strong className="text-ink text-sm block font-mono">
                    {result.booking?.startTime} – {result.booking?.endTime}
                  </strong>
                  <span className="text-ink-soft text-[11px]">
                    {result.booking?.people} expected attendees
                  </span>
                </div>

                <div className="p-3 bg-white/70 rounded-2xl border border-emerald-200/60">
                  <span className="text-ink-soft text-[10px] uppercase font-bold block">
                    Event Purpose
                  </span>
                  <strong className="text-ink text-sm block">
                    {result.booking?.purpose}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            /* REJECTION CARD */
            <div className="clay p-6 md:p-8 bg-rose-50/90 border-2 border-rose-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-3xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-rose-800">
                    ACCESS DENIED • REJECT ENTRY
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl text-rose-950 mt-0.5">
                    {result.reason === 'NOT_FOUND' && 'Booking Not Found'}
                    {result.reason === 'CANCELLED' && 'Booking Has Been Cancelled'}
                    {result.reason === 'WRONG_DATE' && 'Date Mismatch'}
                    {result.reason === 'ID_MISMATCH' && 'Aadhaar ID Mismatch'}
                    {result.reason === 'ALREADY_ENTERED' && 'Pass Already Scanned'}
                  </h3>
                  <p className="text-sm font-semibold text-rose-900 mt-2 bg-white/60 p-3 rounded-xl border border-rose-200">
                    {result.message}
                  </p>
                  <p className="text-xs text-ink-soft mt-3">
                    Security Policy: Do not admit visitors without an active matching pass and valid Aadhaar verification.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
