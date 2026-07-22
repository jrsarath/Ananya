'use client';

import React, { useEffect, useState } from 'react';
import type { Unit } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { Dialog } from '../../src/components/ui/Dialog';

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('COUNT');
  const [isBaseUnit, setIsBaseUnit] = useState(true);
  const [conversionFactor, setConversionFactor] = useState<number>(1);
  const [precision, setPrecision] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getUnits();
      setUnits(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load units');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setFormError('Unit Name is required.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await api.createUnit({
        name,
        category,
        isBaseUnit,
        conversionFactor: isBaseUnit ? 1 : conversionFactor,
        precision,
      });
      setModalOpen(false);
      setName('');
      loadData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create unit of measure');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Units of Measure</h1>
          <p className="section-sub">Standard unit definitions, base units, conversion factors, and precision rules</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + New Unit of Measure
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Table<Unit>
        isLoading={loading}
        data={units}
        keyExtractor={(u) => u.id}
        emptyText="No units of measure registered."
        columns={[
          {
            header: 'Unit Name / Code',
            accessor: (u) => (
              <span className="code-font" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                {u.name}
              </span>
            ),
          },
          {
            header: 'Category',
            accessor: (u) => (
              <span className="badge badge-neutral">{u.category}</span>
            ),
          },
          {
            header: 'Base Unit Status',
            accessor: (u) => (
              <span className={`badge ${u.isBaseUnit ? 'badge-receipt' : 'badge-neutral'}`}>
                {u.isBaseUnit ? 'Base Unit' : 'Derived'}
              </span>
            ),
          },
          {
            header: 'Conversion Factor',
            accessor: (u) => (
              <span className="code-font">{u.conversionFactor ?? 1}</span>
            ),
          },
          {
            header: 'Decimal Precision',
            accessor: (u) => <span className="code-font">{u.precision}</span>,
          },
        ]}
      />

      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Unit of Measure"
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
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Save Unit'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && <div className="error-banner">{formError}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Unit Name / Symbol</label>
              <input
                type="text"
                className="input-field code-font"
                placeholder="e.g. pcs, meters, kg, reels"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                className="select-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="COUNT">COUNT (Pieces, Units)</option>
                <option value="LENGTH">LENGTH (Meters, mm)</option>
                <option value="WEIGHT">WEIGHT (Grams, kg)</option>
                <option value="VOLUME">VOLUME (Liters, ml)</option>
                <option value="PACKAGING">PACKAGING (Reels, Tubes, Cut Tape)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="isBaseUnit"
              checked={isBaseUnit}
              onChange={(e) => setIsBaseUnit(e.target.checked)}
            />
            <label htmlFor="isBaseUnit" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
              Is this a Base Unit of Measure?
            </label>
          </div>

          {!isBaseUnit && (
            <div className="input-group">
              <label className="input-label">Conversion Factor (Relative to Base Unit)</label>
              <input
                type="number"
                step="any"
                className="input-field code-font"
                value={conversionFactor}
                onChange={(e) => setConversionFactor(parseFloat(e.target.value) || 1)}
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Decimal Precision (Digits after decimal)</label>
            <input
              type="number"
              className="input-field code-font"
              value={precision}
              onChange={(e) => setPrecision(parseInt(e.target.value, 10) || 0)}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
