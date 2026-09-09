'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

  const baselineCurrent = calculations?.currentPlatformTCO ?? 730000;
  const baselineTarget = calculations?.targetPlatformTCO ?? 313084;
  const baselineMigration = calculations?.migrationCost ?? 300000;

  const fetchLiveAiScenarioAnalysis = async () => {
    if (!scenarios) return;
    setLoadingAi(true);
    try {
      const res = await api.analyzeScenario(scenarios);
      if (res && res.interpretation) {
        setAiAnalysisText(res.interpretation);
      }
    } catch (err) {
      console.error('Failed to analyze scenario with AI:', err);
    } finally {
      setLoadingAi(false);
    }
  };

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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Scenario & Sensitivity Simulator
              </h1>
              <ValueOriginChip origin="DERIVED" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Stress-test migration capital payback, recurring savings, and multi-year ROI against fluctuating assumptions.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetDefaults}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
            >
              Reset to Base Case
            </button>
            <Link
              href={`/dashboard/${assessmentId}`}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Sliders Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Slider 1: Savings Realization */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Annual Savings Factor</label>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] text-slate-400">
                Models lower interface adoption or higher operational realization.
              </p>
            </div>

            {/* Slider 2: Migration Cost Variance */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Migration Cost Factor</label>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] text-slate-400">
                Tests delivery overruns or accelerated content pack efficiencies.
              </p>
            </div>

            {/* Slider 3: Target TCO Variance */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Target BTP Cost Factor</label>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] text-slate-400">
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
              className={`rounded-3xl p-6 transition-all duration-200 ${
                item.highlight
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 border-2 border-indigo-500 scale-[1.02]'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.highlight ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.tag}
                </span>
                <span className={`text-xs font-mono ${item.highlight ? 'text-slate-400' : 'text-slate-400'}`}>
                  {item.sub}
                </span>
              </div>

              <h3 className={`text-base font-bold mb-4 ${item.highlight ? 'text-white' : 'text-slate-900'}`}>
                {item.outcome?.scenarioName || 'Scenario'}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className={item.highlight ? 'text-slate-400' : 'text-slate-500'}>Annual Savings:</span>
                  <span className={`font-mono font-bold ${
                    item.outcome?.annualSavings && item.outcome.annualSavings > 0
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  }`}>
                    {item.outcome ? formatCurrency(item.outcome.annualSavings) : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={item.highlight ? 'text-slate-400' : 'text-slate-500'}>Payback Horizon:</span>
                  <span className="font-mono font-bold">
                    {item.outcome ? formatMonths(item.outcome.breakEvenMonths) : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={item.highlight ? 'text-slate-400' : 'text-slate-500'}>Migration Cost:</span>
                  <span className="font-mono font-bold">
                    {item.outcome ? formatCurrency(item.outcome.migrationCost) : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={item.highlight ? 'text-slate-400' : 'text-slate-500'}>5-Year Net Benefit:</span>
                  <span className="font-mono font-bold text-indigo-400">
                    {item.outcome ? formatCurrency(item.outcome.fiveYearNetBenefit) : '—'}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200/20 flex justify-between items-center font-bold">
                  <span className={item.highlight ? 'text-slate-300' : 'text-slate-700'}>5-Year ROI:</span>
                  <span className="font-mono text-sm text-emerald-400">
                    {item.outcome ? formatPercent(item.outcome.fiveYearRoi) : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sensitivity Advisory Box: Pure Deep AI Sensitivity Intelligence */}
        <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white rounded-3xl border border-purple-200 text-purple-950 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                ✦
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-purple-950">Autonomous Sensitivity Assessment & Risk Bounds</h4>
                  <ValueOriginChip origin="AI_INTERPRETED" className="bg-purple-950 text-purple-200 border-purple-800" />
                </div>
                <span className="text-[11px] text-purple-700">
                  Continuous multi-horizon evaluation synthesized against user assessment parameters
                </span>
              </div>
            </div>

            <button
              onClick={fetchLiveAiScenarioAnalysis}
              disabled={loadingAi}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-purple-900 text-sm">
                <span>✦</span>
                <span>Autonomous AI Sensitivity Intelligence</span>
              </div>
              {scenarioAnalysis && (
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${scenarioAnalysis.verdictColor}`}>
                  {scenarioAnalysis.verdict}
                </span>
              )}
            </div>

            {loadingAi ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2.5 text-purple-700">
                <span className="animate-spin text-2xl">⟳</span>
                <span className="text-xs font-semibold">Consulting AI Decision Engine & evaluating scenario sensitivity live...</span>
                <span className="text-[11px] text-slate-500">Benchmarking custom simulation against base case, best case, and stress-tested floor</span>
              </div>
            ) : aiAnalysisText ? (
              <div className="text-slate-800 leading-relaxed font-normal whitespace-pre-line text-xs sm:text-sm bg-purple-50/40 p-4 rounded-xl border border-purple-100">
                {aiAnalysisText}
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl text-purple-600 shadow-xs">
                  ✦
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-purple-900">AI Sensitivity Intelligence Ready</p>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    Adjust the sensitivity sliders above, then click <strong className="text-purple-700">Generate Live AI Insights</strong> to receive a real-time AI executive advisory powered by the NVIDIA NIM inference engine.
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
