'use client';

import React, { useEffect, useState } from 'react';
import type { Component, Batch } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { BatchModal } from '../../src/features/batches/BatchModal';

export default function BatchesPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedCompId, setSelectedCompId] = useState('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const compRes = await api.getComponents().catch(() => []);
      setComponents(compRes);
      if (compRes.length > 0 && compRes[0]) {
        setSelectedCompId(compRes[0].id);
        const bRes = await api.getBatchesByComponent(compRes[0].id).catch(() => []);
        setBatches(bRes);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load batch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComponentSelect = async (compId: string) => {
    setSelectedCompId(compId);
    if (!compId) return;
    setLoading(true);
    try {
      const bRes = await api.getBatchesByComponent(compId).catch(() => []);
      setBatches(bRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  const getComponentName = (id: string) => {
    const c = components.find((comp) => comp.id === id);
    return c ? `${c.sku} (${c.name})` : id;
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Batch & Lot Tracking</h1>
          <p className="section-sub">Component production batch tracking, expiration dates, and supplier lot numbers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + Register Batch
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Component selector */}
      <div className="input-group" style={{ marginBottom: '1.25rem', maxWidth: '400px' }}>
        <label className="input-label">Filter Batches by Component</label>
        <select
          className="select-field"
          value={selectedCompId}
          onChange={(e) => handleComponentSelect(e.target.value)}
        >
          <option value="">-- Select Component --</option>
          {components.map((c) => (
            <option key={c.id} value={c.id}>
              {c.sku} - {c.name}
            </option>
          ))}
        </select>
      </div>

      <Table<Batch>
        isLoading={loading}
        data={batches}
        keyExtractor={(b) => b.id}
        emptyText="No batches registered for the selected component."
        columns={[
          {
            header: 'Batch / Lot Number',
            accessor: (b) => (
              <span className="code-font" style={{ fontWeight: 700, color: 'var(--accent)' }}>
                {b.batchNumber}
              </span>
            ),
          },
          {
            header: 'Component',
            accessor: (b) => (
              <span style={{ fontWeight: 600 }}>{getComponentName(b.componentId)}</span>
            ),
          },
          {
            header: 'Manufacturing Date',
            accessor: (b) => (
              <span className="code-font" style={{ color: 'var(--text-secondary)' }}>
                {b.manufacturingDate ? new Date(b.manufacturingDate).toLocaleDateString() : '-'}
              </span>
            ),
          },
          {
            header: 'Expiry Date',
            accessor: (b) => (
              <span className="code-font" style={{ color: 'var(--text-secondary)' }}>
                {b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : '-'}
              </span>
            ),
          },
          {
            header: 'Supplier Batch Code',
            accessor: (b) => (
              <span className="code-font" style={{ color: 'var(--text-muted)' }}>
                {b.supplierBatchNumber || '-'}
              </span>
            ),
          },
        ]}
      />

      <BatchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadData}
        components={components}
      />
    </div>
  );
}
