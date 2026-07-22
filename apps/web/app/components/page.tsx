'use client';

import React, { useEffect, useState } from 'react';
import type { Component, Location, Manufacturer, Unit } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { Dialog } from '../../src/components/ui/Dialog';
import { formatLocationPathString } from '../../src/lib/location-utils';

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [manufacturerId, setManufacturerId] = useState('');
  const [defaultLocationId, setDefaultLocationId] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, locRes, mfgRes, unitRes] = await Promise.all([
        api.getComponents().catch(() => []),
        api.getLocations().catch(() => []),
        api.getManufacturers().catch(() => []),
        api.getUnits().catch(() => []),
      ]);
      setComponents(compRes);
      setLocations(locRes);
      setManufacturers(mfgRes);
      setUnits(unitRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load components');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name) {
      setFormError('SKU and Name are required.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await api.createComponent({
        sku,
        name,
        description: description || undefined,
        manufacturerId: manufacturerId || undefined,
        defaultLocationId: defaultLocationId || undefined,
        unit,
      });
      setModalOpen(false);
      setSku('');
      setName('');
      setDescription('');
      loadData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create component');
    } finally {
      setSubmitting(false);
    }
  };

  const getManufacturerName = (mfgId?: string | null) => {
    if (!mfgId) return '-';
    const m = manufacturers.find((mfg) => mfg.id === mfgId);
    return m ? `${m.code} (${m.name})` : mfgId;
  };

  const filteredComponents = components.filter(
    (c) =>
      c.sku.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Components Catalog</h1>
          <p className="section-sub">Master registry of physical parts, electronic components, and assemblies</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + New Component
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="search-container" style={{ marginBottom: '1.25rem' }}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by SKU, component name, description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table<Component>
        isLoading={loading}
        data={filteredComponents}
        keyExtractor={(c) => c.id}
        emptyText="No components found in master registry."
        columns={[
          {
            header: 'SKU / Code',
            accessor: (c) => (
              <span className="code-font" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                {c.sku}
              </span>
            ),
          },
          {
            header: 'Component Name',
            accessor: (c) => <span style={{ fontWeight: 600 }}>{c.name}</span>,
          },
          {
            header: 'Description',
            accessor: (c) => (
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {c.description || '-'}
              </span>
            ),
          },
          {
            header: 'Manufacturer',
            accessor: (c) => (
              <span className="code-font" style={{ color: 'var(--text-secondary)' }}>
                {getManufacturerName(c.manufacturerId)}
              </span>
            ),
          },
          {
            header: 'Default Storage Location',
            accessor: (c) => (
              <span className="location-path">
                {formatLocationPathString(locations, c.defaultLocationId)}
              </span>
            ),
          },
          {
            header: 'UOM',
            accessor: (c) => (
              <span className="code-font" style={{ textTransform: 'lowercase' }}>
                {c.unit || 'pcs'}
              </span>
            ),
          },
        ]}
      />

      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Component"
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
              onClick={handleCreateComponent}
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Save Component'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateComponent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && <div className="error-banner">{formError}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">SKU / Code</label>
              <input
                type="text"
                className="input-field code-font"
                placeholder="e.g. RES-0805-10K"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Component Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 10k Ohm 0805 Resistor 1%"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Description / Specifications</label>
            <textarea
              className="textarea-field"
              rows={3}
              placeholder="e.g. Thick film surface mount resistor, 100mW power rating"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Manufacturer</label>
              <select
                className="select-field"
                value={manufacturerId}
                onChange={(e) => setManufacturerId(e.target.value)}
              >
                <option value="">-- None / Unknown --</option>
                {manufacturers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} - {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Unit of Measure (UOM)</label>
              <select
                className="select-field"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                {units.length > 0 ? (
                  units.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.category})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="pcs">pcs (Pieces)</option>
                    <option value="meters">meters</option>
                    <option value="grams">grams</option>
                    <option value="liters">liters</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Default Storage Location</label>
            <select
              className="select-field"
              value={defaultLocationId}
              onChange={(e) => setDefaultLocationId(e.target.value)}
            >
              <option value="">-- Unassigned --</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.code} - {loc.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
