import React, { useState } from 'react';
import {
  CalendarRange,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Building,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import {
  Button,
  Input,
  Select,
  PageHeader,
  DataTable,
  ConfirmDialog,
  Modal,
} from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { getTodayStr } from '../../services/api.js';

export const ManageSchedules = () => {
  const {
    spaces,
    schedules,
    currentUser,
    blockSlot,
    unblockSlot,
  } = useApp();

  const today = getTodayStr();
  const orgId = currentUser?.organizationId;

  // Filter spaces and schedules scoped to manager's organization
  const orgSpaces = spaces.filter((s) => s.organizationId === orgId);
  const orgSpaceIds = orgSpaces.map((s) => s.id);
  const orgSchedules = schedules.filter((s) => orgSpaceIds.includes(s.spaceId));

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    spaceId: orgSpaces[0]?.id || '',
    date: today,
    startTime: '13:00',
    endTime: '16:00',
    purpose: 'Facility Deep Cleaning & Maintenance',
  });

  const [error, setError] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  // Unblock dialog
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [scheduleToUnblock, setScheduleToUnblock] = useState(null);
  const [isUnblocking, setIsUnblocking] = useState(false);

  const handleOpenBlockModal = () => {
    setFormData({
      spaceId: orgSpaces[0]?.id || '',
      date: today,
      startTime: '14:00',
      endTime: '17:00',
      purpose: 'Technical Inspection & Maintenance',
    });
    setError('');
    setModalOpen(true);
  };

  const handleBlockSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.spaceId) {
      setError('Please select a space to block.');
      return;
    }
    if (!formData.date || formData.date < today) {
      setError('Selected block date cannot be in the past.');
      return;
    }
    if (!formData.startTime || !formData.endTime || formData.startTime >= formData.endTime) {
      setError('Start time must be strictly earlier than end time.');
      return;
    }
    if (!formData.purpose.trim()) {
      setError('Purpose or maintenance note is required.');
      return;
    }

    setIsBlocking(true);
    try {
      await blockSlot(formData);
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBlocking(false);
    }
  };

  const handlePromptUnblock = (sch) => {
    setScheduleToUnblock(sch);
    setUnblockDialogOpen(true);
  };

  const confirmUnblock = async () => {
    if (!scheduleToUnblock) return;
    setIsUnblocking(true);
    try {
      await unblockSlot(scheduleToUnblock.id);
      setUnblockDialogOpen(false);
      setScheduleToUnblock(null);
    } finally {
      setIsUnblocking(false);
    }
  };

  const spaceOptions = orgSpaces.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.floor})`,
  }));

  const columns = [
    {
      header: 'Venue',
      render: (sch) => {
        const sp = orgSpaces.find((s) => s.id === sch.spaceId);
        return (
          <div>
            <strong className="font-heading text-ink text-sm block">
              {sp?.name || sch.spaceId}
            </strong>
            <span className="text-[11px] text-ink-soft">{sp?.building}</span>
          </div>
        );
      },
    },
    {
      header: 'Date',
      render: (sch) => (
        <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{sch.date}</span>
        </span>
      ),
    },
    {
      header: 'Blocked Hours',
      render: (sch) => (
        <span className="text-xs font-mono font-bold text-ink-soft flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {sch.startTime} – {sch.endTime}
          </span>
        </span>
      ),
    },
    {
      header: 'Reason / Purpose',
      render: (sch) => (
        <span className="text-xs font-medium text-ink-soft">{sch.purpose}</span>
      ),
    },
    {
      header: 'Actions',
      render: (sch) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-danger hover:bg-rose-50"
          onClick={() => handlePromptUnblock(sch)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Lift Block
        </Button>
      ),
    },
  ];

  return (
    <div className="py-2">
      <PageHeader
        title="Manage Blocked Schedules"
        subtitle="Reserve maintenance windows or private hours to prevent resident search overlap."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenBlockModal}
            disabled={orgSpaces.length === 0}
          >
            Block a Slot
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={orgSchedules}
        emptyMessage="No blocked slots currently scheduled for your organization's spaces."
      />

      {/* Block Slot Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Block Venue Slot for Maintenance"
        subtitle="This slot will immediately become unavailable for resident booking in search."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleBlockSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Select
            label="Select Space"
            options={spaceOptions}
            value={formData.spaceId}
            onChange={(e) => setFormData({ ...formData, spaceId: e.target.value })}
            required
          />

          <Input
            label="Block Date"
            type="date"
            min={today}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              step="1800"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time"
              type="time"
              step="1800"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <Input
            label="Reason for Block"
            placeholder="e.g. Society AGM, painting, technical overhaul"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-100">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={isBlocking}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isBlocking}>
              Block Slot
            </Button>
          </div>
        </form>
      </Modal>

      {/* Unblock Dialog */}
      <ConfirmDialog
        isOpen={unblockDialogOpen}
        onClose={() => setUnblockDialogOpen(false)}
        onConfirm={confirmUnblock}
        title="Lift Slot Block?"
        message="This will release the maintenance lock and make the slot freely available for resident searches."
        confirmText="Yes, Release Slot"
        isDanger={false}
        isLoading={isUnblocking}
      />
    </div>
  );
};
