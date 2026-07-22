'use client';

import React, { useEffect, useState, useRef } from 'react';
import type { Component, Location, InventoryTransaction } from '@ananya/inventory';
import { TransactionType } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { formatLocationPathString } from '../../src/lib/location-utils';
import { TransactionModal } from '../../src/features/transactions/TransactionModal';

interface InventoryStockRow {
  component: Component;
  locationId: string | null;
  totalQuantity: number;
}

export default function InventoryBrowserPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modal State
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedCompId, setSelectedCompId] = useState('');
  const [selectedLocId, setSelectedLocId] = useState('');
  const [selectedTxType, setSelectedTxType] = useState<TransactionType>(TransactionType.Receipt);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, locRes, txRes] = await Promise.all([
        api.getComponents().catch(() => []),
        api.getLocations().catch(() => []),
        api.getTransactions().catch(() => []),
      ]);
      setComponents(compRes);
      setLocations(locRes);
      setTransactions(txRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute calculated stock balances from transactions
  const stockMap = new Map<string, InventoryStockRow>();

  // Ensure all components exist in map
  components.forEach((comp) => {
    const key = `${comp.id}:${comp.defaultLocationId || 'unassigned'}`;
    stockMap.set(key, {
      component: comp,
      locationId: comp.defaultLocationId || null,
      totalQuantity: 0,
    });
  });

  // Apply ledger transactions
  transactions.forEach((tx) => {
    const comp = components.find((c) => c.id === tx.componentId);
    if (!comp) return;

    if (tx.transactionType === TransactionType.Receipt && tx.destinationLocationId) {
      const key = `${comp.id}:${tx.destinationLocationId}`;
      const existing = stockMap.get(key) || { component: comp, locationId: tx.destinationLocationId, totalQuantity: 0 };
      existing.totalQuantity += tx.quantity;
      stockMap.set(key, existing);
    } else if (tx.transactionType === TransactionType.Issue && tx.sourceLocationId) {
      const key = `${comp.id}:${tx.sourceLocationId}`;
      const existing = stockMap.get(key) || { component: comp, locationId: tx.sourceLocationId, totalQuantity: 0 };
      existing.totalQuantity -= tx.quantity;
      stockMap.set(key, existing);
    } else if (tx.transactionType === TransactionType.Transfer) {
      if (tx.sourceLocationId) {
        const srcKey = `${comp.id}:${tx.sourceLocationId}`;
        const existingSrc = stockMap.get(srcKey) || { component: comp, locationId: tx.sourceLocationId, totalQuantity: 0 };
        existingSrc.totalQuantity -= tx.quantity;
        stockMap.set(srcKey, existingSrc);
      }
      if (tx.destinationLocationId) {
        const destKey = `${comp.id}:${tx.destinationLocationId}`;
        const existingDest = stockMap.get(destKey) || { component: comp, locationId: tx.destinationLocationId, totalQuantity: 0 };
        existingDest.totalQuantity += tx.quantity;
        stockMap.set(destKey, existingDest);
      }
    } else if (tx.transactionType === TransactionType.Adjustment && tx.destinationLocationId) {
      const key = `${comp.id}:${tx.destinationLocationId}`;
      const existing = stockMap.get(key) || { component: comp, locationId: tx.destinationLocationId, totalQuantity: 0 };
      existing.totalQuantity += tx.quantity;
      stockMap.set(key, existing);
    }
  });

  const stockRows = Array.from(stockMap.values());

  // Filter based on search input (SKU, name, location, specs, etc.)
  const filteredRows = stockRows.filter((row) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const locStr = formatLocationPathString(locations, row.locationId).toLowerCase();
    return (
      row.component.sku.toLowerCase().includes(query) ||
      row.component.name.toLowerCase().includes(query) ||
      (row.component.description || '').toLowerCase().includes(query) ||
      locStr.includes(query)
    );
  });

  const triggerAction = (type: TransactionType, compId: string, locId?: string | null) => {
    setSelectedTxType(type);
    setSelectedCompId(compId);
    setSelectedLocId(locId || '');
    setActionModalOpen(true);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Inventory Browser</h1>
          <p className="section-sub">Search-first primary daily interface for component discovery & stock actions</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => triggerAction(TransactionType.Receipt, '')}
        >
          + Receive Inventory
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Primary Search Bar */}
      <div className="search-container" style={{ marginBottom: '1.25rem' }}>
        <span className="search-icon">🔍</span>
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder="Filter by SKU, item name, component value, package, manufacturer MPN, alias, location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="shortcut-kbd">/</span>
      </div>

      <Table<InventoryStockRow>
        isLoading={loading}
        data={filteredRows}
        keyExtractor={(r) => `${r.component.id}:${r.locationId}`}
        emptyText="No inventory items match search criteria"
        columns={[
          {
            header: 'Item SKU',
            accessor: (r) => (
              <span className="code-font" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                {r.component.sku}
              </span>
            ),
          },
          {
            header: 'Item Identity / Specifications',
            accessor: (r) => (
              <div>
                <div style={{ fontWeight: 600 }}>{r.component.name}</div>
                {r.component.description && (
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    {r.component.description}
                  </div>
                )}
              </div>
            ),
          },
          {
            header: 'Current Quantity',
            accessor: (r) => (
              <span
                className="code-font"
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: r.totalQuantity > 0 ? 'var(--success)' : 'var(--text-muted)',
                }}
              >
                {r.totalQuantity} {r.component.unit || 'pcs'}
              </span>
            ),
          },
          {
            header: 'Physical Location',
            accessor: (r) => (
              <span className="location-path">
                {formatLocationPathString(locations, r.locationId)}
              </span>
            ),
          },
          {
            header: 'Immediate Actions',
            accessor: (r) => (
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => triggerAction(TransactionType.Receipt, r.component.id, r.locationId)}
                  title="Receive Stock"
                >
                  Receive
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => triggerAction(TransactionType.Transfer, r.component.id, r.locationId)}
                  title="Move Stock"
                >
                  Move
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => triggerAction(TransactionType.Issue, r.component.id, r.locationId)}
                  title="Consume Stock"
                >
                  Consume
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => triggerAction(TransactionType.Adjustment, r.component.id, r.locationId)}
                  title="Adjust Stock"
                >
                  Adjust
                </button>
              </div>
            ),
          },
        ]}
      />

      <TransactionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        onSuccess={loadData}
        components={components}
        locations={locations}
        initialComponentId={selectedCompId}
        initialLocationId={selectedLocId}
        initialType={selectedTxType}
      />
    </div>
  );
}
