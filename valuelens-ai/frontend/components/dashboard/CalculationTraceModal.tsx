'use client';

import React from 'react';
import { CalculationTrace } from '@/types';

interface CalculationTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricKey: string;
  trace?: CalculationTrace;
  metricLabel?: string;
  metricValue?: string;
}

export function CalculationTraceModal({
  isOpen,
  onClose,
  metricKey,
  trace,
  metricLabel,
  metricValue,
}: CalculationTraceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-semibold tracking-wide">
              Deterministic Calculation Trace
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metric Overview */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Metric</p>
              <h4 className="text-lg font-bold text-slate-900">{metricLabel || metricKey}</h4>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Calculated Value</p>
              <p className="text-xl font-extrabold text-indigo-600 font-mono">{metricValue || 'Calculated'}</p>
            </div>
          </div>

          {/* Formula */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Deterministic Financial Formula</span>
            </h5>
            <div className="p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono text-sm overflow-x-auto border border-slate-800 shadow-inner">
              <code>{trace?.formula || 'Authoritative backend arithmetic calculation'}</code>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Formula Input Arguments (Exact Backend Values)
            </h5>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 max-h-48 overflow-y-auto">
              {trace?.inputs && Object.keys(trace.inputs).length > 0 ? (
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(trace.inputs).map(([k, v]) => (
                    <div key={k} className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                      <dt className="text-slate-600 font-medium truncate pr-2">{k}:</dt>
                      <dd className="font-mono font-semibold text-slate-900 truncate">
                        {typeof v === 'number' ? v.toLocaleString('en-US') : String(v)}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-xs text-slate-500 italic">No parameter inputs recorded for this metric trace.</p>
              )}
            </div>
          </div>

          {/* Explanation */}
          {trace?.explanation && (
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900">
              <p className="font-semibold mb-1">Financial Methodology:</p>
              <p className="leading-relaxed">{trace.explanation}</p>
            </div>
          )}

          {/* Guarantee Banner */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>
              <strong>Zero LLM Hallucination Guarantee:</strong> Computed in Java 21 LTS with pure <code className="font-mono text-slate-700">BigDecimal</code> rounding logic. AI models are strictly forbidden from modifying financial results.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
}
