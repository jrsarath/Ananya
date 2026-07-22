'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../src/lib/api';

export default function SupplierReturnsPage() {
  const [returns, setReturns] = useState<Record<string, unknown>[]>([]);
  const [suppliers, setSuppliers] = useState<Record<string, unknown>[]>([]);
  const [components, setComponents] = useState<Record<string, unknown>[]>([]);
  const [locations, setLocations] = useState<Record<string, unknown>[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [supplierId, setSupplierId] = useState('');
  const [rmaNumber, setRmaNumber] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<Record<string, unknown> | null>(null);

  // Return line
  const [componentId, setComponentId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [qty, setQty] = useState('1');
  const [unitPrice, setUnitPrice] = useState('0.00');
  const [reason, setReason] = useState('Defective');

  const fetchData = useCallback(async () => {
    try {
      const [retData, supData, compData, locData] = await Promise.all([
        api.getSupplierReturns(),
        api.getSuppliers(),
        api.getComponents(),
        api.getLocations(),
      ]);
      setReturns(retData);
      setSuppliers(supData);
      setComponents(compData as unknown as Record<string, unknown>[]);
      setLocations(locData as unknown as Record<string, unknown>[]);
    } catch (err: unknown) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSupplierReturn({
        supplierId,
        rmaNumber: rmaNumber || undefined,
      });
      setIsCreating(false);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create return';
      alert(msg);
    }
  };

  const handleAddLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturn) return;
    try {
      await api.addReturnLine(String(selectedReturn.id), {
        componentId,
        locationId,
        quantityReturned: parseInt(qty, 10),
        unitPrice: parseFloat(unitPrice),
        reason,
      });
      const updated = await api.getSupplierReturn(String(selectedReturn.id));
      setSelectedReturn(updated);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add return line';
      alert(msg);
    }
  };

  const handleDispatch = async (returnId: string) => {
    try {
      await api.dispatchReturn(returnId);
      alert('Return dispatched! Inventory issue transaction executed.');
      fetchData();
      if (selectedReturn?.id === returnId) {
        const updated = await api.getSupplierReturn(returnId);
        setSelectedReturn(updated);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to dispatch return';
      alert(msg);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Supplier Returns</h1>
          <p className="text-sm text-gray-500">Defective items return, RMA tracking, and inventory issue dispatch.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
        >
          {isCreating ? 'Cancel' : '+ New Supplier Return'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 border rounded bg-gray-50 space-y-4 max-w-xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">Create Supplier Return</h2>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Supplier *</label>
            <select
              required
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded bg-white"
            >
              <option value="">-- Choose Supplier --</option>
              {suppliers.map((s) => (
                <option key={String(s.id)} value={String(s.id)}>{String(s.code)} - {String(s.name)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Supplier RMA Number</label>
            <input
              type="text"
              value={rmaNumber}
              onChange={(e) => setRmaNumber(e.target.value)}
              placeholder="RMA-9922"
              className="w-full px-3 py-1.5 text-sm border rounded"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-semibold rounded">
            Save Return Document
          </button>
        </form>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <div className="border rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 uppercase text-gray-600 border-b">
                <tr>
                  <th className="p-3">Return #</th>
                  <th className="p-3">RMA #</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {returns.map((r) => (
                  <tr
                    key={String(r.id)}
                    onClick={() => setSelectedReturn(r)}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedReturn?.id === r.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="p-3 font-mono font-bold text-gray-900">{String(r.returnNumber)}</td>
                    <td className="p-3 font-mono text-gray-600">{String(r.rmaNumber || '—')}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-800">
                        {String(r.status)}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold">${Number(r.totalAmount).toFixed(2)}</td>
                  </tr>
                ))}
                {returns.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No Supplier Returns.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-5">
          {selectedReturn ? (
            <div className="border rounded p-4 space-y-4 bg-white">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="font-mono font-bold text-lg">{String(selectedReturn.returnNumber)}</h3>
                  <p className="text-xs text-gray-500">Status: {String(selectedReturn.status)}</p>
                </div>
                {selectedReturn.status === 'DRAFT' && (
                  <button
                    onClick={async () => {
                      await api.approveReturn(String(selectedReturn.id));
                      fetchData();
                    }}
                    className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded"
                  >
                    Approve Return
                  </button>
                )}
                {selectedReturn.status === 'APPROVED' && (
                  <button
                    onClick={() => handleDispatch(String(selectedReturn.id))}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded shadow hover:bg-red-700"
                  >
                    Dispatch & Remove Stock
                  </button>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-gray-600 mb-2">Return Lines</h4>
                <div className="space-y-2">
                  {((selectedReturn.lines as Record<string, unknown>[]) ?? []).map((l) => {
                    const comp = components.find((c) => c.id === l.componentId);
                    return (
                      <div key={String(l.id)} className="p-2 border rounded text-xs flex justify-between bg-gray-50">
                        <div>
                          <p className="font-bold">{String(comp?.sku ?? l.componentId)}</p>
                          <p className="text-gray-500">Reason: {String(l.reason)}</p>
                        </div>
                        <div className="text-right font-mono font-bold text-red-600">
                          -{String(l.quantityReturned)} pcs @ ${String(l.unitPrice)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedReturn.status === 'DRAFT' && (
                <form onSubmit={handleAddLine} className="border-t pt-3 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-gray-600">Add Return Item</h4>
                  <select
                    required
                    value={componentId}
                    onChange={(e) => setComponentId(e.target.value)}
                    className="w-full px-2 py-1 text-xs border rounded"
                  >
                    <option value="">-- Select Component --</option>
                    {components.map((c) => (
                      <option key={String(c.id)} value={String(c.id)}>{String(c.sku)} - {String(c.name)}</option>
                    ))}
                  </select>
                  <select
                    required
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full px-2 py-1 text-xs border rounded"
                  >
                    <option value="">-- Select Location --</option>
                    {locations.map((loc) => (
                      <option key={String(loc.id)} value={String(loc.id)}>{String(loc.code)} ({String(loc.name)})</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      required
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="px-2 py-1 text-xs border rounded"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Unit Price"
                      required
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      className="px-2 py-1 text-xs border rounded"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Return Reason (e.g. Broken Pin)"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-2 py-1 text-xs border rounded"
                  />
                  <button type="submit" className="w-full py-1.5 bg-gray-900 text-white text-xs font-medium rounded">
                    + Add Item to Return
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-8 border border-dashed rounded text-center text-sm text-gray-400">
              Select a Supplier Return to inspect or dispatch.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
