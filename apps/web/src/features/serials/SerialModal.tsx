'use client';

import React, { useState } from 'react';
import type { Component, Location } from '@ananya/inventory';
import { Dialog } from '../../components/ui/Dialog';
import { api } from '../../lib/api';

export interface SerialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  components: Component[];
  locations: Location[];
}

export function SerialModal({
  isOpen,
  onClose,
  onSuccess,
  components,
  locations,
}: SerialModalProps) {
  const [componentId, setComponentId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [locationId, setLocationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentId || !serialNumber) {
      setError('Component and Serial Number are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createSerial({
        componentId,
        serialNumber,
        locationId: locationId || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create serial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Register Serial Number"
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
            {loading ? 'Registering...' : 'Save Serial Number'}
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
          <label className="input-label">Serial Number</label>
          <input
            type="text"
            className="input-field code-font"
            placeholder="e.g. SN-48-99012"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Current Location (Optional)</label>
          <select
            className="select-field"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <option value="">-- Select Location --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.code} - {loc.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Dialog>
  );
}
