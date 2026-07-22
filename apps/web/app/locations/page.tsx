'use client';

import React, { useEffect, useState } from 'react';
import type { Location } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { Dialog } from '../../src/components/ui/Dialog';
import { formatLocationPathString } from '../../src/lib/location-utils';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [kind, setKind] = useState('DRAWER');
  const [parentId, setParentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const locRes = await api.getLocations();
      setLocations(locRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      setFormError('Code and Name are required.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await api.createLocation({
        code,
        name,
        kind,
        parentId: parentId || null,
      });
      setModalOpen(false);
      setCode('');
      setName('');
      loadData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create location');
    } finally {
      setSubmitting(false);
    }
  };

  const getParentName = (pId?: string | null) => {
    if (!pId) return '- (Root)';
    const parent = locations.find((l) => l.id === pId);
    return parent ? `${parent.name} (${parent.code})` : pId;
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Physical Storage Locations</h1>
          <p className="section-sub">Human-readable physical storage hierarchy (warehouse, rooms, racks, drawers, bins)</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + New Storage Location
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Table<Location>
        isLoading={loading}
        data={locations}
        keyExtractor={(loc) => loc.id}
        emptyText="No storage locations defined."
        columns={[
          {
            header: 'Human-Readable Storage Path',
            accessor: (loc) => (
              <span className="location-path" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {formatLocationPathString(locations, loc.id)}
              </span>
            ),
          },
          {
            header: 'Location Name',
            accessor: (loc) => <span style={{ fontWeight: 500 }}>{loc.name}</span>,
          },
          {
            header: 'Canonical Code (Secondary)',
            accessor: (loc) => (
              <span className="code-font" style={{ color: 'var(--text-secondary)' }}>
                {loc.code}
              </span>
            ),
          },
          {
            header: 'Kind / Type',
            accessor: (loc) => (
              <span className="badge badge-neutral">{loc.kind}</span>
            ),
          },
          {
            header: 'Parent Location',
            accessor: (loc) => (
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {getParentName(loc.parentId)}
              </span>
            ),
          },
        ]}
      />

      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Physical Location"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreateLocation}
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Save Location'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateLocation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && <div className="error-banner">{formError}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Canonical Code</label>
              <input
                type="text"
                className="input-field code-font"
                placeholder="e.g. OFF-SMD-D02"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Location Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Drawer 2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Location Kind</label>
              <select
                className="select-field"
                value={kind}
                onChange={(e) => setKind(e.target.value)}
              >
                <option value="BUILDING">BUILDING (e.g. Main Office)</option>
                <option value="ROOM">ROOM (e.g. SMD Storage)</option>
                <option value="RACK">RACK / SHELF</option>
                <option value="DRAWER">DRAWER</option>
                <option value="CONTAINER">CONTAINER / BOX</option>
                <option value="BIN">BIN / TRAY</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Parent Location</label>
              <select
                className="select-field"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">-- None (Root Facility) --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {formatLocationPathString(locations, loc.id)} ({loc.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
