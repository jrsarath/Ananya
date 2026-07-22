'use client';

import React, { useState, useEffect } from 'react';
import type { Component, Location } from '@ananya/inventory';
import { TransactionType } from '@ananya/inventory';
import { Dialog } from '../../components/ui/Dialog';
import { api } from '../../lib/api';

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  components: Component[];
  locations: Location[];
  initialComponentId?: string;
  initialLocationId?: string;
  initialType?: TransactionType;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  components,
  locations,
  initialComponentId = '',
  initialLocationId = '',
  initialType = TransactionType.Receipt,
}: TransactionModalProps) {
  const [componentId, setComponentId] = useState(initialComponentId);
  const [transactionType, setTransactionType] = useState<TransactionType>(initialType);
  const [quantity, setQuantity] = useState<number>(1);
  const [unitOfMeasure, setUnitOfMeasure] = useState('pcs');
  const [sourceLocationId, setSourceLocationId] = useState('');
  const [destinationLocationId, setDestinationLocationId] = useState(initialLocationId);
  const [reference, setReference] = useState('');
  const [reason, setReason] = useState('');
  const [createdBy] = useState('operator@48studios.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialComponentId) setComponentId(initialComponentId);
    if (initialLocationId) setDestinationLocationId(initialLocationId);
    if (initialType) setTransactionType(initialType);
  }, [initialComponentId, initialLocationId, initialType, isOpen]);

  useEffect(() => {
    const selectedComp = components.find((c) => c.id === componentId);
    if (selectedComp && selectedComp.unit) {
      setUnitOfMeasure(selectedComp.unit);
    }
  }, [componentId, components]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentId) {
      setError('Please select a component.');
      return;
    }
    if (quantity <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }

    if (transactionType === TransactionType.Transfer) {
      if (!sourceLocationId || !destinationLocationId) {
        setError('Transfer requires both source and destination locations.');
        return;
      }
      if (sourceLocationId === destinationLocationId) {
        setError('Source and destination locations must be different.');
        return;
      }
    } else if (transactionType === TransactionType.Receipt && !destinationLocationId) {
      setError('Receipt requires a destination location.');
      return;
    } else if (transactionType === TransactionType.Issue && !sourceLocationId) {
      setError('Issue requires a source location.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createTransaction({
        componentId,
        quantity,
        unitOfMeasure,
        sourceLocationId: sourceLocationId || undefined,
        destinationLocationId: destinationLocationId || undefined,
        transactionType,
        reference: reference || undefined,
        reason: reason || undefined,
        createdBy,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Inventory Transaction: ${transactionType}`}
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
            {loading ? 'Executing...' : 'Post Ledger Transaction'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="dialog-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && <div className="error-banner">{error}</div>}

        <div className="input-group">
          <label className="input-label">Transaction Type</label>
          <select
            className="select-field"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as TransactionType)}
          >
            <option value={TransactionType.Receipt}>RECEIPT (Receive Stock)</option>
            <option value={TransactionType.Transfer}>TRANSFER (Move Stock)</option>
            <option value={TransactionType.Issue}>ISSUE (Consume Stock)</option>
            <option value={TransactionType.Adjustment}>ADJUSTMENT (Audit/Correct)</option>
          </select>
        </div>

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Quantity</label>
            <input
              type="number"
              step="any"
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

        {(transactionType === TransactionType.Transfer || transactionType === TransactionType.Issue || transactionType === TransactionType.Adjustment) && (
          <div className="input-group">
            <label className="input-label">Source Location</label>
            <select
              className="select-field"
              value={sourceLocationId}
              onChange={(e) => setSourceLocationId(e.target.value)}
            >
              <option value="">-- Select Source Location --</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.code} - {loc.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {(transactionType === TransactionType.Receipt || transactionType === TransactionType.Transfer || transactionType === TransactionType.Adjustment) && (
          <div className="input-group">
            <label className="input-label">Destination Location</label>
            <select
              className="select-field"
              value={destinationLocationId}
              onChange={(e) => setDestinationLocationId(e.target.value)}
            >
              <option value="">-- Select Destination Location --</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.code} - {loc.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Reference / PO / Order #</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. PO-48091 or WO-102"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Reason / Notes</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Initial stock intake, project consumption"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </form>
    </Dialog>
  );
}
