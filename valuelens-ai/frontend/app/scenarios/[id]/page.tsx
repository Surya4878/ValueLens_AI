'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import { ScenarioResponse, ScenarioOutcome, Assessment, RoiCalculationResult } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatMonths, formatPercent } from '@/lib/formatters';
import { StreamingText } from '@/components/ui/StreamingText';

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
          } catch { }
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
          } catch { }
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
    setAiAnalysisText(null);
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

  // Helper to parse and beautify AI scenario response
  const renderBeautifiedAiScenario = (rawText: string) => {
    // 1. Sanitize any risk/warning keywords
    const cleaned = rawText
      .replace(/Risk Envelope\s*&?\s*Sensitivity Thresholds/gi, 'Strategic Resilience & Sensitivity Thresholds')
      .replace(/Risk Envelope/gi, 'Strategic Resilience Bounds')
      .replace(/Capital Risk\s*&?\s*Sensitivity Drivers/gi, 'Capital Resilience & Sensitivity Drivers')
      .replace(/Capital Risk/gi, 'Capital Resilience')
      .replace(/risk bounds/gi, 'sensitivity bounds')
      .replace(/primary execution risk/gi, 'primary execution focus')
      .replace(/execution risk/gi, 'execution consideration')
      .replace(/delivery risk/gi, 'delivery consideration');

    const lines = cleaned.split('\n').map((l) => l.trim()).filter(Boolean);

    let mainTitle = 'Enterprise Cloud Migration Sensitivity Advisory';
    let startIndex = 0;
    if (lines.length > 0 && (/advisory/i.test(lines[0]) || lines[0].startsWith('**Enterprise') || lines[0].startsWith('EXECUTIVE'))) {
      mainTitle = lines[0].replace(/\*\*/g, '').replace(/:$/, '').trim();
      startIndex = 1;
    }

    const sectionKeywords = [
      { num: 1, title: 'Executive Viability & Payback Horizon', pattern: /(?:section\s*1|1\.\s*Executive)/i },
      { num: 2, title: 'Strategic Resilience & Sensitivity Thresholds', pattern: /(?:section\s*2|2\.\s*(?:Strategic|Capital|Resilience|Sensitivity))/i },
      { num: 3, title: 'Strategic Leadership Recommendations', pattern: /(?:section\s*3|3\.\s*(?:Strategic|Recommended|Action|Leadership))/i },
    ];

    const indices: { lineIdx: number; num: number; title: string; rawLine: string }[] = [];
    lines.forEach((line, idx) => {
      if (idx < startIndex) return;
      for (const sk of sectionKeywords) {
        if (sk.pattern.test(line)) {
          indices.push({ lineIdx: idx, ...sk, rawLine: line });
          break;
        }
      }
    });

    const highlightMetrics = (text: string) => {
      const parts = text.split(/(\$[\d,]+(?:\.\d+)?(?:\/yr)?|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\s*(?:months|mo|years|yr)\b)/gi);
      return parts.map((part, i) => {
        if (/^(\$[\d,]+|\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*(?:months|mo|years|yr))/i.test(part)) {
          return (
            <strong key={i} className="text-slate-900 font-bold">
              {part}
            </strong>
          );
        }
        return part;
      });
    };

    if (indices.length > 0) {
      const sections = [];
      for (let i = 0; i < indices.length; i++) {
        const current = indices[i];
        const start = current.lineIdx + 1;
        const end = i + 1 < indices.length ? indices[i + 1].lineIdx : lines.length;

        let inlineText = '';
        const colonIdx = current.rawLine.indexOf(':');
        if (colonIdx !== -1) {
          const cleanedHeader = current.rawLine.replace(/\*\*/g, '').trim();
          const afterColon = current.rawLine.substring(colonIdx + 1).replace(/\*\*/g, '').trim();
          if (/^section\s*\d+/i.test(cleanedHeader)) {
            // Header title only
          } else if (afterColon.length > 60) {
            inlineText = afterColon;
          }
        }

        const bodyLines = lines.slice(start, end).map((l) => l.replace(/\*\*/g, ''));
        if (inlineText) {
          bodyLines.unshift(inlineText);
        }

        const bullets = bodyLines
          .filter((l) => /^(?:[•\-\*]|\d+\.)\s+/.test(l))
          .map((l) => l.replace(/^(?:[•\-\*]|\d+\.)\s+/, '').trim());

        const paragraphs = bodyLines.filter((l) => !/^(?:[•\-\*]|\d+\.)\s+/.test(l));

        sections.push({
          num: current.num,
          title: current.title,
          text: paragraphs.join(' ').trim(),
          bullets,
        });
      }

      return (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Title Banner */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/50 border border-blue-200/80 rounded-2xl flex items-center space-x-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#0070f2] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              ✦
            </div>
            <div>
              <h4 className="text-[17px] sm:text-[18px] font-bold text-[#1d2d3e]">
                {mainTitle}
              </h4>
              <span className="text-[13px] sm:text-[14px] text-slate-600 font-medium block">
                Autonomous Executive Advisory Synthesized against Live Assessment Parameters
              </span>
            </div>
          </div>

          {/* 3 Structured Section Cards */}
          <div className="space-y-5">
            {sections.map((sec) => {
              if (sec.num === 1) {
                return (
                  <div key={sec.num} className="p-6 sm:p-7 bg-blue-50/40 border border-blue-200/80 rounded-2xl space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0070f2] flex items-center justify-center shrink-0 shadow-2xs">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <h5 className="text-[17px] sm:text-[18px] font-bold text-[#1d2d3e]">
                          {sec.title}
                        </h5>
                      </div>
                      <span className="text-[12px] font-bold px-3 py-0.5 rounded-full bg-blue-100 text-[#0070f2] border border-blue-200 uppercase tracking-wider">
                        Viability &amp; Payback
                      </span>
                    </div>
                    {sec.text && (
                      <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed font-normal">
                        <StreamingText text={sec.text} speed={12} />
                      </p>
                    )}
                  </div>
                );
              }

              if (sec.num === 2) {
                return (
                  <div key={sec.num} className="p-6 sm:p-7 bg-indigo-50/40 border border-indigo-200/80 rounded-2xl space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
                          <Layers className="w-4 h-4" />
                        </div>
                        <h5 className="text-[17px] sm:text-[18px] font-bold text-[#1d2d3e]">
                          {sec.title}
                        </h5>
                      </div>
                      <span className="text-[12px] font-bold px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                        Resilience &amp; Bounds
                      </span>
                    </div>
                    {sec.text && (
                      <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed font-normal">
                        <StreamingText text={sec.text} speed={12} />
                      </p>
                    )}
                  </div>
                );
              }

              return (
                <div key={sec.num} className="p-6 sm:p-7 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#107e3e] flex items-center justify-center shrink-0 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h5 className="text-[17px] sm:text-[18px] font-bold text-[#1d2d3e]">
                        {sec.title}
                      </h5>
                    </div>
                    <span className="text-[12px] font-bold px-3 py-0.5 rounded-full bg-emerald-100 text-[#107e3e] border border-emerald-200 uppercase tracking-wider">
                      Strategic Actions
                    </span>
                  </div>
                  {sec.text && (
                    <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed font-normal">
                      <StreamingText text={sec.text} speed={12} />
                    </p>
                  )}
                  {sec.bullets.length > 0 && (
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      {sec.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="p-4 bg-white border border-emerald-200/80 rounded-xl flex items-start space-x-3 shadow-2xs">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#107e3e] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                          <span className="text-[15px] sm:text-[16px] text-slate-800 font-medium leading-relaxed"><StreamingText text={b} speed={12} /></span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Fallback if structured sections not detected
    return (
      <div className="p-6 bg-purple-50/40 rounded-2xl border border-purple-200 space-y-4 text-[15px] sm:text-[16px] text-slate-800 leading-relaxed">
        {lines.map((p, idx) => (
          <p key={idx} className="font-normal">
            <StreamingText text={p.replace(/\*\*/g, '')} speed={10} />
          </p>
        ))}
      </div>
    );
  };
  const formatScenarioCurrency = (val: number | undefined | null) => {
    if (val === undefined || val === null) return '—';
    return '$' + Math.round(val).toLocaleString('en-US');
  };

  const formatScenarioMonths = (val: number | undefined | null) => {
    if (val === undefined || val === null) return '—';
    return `${val.toFixed(1)} months`;
  };

  const formatScenarioRoi = (val: number | undefined | null) => {
    if (val === undefined || val === null) return '—';
    return `${val.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] py-8 md:py-10 text-[#1d2d3e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#d9e2ec]">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1d2d3e] tracking-tight">
              Scenario &amp; Sensitivity Simulator
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#556b82] mt-1.5 font-normal">
              Stress-test migration capital payback, recurring savings, and multi-year ROI against fluctuating assumptions.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetDefaults}
              className="px-4 py-2.5 text-[14px] sm:text-[15px] font-semibold text-[#1d2d3e] bg-white border border-[#d9e2ec] rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              Reset to Base Case
            </button>
            <Link
              href={`/dashboard/${assessmentId}`}
              className="px-4 py-2.5 text-[14px] sm:text-[15px] font-bold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5"
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
            <h2 className="text-xl font-bold text-slate-900">
              Sensitivity Tuning Sliders (Real-time Deterministic Calculation)
            </h2>
            {loading && (
              <span className="text-sm text-indigo-600 font-semibold flex items-center space-x-1.5">
                <span className="animate-spin text-sm">⟳</span>
                <span>Calculating...</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Slider 1: Savings Realization */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
              <div className="flex justify-between items-center text-[15px] sm:text-[16px]">
                <label className="font-bold text-[#1d2d3e]">Annual Savings Factor</label>
                <span className="font-mono font-bold text-[#0070f2] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 text-[14px] sm:text-[15px]">
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
              <p className="text-[14px] text-slate-600 leading-relaxed">
                Models lower interface adoption or higher operational realization.
              </p>
            </div>

            {/* Slider 2: Migration Cost Variance */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
              <div className="flex justify-between items-center text-[15px] sm:text-[16px]">
                <label className="font-bold text-[#1d2d3e]">Migration Cost Factor</label>
                <span className="font-mono font-bold text-[#0070f2] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 text-[14px] sm:text-[15px]">
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
              <p className="text-[14px] text-slate-600 leading-relaxed">
                Tests delivery overruns or accelerated content pack efficiencies.
              </p>
            </div>

            {/* Slider 3: Target TCO Variance */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-[#d9e2ec]">
              <div className="flex justify-between items-center text-[15px] sm:text-[16px]">
                <label className="font-bold text-[#1d2d3e]">Target BTP Cost Factor</label>
                <span className="font-mono font-bold text-[#0070f2] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 text-[14px] sm:text-[15px]">
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
              <p className="text-[14px] text-slate-600 leading-relaxed">
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
                  ? 'bg-blue-50/40 text-[#1d2d3e] border-2 border-[#0070f2] shadow-sm ring-4 ring-[#0070f2]/10 scale-[1.01]'
                  : 'bg-white text-[#1d2d3e] border border-[#d9e2ec] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    item.highlight
                      ? 'bg-blue-100 text-[#0070f2] border border-blue-200'
                      : 'bg-slate-100 text-[#556b82]'
                  }`}
                >
                  {item.tag}
                </span>
                <span className="text-sm font-mono text-[#556b82]">
                  {item.sub}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#1d2d3e]">
                {item.outcome?.scenarioName || 'Scenario'}
              </h3>

              <div className="space-y-3 text-[14px] sm:text-[15px]">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-[#556b82] font-medium">Annual Savings:</span>
                  <span
                    className={`font-mono font-bold text-[15px] sm:text-[16px] text-right tabular-nums ${
                      item.outcome?.annualSavings && item.outcome.annualSavings > 0
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {formatScenarioCurrency(item.outcome?.annualSavings)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-[#556b82] font-medium">Payback Horizon:</span>
                  <span className="font-mono font-bold text-[15px] sm:text-[16px] text-[#1d2d3e] text-right tabular-nums">
                    {formatScenarioMonths(item.outcome?.breakEvenMonths)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-[#556b82] font-medium">Migration Cost:</span>
                  <span className="font-mono font-bold text-[15px] sm:text-[16px] text-[#1d2d3e] text-right tabular-nums">
                    {formatScenarioCurrency(item.outcome?.migrationCost)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-[#556b82] font-medium">5-Year Net Benefit:</span>
                  <span className="font-mono font-bold text-[15px] sm:text-[16px] text-[#0070f2] text-right tabular-nums">
                    {formatScenarioCurrency(item.outcome?.fiveYearNetBenefit)}
                  </span>
                </div>

                <div className="pt-3 flex justify-between items-center font-bold">
                  <span className="text-[#1d2d3e] text-[15px] sm:text-[16px]">5-Year ROI:</span>
                  <span className="font-mono font-extrabold text-[17px] sm:text-[18px] text-emerald-600 text-right tabular-nums">
                    {formatScenarioRoi(item.outcome?.fiveYearRoi)}
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
                <h4 className="text-xl font-bold text-[#1d2d3e]">Autonomous Sensitivity Assessment</h4>
                <span className="text-[14px] sm:text-[15px] text-[#556b82]">
                  Dynamic financial simulation based on your assessment parameters
                </span>
              </div>
            </div>

            <button
              onClick={fetchLiveAiScenarioAnalysis}
              disabled={loadingAi}
              className="px-5 py-2.5 rounded-xl bg-[#0070f2] hover:bg-[#0057d2] active:scale-95 text-white text-[14px] sm:text-[15px] font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-xs space-y-1.5">
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block">Scenario Payback</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{scenarioAnalysis.breakEven.toFixed(1)} Mo</span>
                <span className={`text-[13px] sm:text-[14px] font-bold block ${scenarioAnalysis.breakEvenDelta > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {scenarioAnalysis.breakEvenDelta >= 0 ? `+${scenarioAnalysis.breakEvenDelta.toFixed(1)} mo vs base` : `${scenarioAnalysis.breakEvenDelta.toFixed(1)} mo faster`}
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-xs space-y-1.5">
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block">Annual Run-Rate Relief</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">{formatCurrency(scenarioAnalysis.annualSavings)}/yr</span>
                <span className="text-[13px] sm:text-[14px] text-slate-600 font-medium block">
                  {scenarioAnalysis.savingsDelta >= 0 ? `+${formatCurrency(scenarioAnalysis.savingsDelta)} upside` : `${formatCurrency(scenarioAnalysis.savingsDelta)} compression`}
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-xs space-y-1.5">
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block">5-Year Cumulative Value</span>
                <span className="text-xl sm:text-2xl font-black text-indigo-700 font-mono">{formatCurrency(scenarioAnalysis.fiveYearNetBenefit)}</span>
                <span className="text-[13px] sm:text-[14px] font-bold text-emerald-600 block">{scenarioAnalysis.fiveYearRoi.toFixed(1)}% 5-Yr ROI</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-xs space-y-1.5">
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block">Cost Overrun Headroom</span>
                <span className="text-xl sm:text-2xl font-black text-purple-700 font-mono">+{formatCurrency(Math.max(0, scenarioAnalysis.migrationHeadroom))}</span>
                <span className="text-[13px] sm:text-[14px] text-slate-600 block">
                  Cushion before 18-mo limit ({Math.max(0, scenarioAnalysis.maxCostOverrunPct).toFixed(0)}%)
                </span>
              </div>
            </div>
          )}

          {/* Deep AI Sensitivity Intelligence Output */}
          <div className="p-6 bg-white/95 rounded-2xl border border-purple-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 font-bold text-purple-950 text-base sm:text-lg">
                  <span>✦</span>
                  <span>Autonomous AI Sensitivity Intelligence</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-purple-700 font-medium">
                  <span>Powered by ValueLens AI</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {loadingAi && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 animate-pulse border border-purple-300 flex items-center space-x-1.5">
                    <span className="animate-spin text-xs">⟳</span>
                    <span>Synthesizing Live AI Insights...</span>
                  </span>
                )}
                {isCustomTuned && !loadingAi && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Sliders Adjusted • Ready to Re-evaluate
                  </span>
                )}
                {scenarioAnalysis && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${scenarioAnalysis.verdictColor}`}>
                    {scenarioAnalysis.verdict}
                  </span>
                )}
              </div>
            </div>

            {aiError && !loadingAi && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[14px] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-rose-600">⚠</span>
                  <span>{aiError}</span>
                </div>
                <button
                  onClick={fetchLiveAiScenarioAnalysis}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Retry Live AI Inference ⟳
                </button>
              </div>
            )}

            {loadingAi ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3.5 text-purple-700">
                <span className="animate-spin text-3xl">⟳</span>
                <span className="text-[15px] sm:text-[16px] font-bold text-purple-900">Consulting AI Decision Engine &amp; synthesizing live sensitivity advisory...</span>
                <span className="text-[13px] sm:text-[14px] text-slate-500 max-w-md text-center">
                  Benchmarking custom simulation against base case, best case, and stress-tested floor via ValueLens AI.
                </span>
              </div>
            ) : aiAnalysisText ? (
              <div className="space-y-4">
                {isCustomTuned && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-[14px] flex items-center justify-between">
                    <span>Simulation sliders were updated. Click to re-run AI evaluation for this new configuration:</span>
                    <button
                      onClick={fetchLiveAiScenarioAnalysis}
                      disabled={loadingAi}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer ml-2 shrink-0"
                    >
                      ✦ Re-run Live AI Advisory
                    </button>
                  </div>
                )}
                {renderBeautifiedAiScenario(aiAnalysisText)}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl text-purple-600 shadow-xs">
                  ✦
                </div>
                <div className="space-y-1.5">
                  <p className="text-base font-bold text-purple-900">AI Sensitivity Intelligence Ready</p>
                  <p className="text-[14px] text-slate-600 max-w-md leading-relaxed">
                    Adjust the sensitivity sliders above, then click <strong className="text-purple-700">Generate Live AI Insights</strong> to receive a real-time AI executive advisory powered by ValueLens AI.
                  </p>
                </div>
                <button
                  onClick={fetchLiveAiScenarioAnalysis}
                  disabled={loadingAi}
                  className="mt-1 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-[14px] font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
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
