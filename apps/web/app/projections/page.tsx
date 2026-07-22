'use client';

import React, { useEffect, useState } from 'react';
import type { Component, Location, InventoryProjection } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { formatLocationPathString } from '../../src/lib/location-utils';

export default function ProjectionsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [projections, setProjections] = useState<InventoryProjection[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [compRes, locRes] = await Promise.all([
          api.getComponents().catch(() => []),
          api.getLocations().catch(() => []),
        ]);
        setComponents(compRes);
        setLocations(locRes);

        if (compRes.length > 0 && compRes[0]) {
          const proj = await api.getProjectionsByComponent(compRes[0].id);
          setProjections(proj);
          setSelectedComponentId(compRes[0].id);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load projections');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleComponentChange = async (compId: string) => {
    setSelectedComponentId(compId);
    setSelectedLocationId('');
    if (!compId) return;
    setLoading(true);
    try {
      const proj = await api.getProjectionsByComponent(compId);
      setProjections(proj);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projections for component');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = async (locId: string) => {
    setSelectedLocationId(locId);
    setSelectedComponentId('');
    if (!locId) return;
    setLoading(true);
    try {
      const proj = await api.getProjectionsByLocation(locId);
      setProjections(proj);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projections for location');
    } finally {
      setLoading(false);
    }
  };

  const handleRebuild = async () => {
    setRebuilding(true);
    setMessage('');
    setError('');
    try {
      const res = await api.rebuildProjections();
      setMessage(res.message || 'Inventory projections rebuilt successfully');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to rebuild projections');
    } finally {
      setRebuilding(false);
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
          <h1 className="section-title">Inventory Projections</h1>
          <p className="section-sub">Read-side materialized stock projections computed from ledger transactions</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleRebuild}
          disabled={rebuilding}
        >
          {rebuilding ? 'Rebuilding...' : '🔄 Rebuild Projections'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '0.65rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
          {message}
        </div>
      )}
      {error && <div className="error-banner">{error}</div>}

      {/* Query Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
        <div className="input-group">
          <label className="input-label">Filter by Component</label>
          <select
            className="select-field"
            value={selectedComponentId}
            onChange={(e) => handleComponentChange(e.target.value)}
          >
            <option value="">-- All / Select Component --</option>
            {components.map((c) => (
              <option key={c.id} value={c.id}>
                {c.sku} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Filter by Location</label>
          <select
            className="select-field"
            value={selectedLocationId}
            onChange={(e) => handleLocationChange(e.target.value)}
          >
            <option value="">-- All / Select Location --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.code} - {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table<InventoryProjection>
        isLoading={loading}
        data={projections}
        keyExtractor={(p) => p.id || `${p.componentId}:${p.locationId}`}
        emptyText="No projections found for the selected component or location."
        columns={[
          {
            header: 'Component',
            accessor: (p) => (
              <span style={{ fontWeight: 600 }}>{getComponentName(p.componentId)}</span>
            ),
          },
          {
            header: 'Location Path',
            accessor: (p) => (
              <span className="location-path">
                {formatLocationPathString(locations, p.locationId)}
              </span>
            ),
          },
          {
            header: 'Projected Quantity',
            accessor: (p) => (
              <span
                className="code-font"
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: p.quantity > 0 ? 'var(--success)' : 'var(--text-muted)',
                }}
              >
                {p.quantity} {p.unitOfMeasure}
              </span>
            ),
          },
          {
            header: 'Last Projected At',
            accessor: (p) => (
              <span className="code-font" style={{ color: 'var(--text-secondary)' }}>
                {p.lastUpdated ? new Date(p.lastUpdated).toLocaleString() : 'Just now'}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
