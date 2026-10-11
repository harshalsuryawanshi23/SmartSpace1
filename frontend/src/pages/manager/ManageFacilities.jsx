import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Sparkles,
  Building,
} from 'lucide-react';
import {
  Button,
  Input,
  Modal,
  ConfirmDialog,
  PageHeader,
  getFacilityIcon,
} from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const ManageFacilities = () => {
  const { facilities, spaces, saveFacility, deleteFacility } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [facilityName, setFacilityName] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingFacility(null);
    setFacilityName('');
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setEditingFacility(fac);
    setFacilityName(fac.name);
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!facilityName.trim()) {
      setError('Facility name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      await saveFacility({
        id: editingFacility?.id,
        name: facilityName.trim(),
      });
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromptDelete = (fac) => {
    setFacilityToDelete(fac);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!facilityToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFacility(facilityToDelete.id);
      setDeleteDialogOpen(false);
      setFacilityToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-2">
      <PageHeader
        title="Manage Facility Amenities"
        subtitle="Configure standard amenities available across community halls, clubhouses, and classrooms."
        action={
          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Add Facility
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {facilities.map((fac) => {
          const Icon = getFacilityIcon(fac.name);
          const usageCount = spaces.filter((s) =>
            s.facilityIds?.includes(fac.id)
          ).length;

          return (
            <div
              key={fac.id}
              className="clay p-5 bg-surface border border-white flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl clay-bubble bg-indigo-50 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(fac)}
                    className="p-1 rounded-lg text-ink-soft hover:text-primary hover:bg-indigo-50"
                    title="Rename Facility"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handlePromptDelete(fac)}
                    className="p-1 rounded-lg text-ink-soft hover:text-danger hover:bg-rose-50"
                    title="Delete Facility"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-base text-ink mb-1">
                  {fac.name}
                </h4>
                <span className="text-xs text-ink-soft flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    Used in <strong>{usageCount}</strong> venue{usageCount !== 1 ? 's' : ''}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFacility ? 'Rename Facility' : 'Add New Amenity'}
        subtitle="Name will appear in filter chips and space specification tags."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Facility / Amenity Name"
            placeholder="e.g. Fiber Wi-Fi, Acoustic Sound System, Stage"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            error={error}
            required
            autoFocus
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-100">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Facility
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Warning Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Amenity Facility?"
        message={`Are you sure you want to remove "${facilityToDelete?.name}"? It will also be detached from all spaces that currently reference it.`}
        confirmText="Yes, Delete Amenity"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
