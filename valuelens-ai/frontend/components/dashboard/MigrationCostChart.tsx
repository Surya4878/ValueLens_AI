'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ValueOriginChip } from '@/components/ui/ValueOriginChip';
import { formatCompactCurrency, formatCurrency } from '@/lib/formatters';

interface MigrationCostChartProps {
  totalCost?: number;
  developmentCost?: number;
  testingCost?: number;
  architectureCost?: number;
  pmCost?: number;
  trainingCost?: number;
  deploymentCost?: number;
  documentationCost?: number;
  contingencyCost?: number;
  currency?: string;
}

export function MigrationCostChart({
  totalCost = 300000,
  developmentCost = 140000,
  testingCost = 45000,
  architectureCost = 30000,
  pmCost = 25000,
  trainingCost = 20000,
  deploymentCost = 15000,
  documentationCost = 10000,
  contingencyCost = 15000,
  currency = 'USD',
}: MigrationCostChartProps) {
  const data = [
    { name: 'Dev / Refactor', cost: developmentCost },
    { name: 'Testing & QA', cost: testingCost },
    { name: 'Architecture', cost: architectureCost },
    { name: 'Project Mgmt', cost: pmCost },
    { name: 'Staff Training', cost: trainingCost },
    { name: 'Cutover & Deploy', cost: deploymentCost },
    { name: 'Contingency', cost: contingencyCost },
    { name: 'Documentation', cost: documentationCost },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">One-Time Migration Investment</h3>
            <ValueOriginChip origin="CALCULATED" />
          </div>
          <span className="text-sm font-extrabold text-indigo-600 font-mono">
            Total: {formatCurrency(totalCost, currency)}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Detailed breakdown of transition capital required across delivery workstreams.
        </p>
      </div>

      {/* Chart */}
      <div className="h-64 w-full my-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v) => formatCompactCurrency(v, currency)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={{ stroke: '#cbd5e1' }}
              width={95}
            />
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
            <Bar dataKey="cost" fill="#6366f1" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">Contingency Allocation:</span>
        <span className="font-semibold text-slate-800 font-mono">
          {formatCurrency(contingencyCost, currency)} ({((contingencyCost / totalCost) * 100).toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}
