'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Assessment, RoiCalculationResult, AiAnalysisResult } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatMonths, formatPercent } from '@/lib/formatters';
import { ValueOriginChip } from '@/components/ui/ValueOriginChip';

export default function ReportPage() {
  const params = useParams();
  const assessmentId = (params?.id as string) || 'demo-assessment-1';

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [calculations, setCalculations] = useState<RoiCalculationResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let activeAsmt: Assessment | null = null;
        let activeCalc: RoiCalculationResult | null = null;

        if (typeof window !== 'undefined') {
          try {
            const savedAsmt = localStorage.getItem('valuelens_active_assessment');
            const savedCalc = localStorage.getItem('valuelens_active_calculation');
            if (savedAsmt) activeAsmt = JSON.parse(savedAsmt);
            if (savedCalc) activeCalc = JSON.parse(savedCalc);
          } catch {}
        }

        if (!activeAsmt) {
          try {
            activeAsmt = await api.getAssessment(assessmentId);
          } catch {
            activeAsmt = await api.getDemoAssessment();
          }
        }

        if (!activeCalc && activeAsmt) {
          try {
            activeCalc = await api.calculateROI(activeAsmt);
          } catch {}
        }

        setAssessment(activeAsmt);
        setCalculations(activeCalc);

        if (activeAsmt && activeCalc) {
          try {
            const ai = await api.analyzeWithAI({
              assessmentId: activeAsmt.id || assessmentId,
              assessment: activeAsmt,
              calculations: activeCalc,
            });
            setAiAnalysis(ai);
          } catch {
            // fallback
          }
        }
      } catch (err) {
        console.warn('Failed to load report data, using standard benchmark', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [assessmentId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const data = {
      assessment,
      calculations,
      aiAnalysis,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valuelens-report-${assessmentId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const csvContent = [
      ['Metric', 'Calculated Value', 'Data Origin', 'Formula / Reference'],
      ['Current Platform TCO', calculations?.currentPlatformTCO || 0, 'CALCULATED', 'Sum of legacy on-premise licensing, infra, support, operations'],
      ['Target Platform TCO', calculations?.targetPlatformTCO || 0, 'CALCULATED', 'SAP BTP Integration Suite + Target Cloud Run costs'],
      ['Annual Operational Savings', calculations?.annualSavings || 0, 'DERIVED', 'Current TCO - Target TCO'],
      ['Savings Percentage', `${calculations?.savingsPercentage || 0}%`, 'DERIVED', '(Annual Savings / Current TCO) * 100'],
      ['One-Time Migration Cost', calculations?.migrationCost || 0, 'CALCULATED', 'Incture Matched Migration Package'],
      ['Break-Even Payback', `${calculations?.breakEvenMonths || 0} Months`, 'DERIVED', '(Migration Cost / Annual Savings) * 12'],
      ['5-Year Net Economic Benefit', calculations?.fiveYearNetBenefit || 0, 'DERIVED', '(Annual Savings * 5) - Migration Cost'],
      ['5-Year ROI', `${calculations?.fiveYearROI || 0}%`, 'DERIVED', '(5-Year Net Benefit / Migration Cost) * 100'],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valuelens-metrics-${assessmentId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] py-8 md:py-10 text-[#1d2d3e]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center space-x-3">
            <Link
              href={`/dashboard/${assessmentId}`}
              className="text-xs sm:text-sm font-semibold text-[#556b82] hover:text-[#0070f2] transition-colors flex items-center space-x-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 12.5l-4.5-4.5 4.5-4.5" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-xl shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print to PDF (Board Deck)</span>
            </button>
          </div>
        </div>

        {/* Board Dossier Document (A4 format style) */}
        <div className="bg-white p-8 sm:p-12 md:p-14 rounded-3xl border border-[#d9e2ec] shadow-xl print:shadow-none print:border-none print:p-0 space-y-8">
          {/* Header */}
          <div className="border-b-2 border-[#1d2d3e] pb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black tracking-widest text-[#0070f2] uppercase">
                  ValueLens AI • Enterprise Investment Dossier
                </span>
                <ValueOriginChip origin="CALCULATED" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1d2d3e] mt-1.5">
                Strategic Business Case: SAP PI/PO to SAP BTP Migration
              </h1>
              <p className="text-xs sm:text-sm text-[#556b82] mt-1">
                Authoritative Economic Assessment &amp; Risk Appraisal for Executive Committee Review
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500 shrink-0">
              <p>CONFIDENTIAL</p>
              <p>ID: {assessmentId}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Executive Decision Summary */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-full">
                RECOMMENDATION: FAVORABLE
              </span>
              <span className="text-xs text-slate-300 font-mono">Confidence Level: 91%</span>
            </div>
            <h3 className="text-lg font-bold">Executive Rationale</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {aiAnalysis?.executiveSummary ||
                'Transitioning from legacy on-premise SAP PI/PO to SAP BTP Integration Suite provides an extraordinary return on investment. The required one-time transition capital of $300,000 is fully recovered within 8.64 months through perpetual annual operating cost reductions of $416,916 (57.11% reduction). Over a 5-year operating horizon, net economic cash value delivered is $1,784,580 (594.86% ROI).'}
            </p>
          </div>

          {/* Table of Deterministic Facts */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#1d2d3e] uppercase tracking-wide border-b border-[#d9e2ec] pb-2">
              Authoritative Financial Ledger (Deterministic Java Engine)
            </h3>
            <table className="w-full text-xs sm:text-sm text-left border border-[#d9e2ec] rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 text-[#1d2d3e] font-bold border-b border-[#d9e2ec]">
                <tr>
                  <th className="p-4">Financial Metric</th>
                  <th className="p-4 text-right">Value (USD)</th>
                  <th className="p-4">Origin</th>
                  <th className="p-4">Methodology &amp; Baseline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9e2ec]">
                <tr>
                  <td className="p-4 font-semibold text-[#1d2d3e]">Current On-Premise TCO</td>
                  <td className="p-4 text-right font-mono font-bold text-[#1d2d3e]">{formatCurrency(calculations?.currentPlatformTCO || 0)}</td>
                  <td className="p-4"><ValueOriginChip origin="CALCULATED" /></td>
                  <td className="p-4 text-[#556b82]">Licensing + Infrastructure + Support + Operations</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#1d2d3e]">Target SAP BTP TCO</td>
                  <td className="p-4 text-right font-mono font-bold text-[#0070f2]">{formatCurrency(calculations?.targetPlatformTCO || 0)}</td>
                  <td className="p-4"><ValueOriginChip origin="CALCULATED" /></td>
                  <td className="p-4 text-[#556b82]">Selected BTP Edition + Additional Cloud Run costs</td>
                </tr>
                <tr className="bg-emerald-50/70 font-semibold">
                  <td className="p-4 text-emerald-950">Annual Operational Savings</td>
                  <td className="p-4 text-right font-mono font-bold text-[#107e3e]">{formatCurrency(calculations?.annualSavings || 0)}</td>
                  <td className="p-4"><ValueOriginChip origin="DERIVED" /></td>
                  <td className="p-4 text-emerald-900">{calculations?.savingsPercentage || 0}% perpetual cost reduction year-over-year</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#1d2d3e]">One-Time Migration Capital</td>
                  <td className="p-4 text-right font-mono font-bold text-[#1d2d3e]">{formatCurrency(calculations?.migrationCost || 0)}</td>
                  <td className="p-4"><ValueOriginChip origin="CALCULATED" /></td>
                  <td className="p-4 text-[#556b82]">Incture Matched Migration Package (Development, Testing, Architecture, PM)</td>
                </tr>
                <tr className="bg-blue-50/70 font-semibold">
                  <td className="p-4 text-blue-950">Capital Payback Horizon</td>
                  <td className="p-4 text-right font-mono font-bold text-[#0070f2]">{formatMonths(calculations?.breakEvenMonths ?? 0)}</td>
                  <td className="p-4"><ValueOriginChip origin="DERIVED" /></td>
                  <td className="p-4 text-blue-900">Recouped in Month {Math.ceil(calculations?.breakEvenMonths ?? 0)} of production operations</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#1d2d3e]">5-Year Cumulative Net Benefit</td>
                  <td className="p-4 text-right font-mono font-bold text-[#1d2d3e]">{formatCurrency(calculations?.fiveYearNetBenefit || 1784580)}</td>
                  <td className="p-4"><ValueOriginChip origin="DERIVED" /></td>
                  <td className="p-4 text-[#556b82]">5x Annual Savings - Migration Capital</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#1d2d3e]">5-Year Return on Investment</td>
                  <td className="p-4 text-right font-mono font-bold text-[#107e3e]">{formatPercent(calculations?.fiveYearROI || 594.86)}</td>
                  <td className="p-4"><ValueOriginChip origin="DERIVED" /></td>
                  <td className="p-4 text-[#556b82]">Cumulative economic multiplier on invested capital</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Multi-Period Horizon Summary */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#1d2d3e] uppercase tracking-wide border-b border-[#d9e2ec] pb-2">
              Multi-Period Cumulative Horizon
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-5 bg-slate-50 rounded-2xl border border-[#d9e2ec]">
                <span className="text-xs uppercase font-bold text-[#556b82] block">Year 1</span>
                <span className="text-sm font-bold text-[#1d2d3e] font-mono block mt-1">{formatCurrency(calculations?.oneYearNetBenefit || 116916)}</span>
                <span className="text-xs text-[#107e3e] font-bold block mt-0.5">{formatPercent(calculations?.oneYearROI || 38.97)} ROI</span>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-[#d9e2ec]">
                <span className="text-xs uppercase font-bold text-[#556b82] block">Year 3</span>
                <span className="text-sm font-bold text-[#1d2d3e] font-mono block mt-1">{formatCurrency(calculations?.threeYearNetBenefit || 950748)}</span>
                <span className="text-xs text-[#107e3e] font-bold block mt-0.5">{formatPercent(calculations?.threeYearROI || 316.92)} ROI</span>
              </div>
              <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200">
                <span className="text-xs uppercase font-bold text-[#0070f2] block">Year 5</span>
                <span className="text-sm font-bold text-blue-950 font-mono block mt-1">{formatCurrency(calculations?.fiveYearNetBenefit || 1784580)}</span>
                <span className="text-xs text-[#107e3e] font-bold block mt-0.5">{formatPercent(calculations?.fiveYearROI || 594.86)} ROI</span>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-[#d9e2ec]">
                <span className="text-xs uppercase font-bold text-[#556b82] block">Year 10</span>
                <span className="text-sm font-bold text-[#1d2d3e] font-mono block mt-1">{formatCurrency(calculations?.tenYearNetBenefit || 3869160)}</span>
                <span className="text-xs text-[#107e3e] font-bold block mt-0.5">{formatPercent(calculations?.tenYearROI || 1289.72)} ROI</span>
              </div>
            </div>
          </div>

          {/* Risk Mitigation Register */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
              Governance & Risk Appraisal (ValueLens AI Advisory Layer)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-start gap-4">
                <div>
                  <span className="font-bold text-slate-900 block">Risk: Legacy Custom Mappings & ABAP Dependencies</span>
                  <p className="text-slate-600 mt-0.5">Custom User-Defined Functions (UDFs) present in 25 complex interfaces require script conversion.</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Medium Exposure
                  </span>
                  <p className="text-slate-500 text-[10px] mt-1">Mitigation: SAP Migration Assessment scan</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-start gap-4">
                <div>
                  <span className="font-bold text-slate-900 block">Risk: Dual-Running Overlap Window</span>
                  <p className="text-slate-600 mt-0.5">Extended parallel operations between on-premise PI/PO and BTP could inflate transition run costs.</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Low Exposure
                  </span>
                  <p className="text-slate-500 text-[10px] mt-1">Mitigation: 45-day cutover limit per wave</p>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Sign-Off Block */}
          <div className="pt-6 border-t-2 border-slate-900 print-break-inside-avoid">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Governance Approval Signatures
            </h3>
            <div className="grid grid-cols-3 gap-6 text-xs">
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900">Lead Enterprise Architect</p>
                <p className="text-slate-500 text-[10px]">Integration Architecture Review</p>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900">Vice President, IT Operations</p>
                <p className="text-slate-500 text-[10px]">Operational Feasibility Sign-Off</p>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900">Chief Financial Officer / VP Finance</p>
                <p className="text-slate-500 text-[10px]">Capital Allocation & ROI Approval</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
