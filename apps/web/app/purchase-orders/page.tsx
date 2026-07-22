'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../src/lib/api';

export default function PurchaseOrdersPage() {
  const [pos, setPos] = useState<Record<string, unknown>[]>([]);
  const [suppliers, setSuppliers] = useState<Record<string, unknown>[]>([]);
  const [components, setComponents] = useState<Record<string, unknown>[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPo, setSelectedPo] = useState<Record<string, unknown> | null>(null);

  // Line item modal
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [unitPrice, setUnitPrice] = useState('0.00');
  const [quantityOrdered, setQuantityOrdered] = useState('1');

  const fetchData = useCallback(async () => {
    try {
      const [poData, supData, compData] = await Promise.all([
        api.getPurchaseOrders(),
        api.getSuppliers(),
        api.getComponents(),
      ]);
      setPos(poData);
      setSuppliers(supData);
      setComponents(compData as unknown as Record<string, unknown>[]);
    } catch (err: unknown) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreatePo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPurchaseOrder({
        supplierId: selectedSupplierId,
        notes: notes || undefined,
      });
      setIsCreating(false);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create Purchase Order';
      alert(msg);
    }
  };

  const handleAddLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPo) return;
    try {
      await api.addPoLine(String(selectedPo.id), {
        componentId: selectedComponentId,
        unitPrice: parseFloat(unitPrice),
        quantityOrdered: parseInt(quantityOrdered, 10),
      });
      const updated = await api.getPurchaseOrder(String(selectedPo.id));
      setSelectedPo(updated);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add PO line';
      alert(msg);
    }
  };

  const handleStatusChange = async (poId: string, action: 'submit' | 'approve' | 'issue' | 'cancel') => {
    try {
      if (action === 'submit') await api.submitPo(poId);
      if (action === 'approve') await api.approvePo(poId);
      if (action === 'issue') await api.issuePo(poId);
      if (action === 'cancel') await api.cancelPo(poId);
      
      if (selectedPo?.id === poId) {
        const updated = await api.getPurchaseOrder(poId);
        setSelectedPo(updated);
      }
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to ${action} PO`;
      alert(msg);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-sm text-gray-500">Commercial purchasing contracts, line item entry, and approval lifecycle.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
        >
          {isCreating ? 'Cancel' : '+ New Purchase Order'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreatePo} className="p-4 border rounded bg-gray-50 space-y-4 max-w-xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">Create Draft PO</h2>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Supplier *</label>
            <select
              required
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded bg-white"
            >
              <option value="">-- Choose Supplier --</option>
              {suppliers.map((s) => (
                <option key={String(s.id)} value={String(s.id)}>{String(s.code)} ({String(s.name)})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes / Terms</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery instructions..."
              className="w-full px-3 py-1.5 text-sm border rounded"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-semibold rounded">
            Save Draft PO
          </button>
        </form>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <div className="border rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 uppercase text-gray-600 border-b">
                <tr>
                  <th className="p-3">PO Number</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Grand Total</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pos.map((p) => (
                  <tr
                    key={String(p.id)}
                    onClick={() => setSelectedPo(p)}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedPo?.id === p.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="p-3 font-mono font-bold text-gray-900">{String(p.poNumber)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-800">
                        {String(p.status)}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold text-gray-900">${Number(p.grandTotal).toFixed(2)} {String(p.currency)}</td>
                    <td className="p-3 text-gray-500">{new Date(String(p.createdAt)).toLocaleDateString()}</td>
                  </tr>
                ))}
                {pos.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No Purchase Orders.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-5">
          {selectedPo ? (
            <div className="border rounded p-4 space-y-4 bg-white">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="font-mono font-bold text-lg">{String(selectedPo.poNumber)}</h3>
                  <p className="text-xs text-gray-500">Status: <span className="font-semibold">{String(selectedPo.status)}</span></p>
                </div>
                <div className="space-x-1">
                  {selectedPo.status === 'DRAFT' && (
                    <button onClick={() => handleStatusChange(String(selectedPo.id), 'submit')} className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">Submit</button>
                  )}
                  {selectedPo.status === 'SUBMITTED' && (
                    <button onClick={() => handleStatusChange(String(selectedPo.id), 'approve')} className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">Approve</button>
                  )}
                  {selectedPo.status === 'APPROVED' && (
                    <button onClick={() => handleStatusChange(String(selectedPo.id), 'issue')} className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">Issue to Vendor</button>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-gray-600 mb-2">Line Items</h4>
                <div className="space-y-2">
                  {(selectedPo.lines as Record<string, unknown>[] ?? []).map((l) => {
                    const comp = components.find((c) => c.id === l.componentId);
                    return (
                      <div key={String(l.id)} className="p-2 border rounded text-xs flex justify-between bg-gray-50">
                        <div>
                          <p className="font-bold">{String(comp?.sku ?? l.componentId)}</p>
                          <p className="text-gray-500">{String(comp?.name ?? '')}</p>
                        </div>
                        <div className="text-right font-mono">
                          <p>{String(l.quantityOrdered)} pcs @ ${String(l.unitPrice)}</p>
                          <p className="text-gray-500">Received: {String(l.quantityReceived)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedPo.status === 'DRAFT' && (
                <form onSubmit={handleAddLine} className="border-t pt-3 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-gray-600">Add Component Line</h4>
                  <select
                    required
                    value={selectedComponentId}
                    onChange={(e) => setSelectedComponentId(e.target.value)}
                    className="w-full px-2 py-1 text-xs border rounded"
                  >
                    <option value="">-- Choose Component --</option>
                    {components.map((c) => (
                      <option key={String(c.id)} value={String(c.id)}>{String(c.sku)} - {String(c.name)}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500">Unit Price ($)</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">Qty Ordered</label>
                      <input
                        type="number"
                        required
                        value={quantityOrdered}
                        onChange={(e) => setQuantityOrdered(e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-1.5 bg-gray-900 text-white text-xs font-medium rounded">
                    + Add Line to PO
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-8 border border-dashed rounded text-center text-sm text-gray-400">
              Select a Purchase Order to view lines and manage workflow.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
