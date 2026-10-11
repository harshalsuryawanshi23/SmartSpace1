import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit,
  Mail,
  MapPin,
  Building,
  CheckCircle,
} from 'lucide-react';
import {
  Button,
  Input,
  Select,
  Badge,
  Modal,
  PageHeader,
} from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const ManageOrganizations = () => {
  const { organizations, spaces, saveOrganization } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: 'Pune',
    contactEmail: '',
    status: 'active',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingOrg(null);
    setFormData({
      name: '',
      city: 'Pune',
      contactEmail: '',
      status: 'active',
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (org) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      city: org.city,
      contactEmail: org.contactEmail,
      status: org.status || 'active',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contactEmail.trim()) {
      setError('Please provide organization name and contact email.');
      return;
    }

    setIsSaving(true);
    try {
      await saveOrganization({
        id: editingOrg?.id,
        ...formData,
      });
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-2">
      <PageHeader
        title="Manage Organizations & Societies"
        subtitle="Supervise residential societies, co-op housing complexes, and educational institutions."
        action={
          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Add Organization
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {organizations.map((org) => {
          const orgSpaces = spaces.filter((s) => s.organizationId === org.id);

          return (
            <div
              key={org.id}
              className="clay p-6 bg-surface border border-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl clay-bubble bg-indigo-50 text-primary flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-ink-soft">
                        {org.id}
                      </span>
                      <h3 className="font-heading font-bold text-lg text-ink">
                        {org.name}
                      </h3>
                    </div>
                  </div>
                  <Badge variant={org.status}>{org.status}</Badge>
                </div>

                <div className="space-y-1.5 text-xs text-ink-soft mb-4">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>City: <strong>{org.city}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Contact: {org.contactEmail}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-indigo-100 flex items-center justify-between">
                <span className="text-xs text-ink font-semibold flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-accent" />
                  <span>{orgSpaces.length} listed spaces</span>
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleOpenEdit(org)}
                >
                  Edit
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingOrg ? 'Edit Organization' : 'Register New Organization'}
        subtitle="Add a new society, tech park, or educational campus."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-danger text-xs font-semibold">
              {error}
            </div>
          )}

          <Input
            label="Organization / Society Name"
            placeholder="e.g. Silver Crest Co-op Housing Society"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

          <Input
            label="Contact Email"
            type="email"
            placeholder="office@silvercrest.org"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            required
          />

          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              {editingOrg ? 'Save Changes' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
