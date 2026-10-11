import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Building,
} from 'lucide-react';
import { Button, FacilityChips, Badge, getSpaceTypeDetails } from './ui.jsx';
import { useApp } from '../context/AppContext.jsx';

export const SpaceCard = ({
  space,
  searchSlot = null, // { date, startTime, endTime }
  onEdit,
  onDelete,
  onToggleStatus,
  isManagement = false,
}) => {
  const navigate = useNavigate();
  const { facilities } = useApp();

  const spaceFacilities = facilities.filter((f) =>
    space.facilityIds?.includes(f.id)
  );

  const typeDetails = getSpaceTypeDetails(space.type);
  const TypeIcon = typeDetails.icon;

  const handleBookNow = () => {
    let url = `/user/spaces/${space.id}`;
    if (searchSlot?.date && searchSlot?.startTime && searchSlot?.endTime) {
      url += `?date=${searchSlot.date}&start=${searchSlot.startTime}&end=${searchSlot.endTime}`;
    }
    navigate(url);
  };

  return (
    <div className="clay-interactive p-5 md:p-6 bg-surface flex flex-col justify-between border border-white/80 h-full">
      {/* Top Header: Type tile + Status/Rate */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-11 h-11 rounded-2xl clay-bubble ${typeDetails.bg} ${typeDetails.text} flex items-center justify-center shrink-0 border ${typeDetails.border}`}
            >
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                {space.type}
              </span>
              <h3 className="font-heading font-bold text-lg md:text-xl text-ink leading-snug line-clamp-1">
                {space.name}
              </h3>
            </div>
          </div>

          <div className="text-right shrink-0">
            {isManagement ? (
              <Badge variant={space.status}>{space.status}</Badge>
            ) : (
              <div className="clay-pill px-3 py-1 bg-indigo-50/70 border border-indigo-100 text-xs font-bold text-primary">
                ₹{space.ratePerHour}
                <span className="text-[10px] font-normal text-ink-soft"> / hr</span>
              </div>
            )}
          </div>
        </div>

        {/* Location & Capacity Badges */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft mb-3.5">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              {space.area}, {space.city}
            </span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>Up to {space.capacity} guests</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              {space.openTime} – {space.closeTime}
            </span>
          </span>
        </div>

        {/* Building & Description snippet */}
        <p className="text-xs text-ink-soft line-clamp-2 mb-4 leading-relaxed">
          {space.description}
        </p>

        {/* Facilities Chips */}
        <div className="mb-4">
          <FacilityChips facilities={spaceFacilities} readonly maxDisplay={3} />
        </div>
      </div>

      {/* Footer Area */}
      <div className="pt-3 border-t border-indigo-100/60 mt-auto">
        {/* Availability Line */}
        {searchSlot?.date && searchSlot?.startTime && searchSlot?.endTime ? (
          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              Free for {searchSlot.date} ({searchSlot.startTime}–{searchSlot.endTime})
            </span>
          </div>
        ) : (
          <div className="text-[11px] text-ink-soft mb-3 flex items-center justify-between">
            <span>
              Building: <strong>{space.building}</strong> ({space.floor})
            </span>
            {isManagement && (
              <span className="font-bold text-ink">₹{space.ratePerHour}/hr</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {isManagement ? (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(space)}
              >
                Edit Space
              </Button>
            )}
            {onToggleStatus && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => onToggleStatus(space.id)}
              >
                {space.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(space.id)}
              >
                Delete
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-ink-soft font-semibold uppercase">
                Rate (info only)
              </span>
              <span className="text-base font-extrabold font-heading text-ink">
                ₹{space.ratePerHour}
                <span className="text-xs font-normal text-ink-soft">/hr</span>
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBookNow}
              className="gap-1.5"
            >
              <span>View & Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
