'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [backendUrl, setBackendUrl] = useState(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [pricingCatalog, setPricingCatalog] = useState<unknown[]>([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/assessments/demo`)
      .then((res) => {
        if (res.ok) setBackendStatus('connected');
        else setBackendStatus('disconnected');
      })
      .catch(() => setBackendStatus('disconnected'));

    fetch(`${backendUrl}/api/v1/pricing/catalog`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setPricingCatalog(data.data);
      })
      .catch(() => {});
  }, [backendUrl]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-3xl font-black text-slate-900">System Settings & Diagnostics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure backend endpoints, review verified AI engine calibration, and inspect SAP BTP pricing catalogs.
          </p>
        </div>

        {/* Backend Connectivity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Java 21 Spring Boot Backend Service</h2>
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  backendStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : backendStatus === 'disconnected'
                    ? 'bg-rose-500'
                    : 'bg-amber-400'
                }`}
              />
              <span className="capitalize">{backendStatus}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">REST API Base URL</label>
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="w-full text-xs font-mono border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400">
              Default: <code className="font-mono text-slate-600">http://localhost:8080</code> (Configured in NEXT_PUBLIC_API_BASE_URL)
            </p>
          </div>
        </div>

        {/* AI Foundation Model Specification */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">ValueLens AI Foundation Model Calibration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Model Identifier:</span>
              <p className="font-mono font-bold text-indigo-700">valuelens-decision-engine-v1</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Inference Mode:</span>
              <p className="font-mono font-bold text-slate-700">Autonomous Enterprise Engine</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Temperature & Top-P:</span>
              <p className="font-mono font-bold text-slate-700">0.20 (Conservative Advisory) / 0.70</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Advisory Safety Boundary:</span>
              <p className="font-bold text-emerald-600">Zero Mathematical Mutation Enforced</p>
            </div>
          </div>
        </div>

        {/* Pricing Catalog */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">SAP BTP Active Pricing Catalog</h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">SKU Code</th>
                  <th className="p-3">Service / Edition</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3">Billing Cycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="p-3 text-indigo-600">BTP-IS-STD</td>
                  <td className="p-3 font-sans">SAP Integration Suite Standard Edition</td>
                  <td className="p-3 text-right font-bold">$1,595.00</td>
                  <td className="p-3 font-sans">Monthly Per Tenant Unit</td>
                </tr>
                <tr>
                  <td className="p-3 text-indigo-600">BTP-IS-ENT</td>
                  <td className="p-3 font-sans">SAP Integration Suite Enterprise Edition</td>
                  <td className="p-3 text-right font-bold">$4,000.00</td>
                  <td className="p-3 font-sans">Monthly Per Tenant Unit</td>
                </tr>
                <tr>
                  <td className="p-3 text-indigo-600">BTP-IS-MSGPACK</td>
                  <td className="p-3 font-sans">Additional Message Pack (10k msgs)</td>
                  <td className="p-3 text-right font-bold">$40.00</td>
                  <td className="p-3 font-sans">Monthly Per Pack</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/dashboard/demo-assessment-1" className="text-xs font-bold text-indigo-600 hover:underline">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
