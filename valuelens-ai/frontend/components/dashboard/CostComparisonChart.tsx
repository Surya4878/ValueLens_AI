'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ValueOriginChip } from '@/components/ui/ValueOriginChip';
import { formatCompactCurrency, formatCurrency } from '@/lib/formatters';

interface CostComparisonChartProps {
  currentTco: number;
  targetTco: number;
  annualSavings: number;
  currency?: string;
  onAskAi?: (chartId: string, data: unknown) => void;
}

export function CostComparisonChart({
  currentTco = 730000,
  targetTco = 313084,
  annualSavings = 416916,
  currency = 'USD',
  onAskAi,
}: CostComparisonChartProps) {
  const [showInsight, setShowInsight] = useState(false);

  const data = [
    { name: 'Current TCO', amount: currentTco, color: '#64748b' },
    { name: 'BTP Target TCO', amount: targetTco, color: '#4f46e5' },
    { name: 'Annual Savings', amount: annualSavings, color: '#10b981' },
  ];

  const savingsPct = currentTco > 0 ? ((annualSavings / currentTco) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">Annual Run-Rate Comparison</h3>
            <ValueOriginChip origin="CALCULATED" />
          </div>
          <button
            onClick={() => setShowInsight(!showInsight)}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{showInsight ? 'Hide AI Finding' : 'AI Finding'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Direct annual cost comparison between legacy on-premise footprint and SAP BTP Integration Suite.
        </p>
      </div>

      {/* Chart */}
      <div className="h-64 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v) => formatCompactCurrency(v, currency)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(val: number) => [formatCurrency(val, currency), 'Annual Cost']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                border: 'none',
              }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Drawer / Callout */}
      {showInsight && (
        <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
          <div className="flex items-center justify-between font-bold">
            <span>AI Economic Insight</span>
            <span className="text-[10px] text-indigo-700 font-mono">ValueLens AI advisory</span>
          </div>
          <p className="leading-relaxed">
            Transitioning to SAP BTP Integration Suite reduces annual integration expenditures by{' '}
            <strong>{savingsPct}% (${Math.round(annualSavings).toLocaleString()}/year)</strong>. The majority of savings
            stems from decommissioning legacy server infrastructure, hypervisor maintenance, and high legacy licensing
            uplifts.
          </p>
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">Target Platform TCO Savings:</span>
        <span className="font-bold text-emerald-600 font-mono">
          -{savingsPct}% ({formatCurrency(annualSavings, currency)}/yr)
        </span>
      </div>
    </div>
  );
}
