'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../src/lib/api';

export default function SettingsPage() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const checkConnection = async () => {
    setApiStatus('checking');
    setErrorMessage('');
    try {
      await api.getComponents();
      setApiStatus('connected');
    } catch (err: unknown) {
      setApiStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unable to connect to NestJS backend API.');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Operations System Settings</h1>
          <p className="section-sub">48 Studios system parameters, backend integration status, and configuration</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        {/* Backend API Status */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Backend API Health & Connection
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem' }}>API Endpoint:</span>
            <span className="code-font" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem' }}>Status:</span>
            {apiStatus === 'checking' && <span className="badge badge-neutral">Checking...</span>}
            {apiStatus === 'connected' && <span className="badge badge-receipt">CONNECTED (Healthy)</span>}
            {apiStatus === 'error' && <span className="badge badge-issue">DISCONNECTED / ERROR</span>}
          </div>

          {errorMessage && <div className="error-banner">{errorMessage}</div>}

          <button className="btn btn-secondary btn-sm" onClick={checkConnection}>
            Re-test API Connection
          </button>
        </div>

        {/* Operational System Parameters */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            System Architecture Principles
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li>• <strong>Domain Rules:</strong> Enforced inside <code className="code-font">@ananya/inventory</code> domain services</li>
            <li>• <strong>Ledger Immutability:</strong> Ledger transactions are never edited or deleted</li>
            <li>• <strong>Physical Context:</strong> Human-readable location paths prioritized across all views</li>
            <li>• <strong>Dense & Calm UI:</strong> Operational tool optimized for daily engineering workflows</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
