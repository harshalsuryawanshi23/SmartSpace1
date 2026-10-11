import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  Users,
  MapPin,
  Filter,
  X,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import {
  Button,
  Input,
  Select,
  FacilityChips,
  Spinner,
  EmptyState,
  PageHeader,
} from '../../components/ui.jsx';
import { SpaceCard } from '../../components/SpaceCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { apiSearchSpaces, getTodayStr } from '../../services/api.js';

export const SearchSpaces = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { facilities } = useApp();

  const today = getTodayStr();

  // Search filter states initialized from URL parameters if present
  const [type, setType] = useState(searchParams.get('type') || '');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [people, setPeople] = useState(searchParams.get('people') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [startTime, setStartTime] = useState(searchParams.get('start') || '');
  const [endTime, setEndTime] = useState(searchParams.get('end') || '');
  const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Perform search
  const executeSearch = useCallback(async () => {
    setErrorMessage('');

    // Hard rules validation:
    // If any of date/start/end is filled, all three are required!
    if (date || startTime || endTime) {
      if (!date || !startTime || !endTime) {
        setErrorMessage('When filtering by slot, Date, Start Time, and End Time are all required.');
        return;
      }
      if (date < today) {
        setErrorMessage('Selected date is in the past. Please select today or a future date.');
        return;
      }
      if (startTime >= endTime) {
        setErrorMessage('Start time must be strictly earlier than end time.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const data = await apiSearchSpaces({
        type: type || undefined,
        area: area || undefined,
        people: people ? Number(people) : undefined,
        date: date || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        facilityIds: selectedFacilityIds,
        sortBy,
      });
      setResults(data);
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred while searching spaces.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [type, area, people, date, startTime, endTime, selectedFacilityIds, sortBy, today]);

  // Run on mount or when sorting changes
  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  const handleClearFilters = () => {
    setType('');
    setArea('');
    setPeople('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setSelectedFacilityIds([]);
    setSortBy('default');
    setErrorMessage('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    type || area || people || date || startTime || endTime || selectedFacilityIds.length > 0
  );

  const searchSlotInfo = date && startTime && endTime ? { date, startTime, endTime } : null;

  const spaceTypes = [
    { value: '', label: 'All Space Categories' },
    { value: 'Community Hall', label: 'Community Hall' },
    { value: 'Society Clubhouse', label: 'Society Clubhouse' },
    { value: 'Meeting Room', label: 'Meeting Room' },
    { value: 'Classroom', label: 'Classroom' },
    { value: 'Terrace Hall', label: 'Terrace Hall' },
  ];

  const popularAreas = [
    { value: '', label: 'All Locations' },
    { value: 'Kothrud', label: 'Kothrud (Pune)' },
    { value: 'Baner', label: 'Baner (Pune)' },
    { value: 'Wakad', label: 'Wakad (Pune)' },
    { value: 'Gangapur Road', label: 'Gangapur Road (Nashik)' },
    { value: 'College Road', label: 'College Road (Nashik)' },
    { value: 'Panchavati', label: 'Panchavati (Nashik)' },
  ];

  return (
    <div className="py-2">
      <PageHeader
        title="Find & Filter Spaces"
        subtitle="Search small physical spaces by type, capacity, area, facilities, and real-time slot availability."
      />

      {/* Filter Panel (Clay card) */}
      <div className="clay p-5 md:p-6 bg-surface border border-white mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span className="font-heading font-bold text-sm text-ink uppercase tracking-wider">
              Search Filters
            </span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-bold text-danger hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>

        {/* Inline Error Message */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Space Type */}
          <Select
            label="Space Type"
            options={spaceTypes}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />

          {/* Area / Location */}
          <Select
            label="Area / Neighborhood"
            options={popularAreas}
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          {/* Capacity */}
          <Input
            label="Minimum Guests Needed"
            type="number"
            min="1"
            placeholder="e.g. 25"
            icon={Users}
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </div>

        {/* Date & Time Slot Filtering */}
        <div className="clay-inset p-4 rounded-2xl bg-[#EAECFA]/80 mb-4 border border-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block mb-2">
            Exact Slot Availability (Optional — Leave blank to browse all open spaces)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Booking Date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              label="Start Time"
              type="time"
              step="1800"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="End Time"
              type="time"
              step="1800"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Facilities Multi-Select Chips */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-ink-soft block mb-2">
            Required Facilities (Space must include all selected)
          </label>
          <FacilityChips
            facilities={facilities}
            selectedIds={selectedFacilityIds}
            onChange={setSelectedFacilityIds}
          />
        </div>

        {/* Search Action Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-indigo-100">
          <div className="text-xs text-ink-soft">
            * All filters are optional. Only spaces with matching capacity and no overlapping bookings are shown.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={executeSearch}
              className="w-full sm:w-auto px-6"
              isLoading={isLoading}
            >
              Apply & Search
            </Button>
          </div>
        </div>
      </div>

      {/* Results Header: Active Filter Chips & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading font-bold text-lg text-ink">
            {isLoading ? 'Searching...' : `${results.length} spaces available`}
          </span>

          {/* Active chips */}
          {type && (
            <span className="clay-pill px-2.5 py-0.5 text-xs bg-indigo-100 text-indigo-800 flex items-center gap-1 font-semibold">
              Type: {type}
              <button onClick={() => setType('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {area && (
            <span className="clay-pill px-2.5 py-0.5 text-xs bg-indigo-100 text-indigo-800 flex items-center gap-1 font-semibold">
              Area: {area}
              <button onClick={() => setArea('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {people && (
            <span className="clay-pill px-2.5 py-0.5 text-xs bg-indigo-100 text-indigo-800 flex items-center gap-1 font-semibold">
              ≥ {people} people
              <button onClick={() => setPeople('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {date && startTime && endTime && (
            <span className="clay-pill px-2.5 py-0.5 text-xs bg-emerald-100 text-emerald-800 flex items-center gap-1 font-semibold">
              Slot: {date} ({startTime}–{endTime})
              <button
                onClick={() => {
                  setDate('');
                  setStartTime('');
                  setEndTime('');
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-ink-soft" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="clay-inset py-1.5 px-3 text-xs font-semibold text-ink bg-transparent focus:outline-none"
          >
            <option value="default">Sort: Recommended</option>
            <option value="capacity">Sort: Largest Capacity</option>
            <option value="rate-low">Sort: Rate (Low to High)</option>
            <option value="rate-high">Sort: Rate (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {isLoading ? (
        <Spinner message="Checking real-time space availability..." />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              searchSlot={searchSlotInfo}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No spaces match these filters."
          description="Try broadening your guest count, changing the time slot, or removing some facility filters to see more available community spaces."
          actionText="Clear filters"
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
};
