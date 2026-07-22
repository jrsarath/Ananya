'use client';

import React, { useEffect, useState } from 'react';
import type { Manufacturer } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { Dialog } from '../../src/components/ui/Dialog';

export default function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getManufacturers();
      setManufacturers(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load manufacturers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      setFormError('Code and Name are required.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await api.createManufacturer({ code, name });
      setModalOpen(false);
      setCode('');
      setName('');
      loadData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create manufacturer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Manufacturers & Vendors</h1>
          <p className="section-sub">Registry of component manufacturers, suppliers, and part numbering codes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + New Manufacturer
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Table<Manufacturer>
        isLoading={loading}
        data={manufacturers}
        keyExtractor={(m) => m.id}
        emptyText="No manufacturers registered."
        columns={[
          {
            header: 'Manufacturer Code',
            accessor: (m) => (
              <span className="code-font" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                {m.code}
              </span>
            ),
          },
          {
            header: 'Manufacturer Name',
            accessor: (m) => <span style={{ fontWeight: 600 }}>{m.name}</span>,
          },
          {
            header: 'ID',
            accessor: (m) => (
              <span className="code-font" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {m.id}
              </span>
            ),
          },
        ]}
      />

      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Manufacturer"
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
              {submitting ? 'Creating...' : 'Save Manufacturer'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && <div className="error-banner">{formError}</div>}

          <div className="input-group">
            <label className="input-label">Manufacturer Code</label>
            <input
              type="text"
              className="input-field code-font"
              placeholder="e.g. TI, YAGEO, MOLEX"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Manufacturer Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Texas Instruments"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
