import React, { useState } from 'react';
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  Power,
  Users,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  Button,
  Input,
  Badge,
  PageHeader,
  DataTable,
  ConfirmDialog,
} from '../../components/ui.jsx';
import { SpaceForm } from '../../components/SpaceForm.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const ManageSpaces = ({ isAdminView = false }) => {
  const {
    spaces,
    organizations,
    currentUser,
    toggleSpaceStatus,
    deleteSpace,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpaceForEdit, setSelectedSpaceForEdit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Scope to organization if manager; all if admin
  const orgId = currentUser?.organizationId;
  const filteredSpaces = spaces
    .filter((s) => {
      if (!isAdminView && currentUser?.role === 'manager') {
        return s.organizationId === orgId;
      }
      return true;
    })
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });

  const handleEdit = (space) => {
    setSelectedSpaceForEdit(space);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSpaceForEdit(null);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (space) => {
    setSpaceToDelete(space);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!spaceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSpace(spaceToDelete.id);
      setDeleteDialogOpen(false);
      setSpaceToDelete(null);
    } catch (err) {
      // Error message is caught and shown by toast, but dialog remains open
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Space Name',
      render: (space) => (
        <div>
          <span className="font-heading font-bold text-ink block text-sm">
            {space.name}
          </span>
          <span className="text-[11px] text-ink-soft">
            {space.building} ({space.floor})
          </span>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (space) => (
        <span className="text-xs font-semibold text-ink-soft">{space.type}</span>
      ),
    },
    ...(isAdminView
      ? [
          {
            header: 'Organization',
            render: (space) => {
              const org = organizations.find((o) => o.id === space.organizationId);
              return (
                <span className="text-xs font-medium text-ink">
                  {org?.name || space.organizationId}
                </span>
              );
            },
          },
        ]
      : []),
    {
      header: 'Location',
      render: (space) => (
        <span className="text-xs text-ink-soft">
          {space.area}, {space.city}
        </span>
      ),
    },
    {
      header: 'Capacity & Rate',
      render: (space) => (
        <div>
          <span className="text-xs font-bold text-ink block">
            {space.capacity} guests
          </span>
          <span className="text-[11px] text-ink-soft">₹{space.ratePerHour}/hr</span>
        </div>
      ),
    },
    {
      header: 'Hours',
      render: (space) => (
        <span className="text-xs font-mono text-ink-soft">
          {space.openTime} – {space.closeTime}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (space) => <Badge variant={space.status}>{space.status}</Badge>,
    },
    {
      header: 'Actions',
      render: (space) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleEdit(space)}
            className="p-1.5 rounded-lg text-ink-soft hover:text-primary hover:bg-indigo-50"
            title="Edit Space"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleSpaceStatus(space.id)}
            className={`p-1.5 rounded-lg ${
              space.status === 'active'
                ? 'text-emerald-600 hover:text-amber-600'
                : 'text-slate-400 hover:text-emerald-600'
            } hover:bg-indigo-50`}
            title={space.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            <Power className="w-4 h-4" />
          </button>
          {!isAdminView && (
            <button
              onClick={() => handleDeletePrompt(space)}
              className="p-1.5 rounded-lg text-ink-soft hover:text-danger hover:bg-rose-50"
              title="Delete Space"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="py-2">
      <PageHeader
        title={isAdminView ? 'Manage All Spaces' : 'Manage Community Spaces'}
        subtitle={
          isAdminView
            ? 'Review and supervise spaces listed across all registered organizations.'
            : 'Add, update details, adjust hourly rates, or toggle listing availability.'
        }
        action={
          !isAdminView && (
            <Button variant="primary" icon={Plus} onClick={handleAddNew}>
              Add New Space
            </Button>
          )
        }
      />

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search by space name, category, or area..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Spaces Table */}
      <DataTable
        columns={columns}
        data={filteredSpaces}
        emptyMessage="No spaces found matching your search."
      />

      {/* Add / Edit Space Modal */}
      <SpaceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        spaceToEdit={selectedSpaceForEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Space?"
        message={`Are you sure you want to permanently delete "${spaceToDelete?.name}"? If there are active upcoming bookings, deletion will be blocked by system rules.`}
        confirmText="Delete Space"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
