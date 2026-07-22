'use client';

import React, { useState } from 'react';
import type { Component } from '@ananya/inventory';
import { Dialog } from '../../components/ui/Dialog';
import { api } from '../../lib/api';

export interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  components: Component[];
}

export function BatchModal({
  isOpen,
  onClose,
  onSuccess,
  components,
}: BatchModalProps) {
  const [componentId, setComponentId] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [supplierBatchNumber, setSupplierBatchNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentId || !batchNumber) {
      setError('Component and Batch Number are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createBatch({
        componentId,
        batchNumber,
        manufacturingDate: manufacturingDate || undefined,
        expiryDate: expiryDate || undefined,
        supplierBatchNumber: supplierBatchNumber || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create Component Batch"
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Register Batch'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && <div className="error-banner">{error}</div>}

        <div className="input-group">
          <label className="input-label">Component</label>
          <select
            className="select-field"
            value={componentId}
            onChange={(e) => setComponentId(e.target.value)}
            required
          >
            <option value="">-- Select Component --</option>
            {components.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.sku} - {comp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Batch / Lot Number</label>
          <input
            type="text"
            className="input-field code-font"
            placeholder="e.g. BATCH-2026-001"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Manufacturing Date</label>
            <input
              type="date"
              className="input-field"
              value={manufacturingDate}
              onChange={(e) => setManufacturingDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Expiry Date</label>
            <input
              type="date"
              className="input-field"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Supplier Batch Number (Optional)</label>
          <input
            type="text"
            className="input-field code-font"
            placeholder="e.g. SUPP-LOT-8812"
            value={supplierBatchNumber}
            onChange={(e) => setSupplierBatchNumber(e.target.value)}
          />
        </div>
      </form>
    </Dialog>
  );
}
