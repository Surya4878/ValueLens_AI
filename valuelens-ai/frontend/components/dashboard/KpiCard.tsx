'use client';

import React, { useState } from 'react';
import { ValueOrigin, CalculationTrace } from '@/types';
import { ValueOriginChip } from '@/components/ui/ValueOriginChip';
import { CalculationTraceModal } from '@/components/dashboard/CalculationTraceModal';

interface KpiCardProps {
  label: string;
  value: string;
  subValue?: string;
  origin?: ValueOrigin;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  traceKey?: string;
  trace?: CalculationTrace;
  badge?: string;
  highlight?: boolean;
}

export function KpiCard({
  label,
  value,
  subValue,
  origin = 'CALCULATED',
  trend,
  icon,
  traceKey,
  trace,
  badge,
  highlight = false,
}: KpiCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 group ${
          highlight
            ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-700 shadow-xl shadow-indigo-900/20'
            : 'bg-white text-slate-900 border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300'
        }`}
      >
        {/* Top row: Label, Origin chip, Trace button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-col">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                highlight ? 'text-indigo-200' : 'text-slate-500'
              }`}
            >
              {label}
            </span>
            {badge && (
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                {badge}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            <ValueOriginChip
              origin={origin}
              className={highlight ? 'bg-indigo-950/80 text-indigo-200 border-indigo-700/60' : ''}
            />
            {trace && (
              <button
                onClick={() => setModalOpen(true)}
                title="View deterministic arithmetic trace"
                className={`p-1 rounded-md transition-colors ${
                  highlight
                    ? 'text-indigo-300 hover:text-white hover:bg-indigo-800'
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Value Display */}
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <div
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${
                highlight ? 'text-white' : 'text-slate-900'
              }`}
            >
              {value}
            </div>
            {subValue && (
              <p
                className={`text-xs font-medium ${
                  highlight ? 'text-indigo-200/90' : 'text-slate-500'
                }`}
              >
                {subValue}
              </p>
            )}
          </div>

          {icon && (
            <div
              className={`p-3 rounded-xl ${
                highlight
                  ? 'bg-indigo-800/60 text-indigo-200'
                  : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Trend Footer */}
        {trend && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div
              className={`flex items-center space-x-1 font-semibold ${
                trend.isPositive
                  ? highlight
                    ? 'text-emerald-400'
                    : 'text-emerald-600'
                  : highlight
                  ? 'text-rose-400'
                  : 'text-rose-600'
              }`}
            >
              {trend.direction === 'up' && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {trend.direction === 'down' && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{trend.label}</span>
            </div>

            {trace && (
              <button
                onClick={() => setModalOpen(true)}
                className={`text-[11px] underline underline-offset-2 ${
                  highlight ? 'text-indigo-300 hover:text-white' : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                Inspect Formula
              </button>
            )}
          </div>
        )}
      </div>

      {/* Trace Modal */}
      {trace && (
        <CalculationTraceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          metricKey={traceKey || label}
          metricLabel={label}
          metricValue={value}
          trace={trace}
        />
      )}
    </>
  );
}
