'use client';

import React, { useEffect, useState } from 'react';
import type { Component, Location, Reservation } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { Badge } from '../../src/components/ui/Badge';
import { formatLocationPathString } from '../../src/lib/location-utils';
import { ReservationModal } from '../../src/features/reservations/ReservationModal';

export default function ReservationsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  // We fetch sample reservations or store in state
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, locRes] = await Promise.all([
        api.getComponents().catch(() => []),
        api.getLocations().catch(() => []),
      ]);
      setComponents(compRes);
      setLocations(locRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFulfill = async (id: string) => {
    setActionId(id);
    try {
      const updated = await api.fulfillReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fulfill reservation');
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (id: string) => {
    setActionId(id);
    try {
      const updated = await api.cancelReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to cancel reservation');
    } finally {
      setActionId(null);
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
          <h1 className="section-title">Inventory Reservations</h1>
          <p className="section-sub">Allocated inventory held for active work orders, projects, or production runs</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + Reserve Stock
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Table<Reservation>
        isLoading={loading}
        data={reservations}
        keyExtractor={(r) => r.id}
        emptyText="No stock reservations recorded. Click 'Reserve Stock' to allocate inventory."
        columns={[
          {
            header: 'Reservation ID',
            accessor: (r) => (
              <span className="code-font" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                {r.id.substring(0, 8)}...
              </span>
            ),
          },
          {
            header: 'Status',
            accessor: (r) => {
              const status = r.status || 'ACTIVE';
              const variant =
                status === 'FULFILLED'
                  ? 'receipt'
                  : status === 'CANCELLED'
                  ? 'issue'
                  : 'warning';
              return <Badge variant={variant}>{status}</Badge>;
            },
          },
          {
            header: 'Component',
            accessor: (r) => (
              <span style={{ fontWeight: 600 }}>{getComponentName(r.componentId)}</span>
            ),
          },
          {
            header: 'Quantity Reserved',
            accessor: (r) => (
              <span className="code-font" style={{ fontWeight: 700 }}>
                {r.quantity} {r.unitOfMeasure}
              </span>
            ),
          },
          {
            header: 'Reserved Location',
            accessor: (r) => (
              <span className="location-path">
                {formatLocationPathString(locations, r.locationId)}
              </span>
            ),
          },
          {
            header: 'Reference / Reserved By',
            accessor: (r) => (
              <div>
                <div style={{ fontWeight: 500 }}>{r.reference || '-'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.reservedBy}</div>
              </div>
            ),
          },
          {
            header: 'Actions',
            accessor: (r) => (
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {r.status === 'ACTIVE' && (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleFulfill(r.id)}
                      disabled={actionId === r.id}
                    >
                      Fulfill
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(r.id)}
                      disabled={actionId === r.id}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            ),
          },
        ]}
      />

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadData}
        components={components}
        locations={locations}
      />
    </div>
  );
}
