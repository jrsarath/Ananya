'use client';

import { useState, useEffect } from 'react';
import { api } from '../../src/lib/api';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formTaxId, setFormTaxId] = useState('');
  const [formPaymentTerms, setFormPaymentTerms] = useState('NET30');

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const data = await api.getSuppliers(search);
        setSuppliers(data);
        setError(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load suppliers.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSupplier({
        code: formCode,
        name: formName,
        taxId: formTaxId || undefined,
        paymentTerms: formPaymentTerms,
      });
      setFormCode('');
      setFormName('');
      setFormTaxId('');
      setIsCreating(false);
      const data = await api.getSuppliers(search);
      setSuppliers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create supplier.';
      alert(msg);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-sm text-gray-500">Manage vendors, component distributors, and payment terms.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
        >
          {isCreating ? 'Cancel' : '+ New Supplier'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 border rounded bg-gray-50 space-y-4 max-w-2xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">Add Supplier</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Supplier Code *</label>
              <input
                type="text"
                required
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="e.g. SUP-DIGIKEY"
                className="w-full px-3 py-1.5 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Supplier Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Digi-Key Electronics"
                className="w-full px-3 py-1.5 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tax ID / VAT</label>
              <input
                type="text"
                value={formTaxId}
                onChange={(e) => setFormTaxId(e.target.value)}
                placeholder="US-12345678"
                className="w-full px-3 py-1.5 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Payment Terms</label>
              <select
                value={formPaymentTerms}
                onChange={(e) => setFormPaymentTerms(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded"
              >
                <option value="NET15">NET15</option>
                <option value="NET30">NET30</option>
                <option value="NET60">NET60</option>
                <option value="DUE_ON_RECEIPT">Due on Receipt</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white text-xs font-semibold rounded hover:bg-gray-800"
          >
            Save Supplier
          </button>
        </form>
      )}

      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by supplier code or name..."
          className="w-80 px-3 py-1.5 text-sm border rounded"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading suppliers...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="border rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 uppercase text-gray-600 border-b">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Payment Terms</th>
                <th className="p-3">Currency</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {suppliers.map((s) => (
                <tr key={String(s.id)} className="hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold text-gray-900">{String(s.code)}</td>
                  <td className="p-3 font-medium text-gray-800">{String(s.name)}</td>
                  <td className="p-3 text-gray-600">{String(s.paymentTerms)}</td>
                  <td className="p-3 text-gray-600">{String(s.currency)}</td>
                  <td className="p-3 text-gray-600">{String(s.rating)} / 5.0</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {s.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">No suppliers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
