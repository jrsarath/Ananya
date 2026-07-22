'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../src/lib/api';

export default function PurchaseInvoicesPage() {
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([]);
  const [suppliers, setSuppliers] = useState<Record<string, unknown>[]>([]);
  const [pos, setPos] = useState<Record<string, unknown>[]>([]);
  const [components, setComponents] = useState<Record<string, unknown>[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [vendorInvoiceNumber, setVendorInvoiceNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [purchaseOrderId, setPurchaseOrderId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Record<string, unknown> | null>(null);

  // Invoice line
  const [componentId, setComponentId] = useState('');
  const [quantityBilled, setQuantityBilled] = useState('1');
  const [unitPrice, setUnitPrice] = useState('0.00');

  const fetchData = useCallback(async () => {
    try {
      const [invData, supData, poData, compData] = await Promise.all([
        api.getPurchaseInvoices(),
        api.getSuppliers(),
        api.getPurchaseOrders(),
        api.getComponents(),
      ]);
      setInvoices(invData);
      setSuppliers(supData);
      setPos(poData);
      setComponents(compData as unknown as Record<string, unknown>[]);
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
      await api.createPurchaseInvoice({
        vendorInvoiceNumber,
        supplierId,
        purchaseOrderId,
        dueDate: dueDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      });
      setIsCreating(false);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create purchase invoice';
      alert(msg);
    }
  };

  const handleAddLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      await api.addInvoiceLine(String(selectedInvoice.id), {
        componentId,
        quantityBilled: parseInt(quantityBilled, 10),
        unitPrice: parseFloat(unitPrice),
      });
      const updated = await api.getPurchaseInvoice(String(selectedInvoice.id));
      setSelectedInvoice(updated);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add line';
      alert(msg);
    }
  };

  const handleMatch = async (invoiceId: string) => {
    try {
      const res = await api.matchInvoice(invoiceId);
      if (res.matchResult.isMatch) {
        alert('3-Way Match Passed! PO Price & Received Quantity match perfectly.');
      } else {
        alert(`3-Way Match Failed! Variance: ${res.matchResult.details.join('\n')}`);
      }
      fetchData();
      if (selectedInvoice?.id === invoiceId) {
        const updated = await api.getPurchaseInvoice(invoiceId);
        setSelectedInvoice(updated);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Matching error';
      alert(msg);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Purchase Invoices</h1>
          <p className="text-sm text-gray-500">Vendor bill processing, 3-Way Matching engine, and Accounts Payable approval.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
        >
          {isCreating ? 'Cancel' : '+ Register Vendor Invoice'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 border rounded bg-gray-50 space-y-4 max-w-xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">New Vendor Invoice</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Bill / Invoice # *</label>
              <input
                type="text"
                required
                value={vendorInvoiceNumber}
                onChange={(e) => setVendorInvoiceNumber(e.target.value)}
                placeholder="INV-99228"
                className="w-full px-3 py-1.5 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Supplier *</label>
              <select
                required
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded bg-white"
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={String(s.id)} value={String(s.id)}>{String(s.code)} ({String(s.name)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Matching Purchase Order *</label>
              <select
                required
                value={purchaseOrderId}
                onChange={(e) => setPurchaseOrderId(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded bg-white"
              >
                <option value="">-- Select PO --</option>
                {pos.map((p) => (
                  <option key={String(p.id)} value={String(p.id)}>{String(p.poNumber)}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-semibold rounded">
            Save Invoice
          </button>
        </form>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <div className="border rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 uppercase text-gray-600 border-b">
                <tr>
                  <th className="p-3">Internal #</th>
                  <th className="p-3">Vendor Bill #</th>
                  <th className="p-3">Match Status</th>
                  <th className="p-3">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((inv) => (
                  <tr
                    key={String(inv.id)}
                    onClick={() => setSelectedInvoice(inv)}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedInvoice?.id === inv.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="p-3 font-mono font-bold text-gray-900">{String(inv.invoiceNumber)}</td>
                    <td className="p-3 font-mono text-gray-600">{String(inv.vendorInvoiceNumber)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        inv.matchStatus === 'MATCHED'
                          ? 'bg-green-100 text-green-800'
                          : inv.matchStatus === 'PRICE_VARIANCE' || inv.matchStatus === 'QUANTITY_VARIANCE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {String(inv.matchStatus)}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold">${Number(inv.totalAmount).toFixed(2)}</td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No Purchase Invoices.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-5">
          {selectedInvoice ? (
            <div className="border rounded p-4 space-y-4 bg-white">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="font-mono font-bold text-lg">{String(selectedInvoice.invoiceNumber)}</h3>
                  <p className="text-xs text-gray-500">Vendor Bill: {String(selectedInvoice.vendorInvoiceNumber)}</p>
                </div>
                <div className="space-x-1">
                  <button
                    onClick={() => handleMatch(String(selectedInvoice.id))}
                    className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded"
                  >
                    Run 3-Way Match
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-gray-600 mb-2">Billed Lines</h4>
                <div className="space-y-2">
                  {((selectedInvoice.lines as Record<string, unknown>[]) ?? []).map((l) => {
                    const comp = components.find((c) => c.id === l.componentId);
                    return (
                      <div key={String(l.id)} className="p-2 border rounded text-xs flex justify-between bg-gray-50">
                        <div>
                          <p className="font-bold">{String(comp?.sku ?? l.componentId)}</p>
                        </div>
                        <div className="text-right font-mono">
                          {String(l.quantityBilled)} pcs @ ${String(l.unitPrice)} = ${Number(l.lineTotal).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedInvoice.status === 'DRAFT' && (
                <form onSubmit={handleAddLine} className="border-t pt-3 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-gray-600">Add Billed Line</h4>
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
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Billed Qty"
                      required
                      value={quantityBilled}
                      onChange={(e) => setQuantityBilled(e.target.value)}
                      className="px-2 py-1 text-xs border rounded"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Billed Unit Price"
                      required
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      className="px-2 py-1 text-xs border rounded"
                    />
                  </div>
                  <button type="submit" className="w-full py-1.5 bg-gray-900 text-white text-xs font-medium rounded">
                    + Add Line to Invoice
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-8 border border-dashed rounded text-center text-sm text-gray-400">
              Select a Purchase Invoice to run 3-Way Matching or add billed lines.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
