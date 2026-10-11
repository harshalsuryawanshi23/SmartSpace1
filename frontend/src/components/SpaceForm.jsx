import React, { useState, useEffect } from 'react';
import {
  Building,
  Clock,
  Users,
  MapPin,
  FileText,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import {
  Input,
  Select,
  Textarea,
  Button,
  FacilityChips,
  Modal,
} from './ui.jsx';
import { useApp } from '../context/AppContext.jsx';

export const SpaceForm = ({
  isOpen,
  onClose,
  spaceToEdit = null,
  onSaveSuccess,
}) => {
  const { facilities, organizations, currentUser, saveSpace } = useApp();

  const isEditing = Boolean(spaceToEdit);
  const isAdmin = currentUser?.role === 'admin';

  const [formData, setFormData] = useState({
    name: '',
    type: 'Community Hall',
    capacity: 50,
    organizationId: currentUser?.organizationId || 'org-1',
    area: 'Kothrud',
    city: 'Pune',
    building: '',
    floor: 'Ground Floor',
    openTime: '08:00',
    closeTime: '22:00',
    ratePerHour: 1000,
    description: '',
    rules: '',
    facilityIds: [],
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (spaceToEdit) {
      setFormData({
        ...spaceToEdit,
        capacity: Number(spaceToEdit.capacity),
        ratePerHour: Number(spaceToEdit.ratePerHour),
        facilityIds: spaceToEdit.facilityIds || [],
      });
    } else {
      setFormData({
        name: '',
        type: 'Community Hall',
        capacity: 50,
        organizationId: currentUser?.organizationId || organizations[0]?.id || 'org-1',
        area: 'Kothrud',
        city: 'Pune',
        building: 'Main Wing',
        floor: 'Ground Floor',
        openTime: '08:00',
        closeTime: '22:00',
        ratePerHour: 800,
        description: '',
        rules: '',
        facilityIds: ['fac-2', 'fac-5'],
        status: 'active',
      });
    }
    setErrors({});
  }, [spaceToEdit, isOpen, currentUser, organizations]);

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Space title is required.';
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      errs.capacity = 'Capacity must be greater than 0.';
    }
    if (!formData.area?.trim()) errs.area = 'Area/Neighborhood is required.';
    if (!formData.building?.trim()) errs.building = 'Building name is required.';
    if (!formData.openTime) errs.openTime = 'Open time is required.';
    if (!formData.closeTime) errs.closeTime = 'Close time is required.';
    if (formData.openTime >= formData.closeTime) {
      errs.closeTime = 'Close time must be later than opening time.';
    }
    if (formData.ratePerHour === undefined || Number(formData.ratePerHour) < 0) {
      errs.ratePerHour = 'Rate per hour cannot be negative.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      await saveSpace({
        ...formData,
        capacity: Number(formData.capacity),
        ratePerHour: Number(formData.ratePerHour),
      });
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message }));
    } finally {
      setIsSaving(false);
    }
  };

  const spaceTypes = [
    { value: 'Community Hall', label: 'Community Hall' },
    { value: 'Society Clubhouse', label: 'Society Clubhouse' },
    { value: 'Meeting Room', label: 'Meeting Room' },
    { value: 'Classroom', label: 'Classroom' },
    { value: 'Terrace Hall', label: 'Terrace Hall' },
  ];

  const orgOptions = organizations.map((o) => ({
    value: o.id,
    label: `${o.name} (${o.city})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Space Details' : 'Add New Space'}
      subtitle={
        isEditing
          ? 'Update capacity, facilities, rates, or operating hours.'
          : 'List a new community hall, meeting room, or clubhouse.'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errors.submit && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* Space Name & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Space Name"
            placeholder="e.g. Gulmohar Main Community Hall"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
          <Select
            label="Space Category / Type"
            options={spaceTypes}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
        </div>

        {/* Organization (Admin only or locked for manager) */}
        {isAdmin ? (
          <Select
            label="Parent Organization"
            options={orgOptions}
            value={formData.organizationId}
            onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
          />
        ) : null}

        {/* Capacity & Hourly Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Guest Capacity (Persons)"
            type="number"
            min="5"
            max="250"
            icon={Users}
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            error={errors.capacity}
            required
          />
          <Input
            label="Rate Per Hour (₹)"
            type="number"
            min="0"
            icon={DollarSign}
            value={formData.ratePerHour}
            onChange={(e) => setFormData({ ...formData, ratePerHour: e.target.value })}
            error={errors.ratePerHour}
            required
          />
        </div>

        {/* Area & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Area / Neighborhood"
            placeholder="e.g. Kothrud, Baner, Gangapur Road"
            icon={MapPin}
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            error={errors.area}
            required
          />
          <Select
            label="City"
            options={[
              { value: 'Pune', label: 'Pune' },
              { value: 'Nashik', label: 'Nashik' },
            ]}
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>

        {/* Building & Floor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Building / Wing"
            placeholder="e.g. Clubhouse Wing A"
            icon={Building}
            value={formData.building}
            onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            error={errors.building}
            required
          />
          <Input
            label="Floor Location"
            placeholder="e.g. Ground Floor, 1st Floor"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
          />
        </div>

        {/* Operating Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Daily Opening Time"
            type="time"
            step="1800"
            icon={Clock}
            value={formData.openTime}
            onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
            error={errors.openTime}
            required
          />
          <Input
            label="Daily Closing Time"
            type="time"
            step="1800"
            icon={Clock}
            value={formData.closeTime}
            onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
            error={errors.closeTime}
            required
          />
        </div>

        {/* Facilities Multi-Select */}
        <div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">
            Available Amenities & Facilities
          </label>
          <FacilityChips
            facilities={facilities}
            selectedIds={formData.facilityIds}
            onChange={(ids) => setFormData({ ...formData, facilityIds: ids })}
          />
        </div>

        {/* Description & Rules */}
        <Textarea
          label="Description & Highlights"
          placeholder="Describe the hall, seating arrangement, ambiance, etc."
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <Textarea
          label="House Rules & Guidelines"
          placeholder="e.g. No loud music after 10 PM, catering cleanup guidelines"
          rows={2}
          value={formData.rules}
          onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
        />

        {/* Status */}
        <Select
          label="Listing Status"
          options={[
            { value: 'active', label: 'Active (Available for booking)' },
            { value: 'inactive', label: 'Inactive (Hidden from search)' },
          ]}
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-100/60 mt-2">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving}>
            {isEditing ? 'Save Changes' : 'Create Space'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
