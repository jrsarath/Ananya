'use client';

import React, { useState, useEffect } from 'react';
import type { Component, Location } from '@ananya/inventory';
import { Dialog } from '../../components/ui/Dialog';
import { api } from '../../lib/api';

export interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  components: Component[];
  locations: Location[];
}

export function ReservationModal({
  isOpen,
  onClose,
  onSuccess,
  components,
  locations,
}: ReservationModalProps) {
  const [componentId, setComponentId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitOfMeasure, setUnitOfMeasure] = useState('pcs');
  const [reference, setReference] = useState('');
  const [reservedBy] = useState('operator@48studios.com');
  const [expiresAt, setExpiresAt] = useState('');
  const [availableQty, setAvailableQty] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const comp = components.find((c) => c.id === componentId);
    if (comp && comp.unit) {
      setUnitOfMeasure(comp.unit);
    }
  }, [componentId, components]);

  const handleCheckAvailable = async () => {
    if (!componentId || !locationId) return;
    setChecking(true);
    try {
      const res = await api.getAvailableQuantity(componentId, locationId);
      setAvailableQty(res.availableQuantity);
    } catch {
      setAvailableQty(null);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentId || !locationId) {
      setError('Component and Location are required.');
      return;
    }
    if (quantity <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createReservation({
        componentId,
        locationId,
        quantity,
        unitOfMeasure,
        reference: reference || undefined,
        reservedBy,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create Stock Reservation"
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
            {loading ? 'Creating...' : 'Reserve Stock'}
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
            onChange={(e) => {
              setComponentId(e.target.value);
              setAvailableQty(null);
            }}
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
          <label className="input-label">Location</label>
          <select
            className="select-field"
            value={locationId}
            onChange={(e) => {
              setLocationId(e.target.value);
              setAvailableQty(null);
            }}
            required
          >
            <option value="">-- Select Location --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.code} - {loc.name}
              </option>
            ))}
          </select>
        </div>

        {componentId && locationId && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', fontSize: '0.825rem' }}>
            <span>Available Balance:</span>
            <span className="code-font" style={{ fontWeight: 600, color: 'var(--accent)' }}>
              {checking ? 'Checking...' : availableQty !== null ? `${availableQty} ${unitOfMeasure}` : 'Unknown'}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCheckAvailable}
            >
              Check Availability
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Quantity</label>
            <input
              type="number"
              className="input-field code-font"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Unit of Measure</label>
            <input
              type="text"
              className="input-field code-font"
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Reference / Project / Work Order</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. PRJ-2026-X"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Expiration Date (Optional)</label>
          <input
            type="date"
            className="input-field"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>
      </form>
    </Dialog>
  );
}
