'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Component, Location, InventoryTransaction } from '@ananya/inventory';
import { TransactionType } from '@ananya/inventory';
import { api } from '../src/lib/api';
import { Badge } from '../src/components/ui/Badge';
import { Table } from '../src/components/ui/Table';
import { formatLocationPathString } from '../src/lib/location-utils';
import { TransactionModal } from '../src/features/transactions/TransactionModal';

export default function DashboardPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>(TransactionType.Receipt);

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
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAction = (type: TransactionType) => {
    setModalType(type);
    setModalOpen(true);
  };

  const getComponentName = (id: string) => {
    const c = components.find((comp) => comp.id === id);
    return c ? `${c.sku} (${c.name})` : id;
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Operations Console</h1>
          <p className="section-sub">48 Studios physical inventory & ledger operations</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={() => openAction(TransactionType.Receipt)}>
            + Receive Stock
          </button>
          <button className="btn btn-secondary" onClick={() => openAction(TransactionType.Transfer)}>
            Move Stock
          </button>
          <button className="btn btn-secondary" onClick={() => openAction(TransactionType.Issue)}>
            Consume Stock
          </button>
          <button className="btn btn-secondary" onClick={() => openAction(TransactionType.Adjustment)}>
            Adjust Stock
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-cell">
          <div className="stat-label">Components Catalog</div>
          <div className="stat-value">{loading ? '...' : components.length}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Storage Locations</div>
          <div className="stat-value">{loading ? '...' : locations.length}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Ledger Transactions</div>
          <div className="stat-value">{loading ? '...' : transactions.length}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Primary Context</div>
          <div className="stat-value" style={{ fontSize: '1.1rem', color: 'var(--accent)' }}>
            Search First
          </div>
        </div>
      </div>

      {/* Quick Search Launcher */}
      <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Direct Inventory Discovery</span>
          <Link href="/inventory" className="btn btn-secondary btn-sm">
            Open Full Inventory Browser →
          </Link>
        </div>
        <Link href="/inventory" style={{ display: 'block' }}>
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search components by SKU, name, MPN, location, alias, or specs..."
              readOnly
            />
            <span className="shortcut-kbd">Press /</span>
          </div>
        </Link>
      </div>

      {/* Recent Ledger Activity */}
      <div className="section-header">
        <h2 className="section-title" style={{ fontSize: '1rem' }}>Recent Ledger Activity</h2>
        <Link href="/transactions" style={{ fontSize: '0.825rem', color: 'var(--accent)' }}>
          View All Transactions →
        </Link>
      </div>

      <Table<InventoryTransaction>
        isLoading={loading}
        data={transactions.slice(0, 10)}
        keyExtractor={(t) => t.id}
        emptyText="No ledger transactions recorded yet. Use 'Receive Stock' to add initial inventory."
        columns={[
          {
            header: 'Timestamp',
            accessor: (t) => (
              <span className="code-font" style={{ color: 'var(--text-secondary)' }}>
                {new Date(t.createdAt).toLocaleString()}
              </span>
            ),
          },
          {
            header: 'Type',
            accessor: (t) => {
              const v = t.transactionType.toLowerCase();
              const variant = v === 'receipt' ? 'receipt' : v === 'transfer' ? 'transfer' : v === 'issue' ? 'issue' : 'adjustment';
              return <Badge variant={variant}>{t.transactionType}</Badge>;
            },
          },
          {
            header: 'Component',
            accessor: (t) => (
              <span style={{ fontWeight: 500 }}>{getComponentName(t.componentId)}</span>
            ),
          },
          {
            header: 'Quantity',
            accessor: (t) => (
              <span className="code-font" style={{ fontWeight: 600 }}>
                {t.quantity} {t.unitOfMeasure}
              </span>
            ),
          },
          {
            header: 'Source Location',
            accessor: (t) => (
              <span className="code-font" style={{ color: 'var(--text-secondary)' }}>
                {t.sourceLocationId ? formatLocationPathString(locations, t.sourceLocationId) : '-'}
              </span>
            ),
          },
          {
            header: 'Destination Location',
            accessor: (t) => (
              <span className="code-font" style={{ color: 'var(--text-secondary)' }}>
                {t.destinationLocationId ? formatLocationPathString(locations, t.destinationLocationId) : '-'}
              </span>
            ),
          },
          {
            header: 'Reference',
            accessor: (t) => (
              <span className="code-font" style={{ color: 'var(--text-muted)' }}>
                {t.reference || '-'}
              </span>
            ),
          },
        ]}
      />

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadData}
        components={components}
        locations={locations}
        initialType={modalType}
      />
    </div>
  );
}
