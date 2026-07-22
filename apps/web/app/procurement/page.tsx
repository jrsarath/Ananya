'use client';

import { useState, useEffect } from 'react';
import { api } from '../../src/lib/api';

export default function ProcurementDashboardPage() {
  const [metrics, setMetrics] = useState<Record<string, unknown> | null>(null);
  const [openPos, setOpenPos] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, aging] = await Promise.all([
          api.getProcurementMetrics(),
          api.getOpenPoAging(),
        ]);
        setMetrics(m);
        setOpenPos(aging);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold tracking-tight">Procurement Operations</h1>
        <p className="text-sm text-gray-500">Purchasing KPIs, vendor commitment exposure, and open order aging.</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading procurement metrics...</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 border rounded bg-white shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{String(metrics?.activeSuppliersCount ?? 0)}</p>
            </div>
            <div className="p-4 border rounded bg-white shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase">Total Purchase Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{String(metrics?.totalPurchaseOrdersCount ?? 0)}</p>
            </div>
            <div className="p-4 border rounded bg-white shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase">Completed Receipts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{String(metrics?.completedGoodsReceiptsCount ?? 0)}</p>
            </div>
            <div className="p-4 border rounded bg-white shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase">Fulfilled Purchasing Spend</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${Number(metrics?.totalFulfilledSpend ?? 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Open Purchase Order Aging</h2>
            <div className="border rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 uppercase text-gray-600 border-b">
                  <tr>
                    <th className="p-3">PO Number</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total Value</th>
                    <th className="p-3">Issued / Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {openPos.map((po) => (
                    <tr key={String(po.id)} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-900">{String(po.poNumber)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                          {String(po.status)}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold">${Number(po.grandTotal).toFixed(2)}</td>
                      <td className="p-3 text-gray-500">{new Date(String(po.createdAt)).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {openPos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500">No open Purchase Orders pending receipt.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
