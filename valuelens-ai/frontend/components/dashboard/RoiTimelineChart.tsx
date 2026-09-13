'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCompactCurrency, formatCurrency, formatPercent } from '@/lib/formatters';

interface RoiTimelineChartProps {
  oneYearNetBenefit?: number;
  threeYearNetBenefit?: number;
  fiveYearNetBenefit?: number;
  tenYearNetBenefit?: number;
  oneYearRoi?: number;
  threeYearRoi?: number;
  fiveYearRoi?: number;
  tenYearRoi?: number;
  breakEvenMonths?: number | null;
  currency?: string;
}

export function RoiTimelineChart({
  oneYearNetBenefit = 116916,
  threeYearNetBenefit = 950748,
  fiveYearNetBenefit = 1784580,
  tenYearNetBenefit = 3869160,
  oneYearRoi = 38.97,
  threeYearRoi = 316.92,
  fiveYearRoi = 594.86,
  tenYearRoi = 1289.72,
  breakEvenMonths = 8.64,
  currency = 'USD',
}: RoiTimelineChartProps) {
  const [metricView, setMetricView] = useState<'benefit' | 'roi'>('benefit');

  const data = [
    {
      period: 'Year 1',
      netBenefit: oneYearNetBenefit,
      roi: oneYearRoi,
    },
    {
      period: 'Year 3',
      netBenefit: threeYearNetBenefit,
      roi: threeYearRoi,
    },
    {
      period: 'Year 5',
      netBenefit: fiveYearNetBenefit,
      roi: fiveYearRoi,
    },
    {
      period: 'Year 10',
      netBenefit: tenYearNetBenefit,
      roi: tenYearRoi,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
      {/* Header with View Toggle */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">Multi-Year Economic Horizon</h3>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setMetricView('benefit')}
              className={`px-3 py-1 rounded-md transition-all ${
                metricView === 'benefit'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative Net Benefit ($)
            </button>
            <button
              onClick={() => setMetricView('roi')}
              className={`px-3 py-1 rounded-md transition-all ${
                metricView === 'roi'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ROI Growth (%)
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>
            {metricView === 'benefit'
              ? 'Net cumulative cash savings after recouping $300,000 migration capital.'
              : 'Return on Investment percentage over 1, 3, 5, and 10 year operational horizons.'}
          </span>
          <span className="inline-flex items-center space-x-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
            <span>Break-Even: {breakEvenMonths?.toFixed(1) || '8.6'} Mo</span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="benefitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v) =>
                metricView === 'benefit' ? formatCompactCurrency(v, currency) : `${v}%`
              }
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(val: number) => [
                metricView === 'benefit' ? formatCurrency(val, currency) : formatPercent(val),
                metricView === 'benefit' ? 'Cumulative Net Benefit' : 'ROI',
              ]}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                border: 'none',
              }}
            />
            {metricView === 'benefit' ? (
              <Area
                type="monotone"
                dataKey="netBenefit"
                stroke="#059669"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#benefitGrad)"
              />
            ) : (
              <Area
                type="monotone"
                dataKey="roi"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#roiGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Grid of milestone metrics */}
      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center">
        {data.map((item, idx) => (
          <div key={idx} className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">{item.period}</span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono block">
              {metricView === 'benefit' ? formatCompactCurrency(item.netBenefit, currency) : `${item.roi.toFixed(0)}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
