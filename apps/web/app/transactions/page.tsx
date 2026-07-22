'use client';

import React, { useEffect, useState } from 'react';
import type { Component, Location, InventoryTransaction } from '@ananya/inventory';
import { TransactionType } from '@ananya/inventory';
import { api } from '../../src/lib/api';
import { Table } from '../../src/components/ui/Table';
import { Badge } from '../../src/components/ui/Badge';
import { formatLocationPathString } from '../../src/lib/location-utils';
import { TransactionModal } from '../../src/features/transactions/TransactionModal';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [initialType, setInitialType] = useState<TransactionType>(TransactionType.Receipt);

  const loadData = async () => {
    setLoading(true);
    try {
      const [txRes, compRes, locRes] = await Promise.all([
        api.getTransactions().catch(() => []),
        api.getComponents().catch(() => []),
        api.getLocations().catch(() => []),
      ]);
      setTransactions(txRes);
      setComponents(compRes);
      setLocations(locRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewTransaction = (type: TransactionType) => {
    setInitialType(type);
    setModalOpen(true);
  };

  const getComponentName = (id: string) => {
    const c = components.find((comp) => comp.id === id);
    return c ? `${c.sku} - ${c.name}` : id;
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'ALL') return true;
    return tx.transactionType === filterType;
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Inventory Ledger Transactions</h1>
          <p className="section-sub">Immutable audit ledger of stock intake, transfers, consumption, and adjustments</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => openNewTransaction(TransactionType.Receipt)}
          >
            + New Transaction
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
        {['ALL', 'Receipt', 'Transfer', 'Issue', 'Adjustment'].map((type) => (
          <button
            key={type}
            className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <Table<InventoryTransaction>
        isLoading={loading}
        data={filteredTransactions}
        keyExtractor={(t) => t.id}
        emptyText="No transactions match the selected filter."
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
              <span style={{ fontWeight: 600 }}>{getComponentName(t.componentId)}</span>
            ),
          },
          {
            header: 'Quantity',
            accessor: (t) => (
              <span className="code-font" style={{ fontWeight: 700 }}>
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
          {
            header: 'Created By',
            accessor: (t) => (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {t.createdBy}
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
        initialType={initialType}
      />
    </div>
  );
}
