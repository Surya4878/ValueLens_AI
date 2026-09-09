'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ValueOriginChip } from '@/components/ui/ValueOriginChip';
import { formatCurrency, formatPercent } from '@/lib/formatters';

interface CostDriverChartProps {
  licensing?: number;
  infrastructure?: number;
  support?: number;
  operations?: number;
  currency?: string;
}

export function CostDriverChart({
  licensing = 290000,
  infrastructure = 100000,
  support = 220000,
  operations = 120000,
  currency = 'USD',
}: CostDriverChartProps) {
  const [showInsight, setShowInsight] = useState(false);

  const total = licensing + infrastructure + support + operations;

  const data = [
    { name: 'Licensing & Subscriptions', value: licensing, color: '#4f46e5', pct: total ? (licensing / total) * 100 : 0 },
    { name: 'Support & Maintenance', value: support, color: '#f59e0b', pct: total ? (support / total) * 100 : 0 },
    { name: 'Operations & Staff', value: operations, color: '#06b6d4', pct: total ? (operations / total) * 100 : 0 },
    { name: 'Hardware & Infrastructure', value: infrastructure, color: '#64748b', pct: total ? (infrastructure / total) * 100 : 0 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">Current TCO Cost Drivers</h3>
            <ValueOriginChip origin="CALCULATED" />
          </div>
          <button
            onClick={() => setShowInsight(!showInsight)}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{showInsight ? 'Hide Driver Insight' : 'Driver Insight'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-2">
          Distribution of the ${Math.round(total).toLocaleString()} annual spend across 4 core operational pillars.
        </p>
      </div>

      {/* Donut Chart & Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-2">
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [formatCurrency(val, currency), 'Cost']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 truncate pr-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 truncate">{item.name}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-semibold text-slate-900 font-mono mr-1">
                  {formatPercent(item.pct)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      {showInsight && (
        <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
          <div className="flex items-center justify-between font-bold">
            <span>Primary Cost Concentration</span>
            <span className="text-[10px] text-indigo-700 font-mono">ValueLens AI advisory</span>
          </div>
          <p className="leading-relaxed">
            <strong>Licensing & Support</strong> represent <strong>69.9% ($510,000)</strong> of your total on-premise
            outlay. Migrating to BTP converts fragmented perpetual licensing and third-party maintenance contracts into a
            predictable, consolidated cloud consumption model.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">Largest Cost Pillar:</span>
        <span className="font-bold text-slate-800">
          Licensing ({data[0].pct.toFixed(1)}% of TCO)
        </span>
      </div>
    </div>
  );
}
