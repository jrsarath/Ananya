'use client';

import React, { useEffect, useState } from 'react';
import type { Component, Location, Serial } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { formatLocationPathString } from '../../src/lib/location-utils';
import { SerialModal } from '../../src/features/serials/SerialModal';

export default function SerialsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedCompId, setSelectedCompId] = useState('');
  const [serials, setSerials] = useState<Serial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, locRes] = await Promise.all([
        api.getComponents().catch(() => []),
        api.getLocations().catch(() => []),
      ]);
      setComponents(compRes);
      setLocations(locRes);

      if (compRes.length > 0 && compRes[0]) {
        setSelectedCompId(compRes[0].id);
        const sRes = await api.getSerialsByComponent(compRes[0].id).catch(() => []);
        setSerials(sRes);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load serial numbers');
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
      const sRes = await api.getSerialsByComponent(compId).catch(() => []);
      setSerials(sRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch serials');
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
          <h1 className="section-title">Serial Number Tracking</h1>
          <p className="section-sub">Individual serialized component tracking, location assignment, and traceability</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + Register Serial Number
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Component selector */}
      <div className="input-group" style={{ marginBottom: '1.25rem', maxWidth: '400px' }}>
        <label className="input-label">Filter Serials by Component</label>
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

      <Table<Serial>
        isLoading={loading}
        data={serials}
        keyExtractor={(s) => s.id}
        emptyText="No serial numbers registered for the selected component."
        columns={[
          {
            header: 'Serial Number',
            accessor: (s) => (
              <span className="code-font" style={{ fontWeight: 700, color: 'var(--accent)' }}>
                {s.serialNumber}
              </span>
            ),
          },
          {
            header: 'Component',
            accessor: (s) => (
              <span style={{ fontWeight: 600 }}>{getComponentName(s.componentId)}</span>
            ),
          },
          {
            header: 'Assigned Physical Location',
            accessor: (s) => (
              <span className="location-path">
                {formatLocationPathString(locations, s.locationId)}
              </span>
            ),
          },
          {
            header: 'Registration ID',
            accessor: (s) => (
              <span className="code-font" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {s.id}
              </span>
            ),
          },
        ]}
      />

      <SerialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadData}
        components={components}
        locations={locations}
      />
    </div>
  );
}
