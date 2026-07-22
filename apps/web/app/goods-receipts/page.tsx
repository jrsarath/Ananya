'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../src/lib/api';

export default function GoodsReceiptsPage() {
  const [receipts, setReceipts] = useState<Record<string, unknown>[]>([]);
  const [pos, setPos] = useState<Record<string, unknown>[]>([]);
  const [locations, setLocations] = useState<Record<string, unknown>[]>([]);
  const [components, setComponents] = useState<Record<string, unknown>[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [selectedPoId, setSelectedPoId] = useState('');
  const [packingSlipNumber, setPackingSlipNumber] = useState('');
  const [selectedGr, setSelectedGr] = useState<Record<string, unknown> | null>(null);

  // Line receiving state
  const [receivingPoLineId, setReceivingPoLineId] = useState('');
  const [receivingLocationId, setReceivingLocationId] = useState('');
  const [receivingQty, setReceivingQty] = useState('1');

  const fetchData = useCallback(async () => {
    try {
      const [grData, poData, locData, compData] = await Promise.all([
        api.getGoodsReceipts(),
        api.getPurchaseOrders(),
        api.getLocations(),
        api.getComponents(),
      ]);
      setReceipts(grData);
      setPos(poData.filter((p) => ['ISSUED', 'PARTIALLY_RECEIVED'].includes(String(p.status))));
      setLocations(locData as unknown as Record<string, unknown>[]);
      setComponents(compData as unknown as Record<string, unknown>[]);
    } catch (err: unknown) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateGr = async (e: React.FormEvent) => {
    e.preventDefault();
    const po = pos.find((p) => p.id === selectedPoId);
    if (!po) return;
    try {
      await api.createGoodsReceipt({
        purchaseOrderId: selectedPoId,
        supplierId: String(po.supplierId),
        packingSlipNumber: packingSlipNumber || undefined,
      });
      setIsCreating(false);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create Goods Receipt';
      alert(msg);
    }
  };

  const handleAddLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGr) return;
    const po = pos.find((p) => p.id === selectedGr.purchaseOrderId);
    const poLines = (po?.lines as Record<string, unknown>[]) ?? [];
    const poLine = poLines.find((l) => l.id === receivingPoLineId);
    if (!poLine) return;

    try {
      await api.addGrLine(String(selectedGr.id), {
        poLineId: receivingPoLineId,
        componentId: String(poLine.componentId),
        locationId: receivingLocationId,
        quantityReceived: parseInt(receivingQty, 10),
      });
      const updated = await api.getGoodsReceipt(String(selectedGr.id));
      setSelectedGr(updated);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add receipt line';
      alert(msg);
    }
  };

  const handlePostReceipt = async (grId: string) => {
    try {
      await api.postGoodsReceipt(grId);
      alert('Goods Receipt successfully posted! Stock balances updated in Inventory Ledger.');
      fetchData();
      if (selectedGr?.id === grId) {
        const updated = await api.getGoodsReceipt(grId);
        setSelectedGr(updated);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to post receipt';
      alert(msg);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Goods Receipts</h1>
          <p className="text-sm text-gray-500">Physical stock receiving against open Purchase Orders.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
        >
          {isCreating ? 'Cancel' : '+ Receive Stock'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateGr} className="p-4 border rounded bg-gray-50 space-y-4 max-w-xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">Start Goods Receipt</h2>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Open PO *</label>
            <select
              required
              value={selectedPoId}
              onChange={(e) => setSelectedPoId(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded bg-white"
            >
              <option value="">-- Select Issued PO --</option>
              {pos.map((p) => (
                <option key={String(p.id)} value={String(p.id)}>{String(p.poNumber)} ({String(p.status)})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Packing Slip #</label>
            <input
              type="text"
              value={packingSlipNumber}
              onChange={(e) => setPackingSlipNumber(e.target.value)}
              placeholder="PS-998811"
              className="w-full px-3 py-1.5 text-sm border rounded"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-semibold rounded">
            Create Receipt Session
          </button>
        </form>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <div className="border rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 uppercase text-gray-600 border-b">
                <tr>
                  <th className="p-3">GR Number</th>
                  <th className="p-3">Packing Slip</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Received At</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {receipts.map((g) => (
                  <tr
                    key={String(g.id)}
                    onClick={() => setSelectedGr(g)}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedGr?.id === g.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="p-3 font-mono font-bold text-gray-900">{String(g.grNumber)}</td>
                    <td className="p-3 font-mono text-gray-600">{String(g.packingSlipNumber || '—')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${g.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {String(g.status)}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{new Date(String(g.receivedAt)).toLocaleDateString()}</td>
                  </tr>
                ))}
                {receipts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No Goods Receipts recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-5">
          {selectedGr ? (
            <div className="border rounded p-4 space-y-4 bg-white">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="font-mono font-bold text-lg">{String(selectedGr.grNumber)}</h3>
                  <p className="text-xs text-gray-500">Packing Slip: {String(selectedGr.packingSlipNumber || 'N/A')}</p>
                </div>
                {selectedGr.status === 'DRAFT' && (
                  <button
                    onClick={() => handlePostReceipt(String(selectedGr.id))}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded shadow hover:bg-green-700"
                  >
                    Post to Inventory
                  </button>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-gray-600 mb-2">Received Lines</h4>
                <div className="space-y-2">
                  {((selectedGr.lines as Record<string, unknown>[]) ?? []).map((l) => {
                    const comp = components.find((c) => c.id === l.componentId);
                    const loc = locations.find((loc) => loc.id === l.locationId);
                    return (
                      <div key={String(l.id)} className="p-2 border rounded text-xs flex justify-between bg-gray-50">
                        <div>
                          <p className="font-bold">{String(comp?.sku ?? l.componentId)}</p>
                          <p className="text-gray-500">Location: {String(loc?.name ?? l.locationId)}</p>
                        </div>
                        <div className="text-right font-mono font-bold text-green-700">
                          +{String(l.quantityReceived)} pcs
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedGr.status === 'DRAFT' && (
                <form onSubmit={handleAddLine} className="border-t pt-3 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-gray-600">Receive Component Item</h4>
                  <div>
                    <label className="text-[10px] text-gray-500">PO Line Item</label>
                    <select
                      required
                      value={receivingPoLineId}
                      onChange={(e) => setReceivingPoLineId(e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded"
                    >
                      <option value="">-- Select Line --</option>
                      {((pos.find((p) => p.id === selectedGr.purchaseOrderId)?.lines as Record<string, unknown>[]) ?? []).map((l) => {
                        const comp = components.find((c) => c.id === l.componentId);
                        return (
                          <option key={String(l.id)} value={String(l.id)}>
                            {String(comp?.sku ?? l.componentId)} (Ordered: {String(l.quantityOrdered)}, Recv: {String(l.quantityReceived)})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500">Destination Physical Location</label>
                    <select
                      required
                      value={receivingLocationId}
                      onChange={(e) => setReceivingLocationId(e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded"
                    >
                      <option value="">-- Select Location --</option>
                      {locations.map((loc) => (
                        <option key={String(loc.id)} value={String(loc.id)}>{String(loc.code)} ({String(loc.name)})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500">Quantity Received</label>
                    <input
                      type="number"
                      required
                      value={receivingQty}
                      onChange={(e) => setReceivingQty(e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded"
                    />
                  </div>
                  <button type="submit" className="w-full py-1.5 bg-gray-900 text-white text-xs font-medium rounded">
                    + Add Item to Receipt
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-8 border border-dashed rounded text-center text-sm text-gray-400">
              Select a Goods Receipt to inspect lines or post to inventory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
