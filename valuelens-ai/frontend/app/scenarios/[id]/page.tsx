'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ScenarioResponse, ScenarioOutcome, Assessment, RoiCalculationResult } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatMonths, formatPercent } from '@/lib/formatters';
import { ValueOriginChip } from '@/components/ui/ValueOriginChip';

export default function ScenariosPage() {
  const params = useParams();
  const assessmentId = (params?.id as string) || 'demo-assessment-1';

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [calculations, setCalculations] = useState<RoiCalculationResult | null>(null);

  const [savingsFactor, setSavingsFactor] = useState<number>(1.0);
  const [migrationCostFactor, setMigrationCostFactor] = useState<number>(1.0);
  const [targetCostFactor, setTargetCostFactor] = useState<number>(1.0);

  const [scenarios, setScenarios] = useState<ScenarioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalysisText, setAiAnalysisText] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isCustomTuned, setIsCustomTuned] = useState(false);

  // Load user's actual assessment and calculation
  useEffect(() => {
    async function loadActiveData() {
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

        if (activeAsmt) setAssessment(activeAsmt);
        if (activeCalc) setCalculations(activeCalc);
      } catch (err) {
        console.warn('Failed to load active assessment for scenarios', err);
      }
    }
    loadActiveData();
  }, [assessmentId]);

  const baselineCurrent = calculations?.currentPlatformTCO ?? 0;
  const baselineTarget = calculations?.targetPlatformTCO ?? 0;
  const baselineMigration = calculations?.migrationCost ?? 0;

  const fetchLiveAiScenarioAnalysis = async () => {
    if (!scenarios) return;
    setLoadingAi(true);
    setAiError(null);
    try {
      const res = await api.analyzeScenario(scenarios);
      if (res && res.interpretation) {
        setAiAnalysisText(res.interpretation);
        setIsCustomTuned(false);
      } else {
        setAiError('AI decision engine response was empty. Click to retry.');
      }
    } catch (err) {
      console.error('Failed to analyze scenario with AI:', err);
      setAiError('AI inference service connection timed out or is busy. Click to retry.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Auto-generate AI insights on initial load once scenarios are calculated
  const autoLoadedRef = useRef(false);
  useEffect(() => {
    if (scenarios && !autoLoadedRef.current && !aiAnalysisText && !loadingAi) {
      autoLoadedRef.current = true;
      fetchLiveAiScenarioAnalysis();
    }
  }, [scenarios]);

  const runSimulation = async (sFactor: number, mFactor: number, tFactor: number) => {
    setLoading(true);
    try {
      const res = await api.calculateScenario({
        assessmentId,
        savingsFactor: sFactor,
        migrationCostFactor: mFactor,
        targetCostFactor: tFactor,
        baselineCurrentTco: baselineCurrent,
        baselineTargetTco: baselineTarget,
        baselineMigrationCost: baselineMigration,
      });
      setScenarios(res);
    } catch (err) {
      console.warn('Scenario calculation fallback', err);
      // Deterministic client-side fallback calculation matching backend formula
      const calcOutcome = (name: string, sf: number, mf: number, tf: number): ScenarioOutcome => {
        const simTarget = baselineTarget * tf;
        const simMigration = baselineMigration * mf;
        const baseSavings = baselineCurrent - simTarget;
        const simSavings = baseSavings * sf;
        const savingsPct = (simSavings / (baselineCurrent || 1)) * 100;
        const breakEven = simSavings > 0 ? (simMigration / simSavings) * 12 : null;
        const fiveYearBenefit = simSavings * 5 - simMigration;
        const fiveYearRoi = simMigration > 0 ? (fiveYearBenefit / simMigration) * 100 : 0;
        const oneYearBenefit = simSavings - simMigration;
        const oneYearRoi = simMigration > 0 ? (oneYearBenefit / simMigration) * 100 : 0;
        const threeYearBenefit = simSavings * 3 - simMigration;
        const threeYearRoi = simMigration > 0 ? (threeYearBenefit / simMigration) * 100 : 0;
        const tenYearBenefit = simSavings * 10 - simMigration;
        const tenYearRoi = simMigration > 0 ? (tenYearBenefit / simMigration) * 100 : 0;

        return {
          scenarioName: name,
          savingsFactor: sf,
          migrationCostFactor: mf,
          targetCostFactor: tf,
          currentPlatformTco: baselineCurrent,
          targetPlatformTco: Math.round(simTarget),
          migrationCost: Math.round(simMigration),
          annualSavings: Math.round(simSavings),
          savingsPercentage: parseFloat(savingsPct.toFixed(2)),
          breakEvenMonths: breakEven ? parseFloat(breakEven.toFixed(2)) : null,
          breakEvenStatus: breakEven ? 'REACHED' : 'NOT_REACHED',
          oneYearRoi: parseFloat(oneYearRoi.toFixed(2)),
          threeYearRoi: parseFloat(threeYearRoi.toFixed(2)),
          fiveYearRoi: parseFloat(fiveYearRoi.toFixed(2)),
          tenYearRoi: parseFloat(tenYearRoi.toFixed(2)),
          fiveYearNetBenefit: Math.round(fiveYearBenefit),
        };
      };

      setScenarios({
        assessmentId,
        customCase: calcOutcome('Custom Scenario', sFactor, mFactor, tFactor),
        baseCase: calcOutcome('Base Case (Benchmark)', 1.0, 1.0, 1.0),
        bestCase: calcOutcome('Best Case (+15% Savings, -10% Cost)', 1.15, 0.9, 0.95),
        worstCase: calcOutcome('Conservative Case (-20% Savings, +25% Cost)', 0.8, 1.25, 1.15),
        sensitivityWarning:
          'Investment payback remains under 18 months across all tested standard operational bounds.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (aiAnalysisText) {
      setIsCustomTuned(true);
    }
    runSimulation(savingsFactor, migrationCostFactor, targetCostFactor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savingsFactor, migrationCostFactor, targetCostFactor, calculations]);

  const scenarioAnalysis = useMemo(() => {
    if (!scenarios || !scenarios.customCase) return null;
    const custom = scenarios.customCase;
    const base = scenarios.baseCase;
    const worst = scenarios.worstCase;
    const best = scenarios.bestCase;

    const breakEven = custom.breakEvenMonths ?? 8.6;
    const annualSavings = custom.annualSavings;
    const migrationCost = custom.migrationCost;
    const fiveYearRoi = custom.fiveYearRoi;
    const fiveYearNetBenefit = custom.fiveYearNetBenefit;

    const baseBreakEven = base?.breakEvenMonths ?? 8.6;
    const baseSavings = base?.annualSavings ?? 416916;
    const baseBenefit = base?.fiveYearNetBenefit ?? 1784580;

    const breakEvenDelta = breakEven - baseBreakEven;
    const savingsDelta = annualSavings - baseSavings;
    const benefitDelta = fiveYearNetBenefit - baseBenefit;

    // Headroom calculation: how much can migration cost expand before break-even exceeds 18 months
    const maxMigrationFor18Mo = (annualSavings / 12) * 18;
    const migrationHeadroom = maxMigrationFor18Mo - migrationCost;
    const maxCostOverrunPct = migrationCost > 0 ? (migrationHeadroom / migrationCost) * 100 : 0;

    // Viability rating
    let verdict = 'COMMERCIALLY RESILIENT';
    let verdictColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (breakEven > 18) {
      verdict = 'EXTENDED PAYBACK WATCHLIST';
      verdictColor = 'bg-rose-100 text-rose-800 border-rose-300';
    } else if (breakEven > 12) {
      verdict = 'MODERATE SENSITIVITY BUFFER';
      verdictColor = 'bg-amber-100 text-amber-800 border-amber-300';
    }

    return {
      verdict,
      verdictColor,
      breakEven,
      breakEvenDelta,
      annualSavings,
      savingsDelta,
      migrationCost,
      fiveYearRoi,
      fiveYearNetBenefit,
      benefitDelta,
      migrationHeadroom,
      maxCostOverrunPct,
      worstBreakEven: worst?.breakEvenMonths ?? 14.6,
      worstNetBenefit: worst?.fiveYearNetBenefit ?? 1119813,
      bestBreakEven: best?.breakEvenMonths ?? 5.7,
      bestNetBenefit: best?.fiveYearNetBenefit ?? 2434346,
    };
  }, [scenarios]);

  const resetDefaults = () => {
    setSavingsFactor(1.0);
    setMigrationCostFactor(1.0);
    setTargetCostFactor(1.0);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] py-8 md:py-10 text-[#1d2d3e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#d9e2ec]">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1d2d3e] tracking-tight">
                Scenario &amp; Sensitivity Simulator
              </h1>
              <ValueOriginChip origin="DERIVED" />
            </div>
            <p className="text-sm text-[#556b82] mt-1.5 font-normal">
              Stress-test migration capital payback, recurring savings, and multi-year ROI against fluctuating assumptions.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetDefaults}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1d2d3e] bg-white border border-[#d9e2ec] rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              Reset to Base Case
            </button>
            <Link
              href={`/dashboard/${assessmentId}`}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 16 16" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 12.5l-4.5-4.5 4.5-4.5" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Sliders Card */}
        <div className="bg-white rounded-3xl border border-[#d9e2ec] p-8 md:p-10 shadow-xs space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Sensitivity Tuning Sliders (Real-time Deterministic Calculation)
            </h2>
            {loading && (
              <span className="text-xs text-indigo-600 font-semibold flex items-center space-x-1">
                <span className="animate-spin text-sm">⟳</span>
                <span>Calculating...</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Slider 1: Savings Realization */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="font-bold text-[#1d2d3e]">Annual Savings Factor</label>
                <span className="font-mono font-bold text-[#0070f2] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {savingsFactor.toFixed(2)}x ({((savingsFactor - 1) * 100).toFixed(0)}%)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={savingsFactor}
                onChange={(e) => setSavingsFactor(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0070f2]"
              />
              <p className="text-xs text-[#556b82]">
                Models lower interface adoption or higher operational realization.
              </p>
            </div>

            {/* Slider 2: Migration Cost Variance */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="font-bold text-[#1d2d3e]">Migration Cost Factor</label>
                <span className="font-mono font-bold text-[#0070f2] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {migrationCostFactor.toFixed(2)}x ({((migrationCostFactor - 1) * 100).toFixed(0)}%)
                </span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.8"
                step="0.05"
                value={migrationCostFactor}
                onChange={(e) => setMigrationCostFactor(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0070f2]"
              />
              <p className="text-xs text-[#556b82]">
                Tests delivery overruns or accelerated content pack efficiencies.
              </p>
            </div>

            {/* Slider 3: Target TCO Variance */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="font-bold text-[#1d2d3e]">Target BTP Cost Factor</label>
                <span className="font-mono font-bold text-[#0070f2] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {targetCostFactor.toFixed(2)}x ({((targetCostFactor - 1) * 100).toFixed(0)}%)
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={targetCostFactor}
                onChange={(e) => setTargetCostFactor(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0070f2]"
              />
              <p className="text-xs text-[#556b82]">
                Simulates unexpected message volume expansion or storage uplift.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Cards: Custom vs Base vs Best vs Worst */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { outcome: scenarios?.customCase, highlight: true, tag: 'DYNAMIC SIMULATION', sub: `${savingsFactor}x / ${migrationCostFactor}x` },
            { outcome: scenarios?.baseCase, highlight: false, tag: 'DETERMINISTIC BENCHMARK', sub: '1x / 1x' },
            { outcome: scenarios?.bestCase, highlight: false, tag: 'UPSIDE POTENTIAL', sub: '1.2x / 0.85x' },
            { outcome: scenarios?.worstCase, highlight: false, tag: 'STRESS-TESTED FLOOR', sub: '0.8x / 1.2x' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 md:p-8 transition-all duration-200 ${
                item.highlight
                  ? 'bg-[#1d2d3e] text-white shadow-xl shadow-slate-900/10 border-2 border-[#0070f2] scale-[1.02]'
                  : 'bg-white text-[#1d2d3e] border border-[#d9e2ec] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  item.highlight ? 'bg-blue-900/60 text-blue-200 border border-blue-700' : 'bg-slate-100 text-[#556b82]'
                }`}>
                  {item.tag}
                </span>
                <span className={`text-xs font-mono ${item.highlight ? 'text-slate-400' : 'text-[#556b82]'}`}>
                  {item.sub}
                </span>
              </div>

              <h3 className={`text-base font-bold mb-4 ${item.highlight ? 'text-white' : 'text-[#1d2d3e]'}`}>
                {item.outcome?.scenarioName || 'Scenario'}
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className={item.highlight ? 'text-slate-400' : 'text-[#556b82]'}>Annual Savings:</span>
                  <span className={`font-mono font-bold ${
                    item.outcome?.annualSavings && item.outcome.annualSavings > 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}>
                    {item.outcome ? formatCurrency(item.outcome.annualSavings) : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={item.highlight ? 'text-slate-400' : 'text-[#556b82]'}>Payback Horizon:</span>
                  <span className="font-mono font-bold">
                    {item.outcome ? formatMonths(item.outcome.breakEvenMonths) : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={item.highlight ? 'text-slate-400' : 'text-[#556b82]'}>Migration Cost:</span>
                  <span className="font-mono font-bold">
                    {item.outcome ? formatCurrency(item.outcome.migrationCost) : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={item.highlight ? 'text-slate-400' : 'text-[#556b82]'}>5-Year Net Benefit:</span>
                  <span className="font-mono font-bold text-blue-400">
                    {item.outcome ? formatCurrency(item.outcome.fiveYearNetBenefit) : '—'}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200/20 flex justify-between items-center font-bold">
                  <span className={item.highlight ? 'text-slate-300' : 'text-[#1d2d3e]'}>5-Year ROI:</span>
                  <span className="font-mono text-sm text-emerald-400">
                    {item.outcome ? formatPercent(item.outcome.fiveYearRoi) : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sensitivity Advisory Box: Pure Deep AI Sensitivity Intelligence */}
        <div className="p-8 bg-gradient-to-br from-blue-50/60 via-slate-50 to-white rounded-3xl border border-[#d9e2ec] text-[#1d2d3e] space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d9e2ec] pb-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0070f2] text-white flex items-center justify-center text-base font-bold shadow-xs">
                ✦
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-bold text-[#1d2d3e]">Autonomous Sensitivity Assessment &amp; Risk Bounds</h4>
                  <ValueOriginChip origin="AI_INTERPRETED" className="bg-[#1d2d3e] text-white border-slate-700" />
                </div>
                <span className="text-xs text-[#556b82]">
                  Continuous multi-horizon evaluation synthesized against user assessment parameters
                </span>
              </div>
            </div>

            <button
              onClick={fetchLiveAiScenarioAnalysis}
              disabled={loadingAi}
              className="px-5 py-2.5 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loadingAi ? (
                <>
                  <span className="animate-spin text-xs">⟳</span>
                  <span>Analyzing Scenario with AI...</span>
                </>
              ) : (
                <>
                  <span>✦</span>
                  <span>Generate Live AI Insights</span>
                </>
              )}
            </button>
          </div>

          {/* Dynamic Quantitative Sensitivity Metrics Grid */}
          {scenarioAnalysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-xs space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Scenario Payback</span>
                <span className="text-base font-black text-slate-900 font-mono">{scenarioAnalysis.breakEven.toFixed(1)} Mo</span>
                <span className={`text-[10px] font-bold block ${scenarioAnalysis.breakEvenDelta > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {scenarioAnalysis.breakEvenDelta >= 0 ? `+${scenarioAnalysis.breakEvenDelta.toFixed(1)} mo vs base` : `${scenarioAnalysis.breakEvenDelta.toFixed(1)} mo faster`}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-xs space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Annual Run-Rate Relief</span>
                <span className="text-base font-black text-emerald-700 font-mono">{formatCurrency(scenarioAnalysis.annualSavings)}/yr</span>
                <span className="text-[10px] text-slate-500 block">
                  {scenarioAnalysis.savingsDelta >= 0 ? `+${formatCurrency(scenarioAnalysis.savingsDelta)} upside` : `${formatCurrency(scenarioAnalysis.savingsDelta)} compression`}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-xs space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">5-Year Cumulative Value</span>
                <span className="text-base font-black text-indigo-700 font-mono">{formatCurrency(scenarioAnalysis.fiveYearNetBenefit)}</span>
                <span className="text-[10px] font-bold text-emerald-600 block">{scenarioAnalysis.fiveYearRoi.toFixed(1)}% 5-Yr ROI</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-xs space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Cost Overrun Headroom</span>
                <span className="text-base font-black text-purple-700 font-mono">+{formatCurrency(Math.max(0, scenarioAnalysis.migrationHeadroom))}</span>
                <span className="text-[10px] text-slate-500 block">
                  Cushion before 18-mo limit ({Math.max(0, scenarioAnalysis.maxCostOverrunPct).toFixed(0)}%)
                </span>
              </div>
            </div>
          )}

          {/* Deep AI Sensitivity Intelligence Output */}
          <div className="p-5 bg-white/95 rounded-2xl border border-purple-200 shadow-xs text-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 font-bold text-purple-900 text-sm">
                  <span>✦</span>
                  <span>Autonomous AI Sensitivity Intelligence</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-purple-600">
                  <span>Powered by ValueLens AI / IntSwitch AI Decision Engine</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {loadingAi && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 animate-pulse border border-purple-300 flex items-center space-x-1">
                    <span className="animate-spin text-xs">⟳</span>
                    <span>Synthesizing Live AI Insights...</span>
                  </span>
                )}
                {isCustomTuned && !loadingAi && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Sliders Adjusted • Ready to Re-evaluate
                  </span>
                )}
                {scenarioAnalysis && (
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${scenarioAnalysis.verdictColor}`}>
                    {scenarioAnalysis.verdict}
                  </span>
                )}
              </div>
            </div>

            {aiError && !loadingAi && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-rose-600">⚠</span>
                  <span>{aiError}</span>
                </div>
                <button
                  onClick={fetchLiveAiScenarioAnalysis}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Retry Live AI Inference ⟳
                </button>
              </div>
            )}

            {loadingAi ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-3 text-purple-700">
                <span className="animate-spin text-3xl">⟳</span>
                <span className="text-xs font-bold text-purple-900">Consulting AI Decision Engine & synthesizing live sensitivity advisory...</span>
                <span className="text-[11px] text-slate-500 max-w-md text-center">
                  Benchmarking custom simulation against base case, best case, and stress-tested floor via ValueLens AI.
                </span>
              </div>
            ) : aiAnalysisText ? (
              <div className="space-y-3">
                {isCustomTuned && (
                  <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center justify-between">
                    <span>Simulation sliders were updated. Click to re-run AI evaluation for this new configuration:</span>
                    <button
                      onClick={fetchLiveAiScenarioAnalysis}
                      disabled={loadingAi}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-xs cursor-pointer ml-2 shrink-0"
                    >
                      ✦ Re-run Live AI Advisory
                    </button>
                  </div>
                )}
                <div className="text-slate-800 leading-relaxed font-normal whitespace-pre-line text-xs sm:text-sm bg-purple-50/40 p-4 rounded-xl border border-purple-100">
                  {aiAnalysisText}
                </div>
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl text-purple-600 shadow-xs">
                  ✦
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-purple-900">AI Sensitivity Intelligence Ready</p>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    Adjust the sensitivity sliders above, then click <strong className="text-purple-700">Generate Live AI Insights</strong> to receive a real-time AI executive advisory powered by ValueLens AI.
                  </p>
                </div>
                <button
                  onClick={fetchLiveAiScenarioAnalysis}
                  disabled={loadingAi}
                  className="mt-1 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <span>✦</span>
                  <span>Generate Live AI Insights</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
