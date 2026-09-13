'use client';

import React from 'react';
import {
  Layers,
  Share2,
  Settings,
  ChevronDown,
  Server,
  Database,
  Cpu,
  Workflow,
  KeyRound,
  Network,
  Puzzle,
} from 'lucide-react';
import { PlatformId, PlatformConfig, matchIncturePackage } from '@/data/platformAssessmentConfig';

import { Assessment } from '@/types';

export interface Step2Props {
  platformId: PlatformId;
  config: PlatformConfig;
  assessment: Assessment;
  onUpdateAssessment: (updated: Assessment) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Step2Landscape: React.FC<Step2Props> = ({
  platformId,
  config,
  assessment,
  onUpdateAssessment,
  onBack,
  onContinue,
}) => {
  // PI/PO state (defaults all empty/zero initially)
  const [piPoVersion, setPiPoVersion] = React.useState<string>('');
  const [piPoInterfacesCount, setPiPoInterfacesCountState] = React.useState<number>(
    assessment?.sourceSystem?.environmentAssessment?.totalInterfaces || 0
  );
  const [piPoApplicationsCount, setPiPoApplicationsCount] = React.useState<number>(0);
  const [sapBackendSystem, setSapBackendSystem] = React.useState<string>('');
  const [hasB2bIntegrations, setHasB2bIntegrations] = React.useState<'Yes' | 'No' | 'Not sure' | ''>('');
  const [b2bStandards, setB2bStandards] = React.useState<string[]>([]);
  const [b2bProtocols, setB2bProtocols] = React.useState<string[]>([]);
  const [ediDocumentTypes, setEdiDocumentTypes] = React.useState<string[]>([]);
  const [b2bInterfacesCount, setB2bInterfacesCount] = React.useState<number>(
    assessment?.sourceSystem?.volumetrics?.b2bInterfaces || 0
  );
  const [hasGroundToGround, setHasGroundToGround] = React.useState<'Yes' | 'No' | 'Not sure' | ''>('');
  const [groundToGroundInterfaces, setGroundToGroundInterfaces] = React.useState<number>(0);
  const [piPoComplexity, setPiPoComplexity] = React.useState<'Simple' | 'Moderate' | 'Complex' | ''>('');
  const [hasJavaMappings, setHasJavaMappings] = React.useState<boolean>(false);
  const [hasXsltMappings, setHasXsltMappings] = React.useState<boolean>(false);
  const [hasUdf, setHasUdf] = React.useState<boolean>(false);
  const [hasCcBpm, setHasCcBpm] = React.useState<boolean>(false);
  const [hasCustomAdapterModules, setHasCustomAdapterModules] = React.useState<boolean>(false);

  // MuleSoft state
  const [muleDeploymentModel, setMuleDeploymentModel] = React.useState<string>('');
  const [muleTotalApis, setMuleTotalApis] = React.useState<number>(0);
  const [muleSystemApis, setMuleSystemApis] = React.useState<number>(0);
  const [muleProcessApis, setMuleProcessApis] = React.useState<number>(0);
  const [muleExperienceApis, setMuleExperienceApis] = React.useState<number>(0);
  const [muleApplicationsCount, setMuleApplicationsCount] = React.useState<number>(0);
  const [muleFlowsCount, setMuleFlowsCount] = React.useState<number>(0);
  const [muleApiLedUsage, setMuleApiLedUsage] = React.useState<'Yes' | 'Partial' | 'No' | ''>('');
  const [muleHasB2b, setMuleHasB2b] = React.useState<'Yes' | 'No' | 'Not sure' | ''>('');
  const [muleTradingPartnersCount, setMuleTradingPartnersCount] = React.useState<number>(0);
  const [muleHasCustomConnectors, setMuleHasCustomConnectors] = React.useState<boolean>(false);
  const [muleHasCustomPolicies, setMuleHasCustomPolicies] = React.useState<boolean>(false);
  const [muleHasOnPremDeps, setMuleHasOnPremDeps] = React.useState<boolean>(false);
  const [muleComplexity, setMuleComplexity] = React.useState<'Simple' | 'Moderate' | 'Complex' | ''>('');

  // SAP CPI (Neo) state
  const [neoFlowsCount, setNeoFlowsCount] = React.useState<number>(0);
  const [neoApplicationsCount, setNeoApplicationsCount] = React.useState<number>(0);
  const [neoMonthlyMessageVol, setNeoMonthlyMessageVol] = React.useState<string>('');
  const [neoComplexity, setNeoComplexity] = React.useState<'Simple' | 'Moderate' | 'Complex' | ''>('');
  const [neoHasCustomScripts, setNeoHasCustomScripts] = React.useState<boolean>(false);
  const [neoHasMappings, setNeoHasMappings] = React.useState<boolean>(false);
  const [neoHasCustomAdapters, setNeoHasCustomAdapters] = React.useState<boolean>(false);
  const [neoHasB2b, setNeoHasB2b] = React.useState<'Yes' | 'No' | 'Not sure' | ''>('');
  const [neoCustomDevLevel, setNeoCustomDevLevel] = React.useState<'Low' | 'Medium' | 'High' | ''>('');
  const [neoScope, setNeoScope] = React.useState<string>('');

  // Boomi state
  const [boomiProcessCount, setBoomiProcessCount] = React.useState<number>(0);
  const [boomiApplicationsCount, setBoomiApplicationsCount] = React.useState<number>(0);
  const [boomiConnectorsCount, setBoomiConnectorsCount] = React.useState<number>(0);
  const [boomiCustomConnectorsCount, setBoomiCustomConnectorsCount] = React.useState<number>(0);
  const [boomiHasB2b, setBoomiHasB2b] = React.useState<'Yes' | 'No' | 'Not sure' | ''>('');
  const [boomiTradingPartnersCount, setBoomiTradingPartnersCount] = React.useState<number>(0);
  const [boomiHasCustomLogic, setBoomiHasCustomLogic] = React.useState<boolean>(false);
  const [boomiHasCustomScripting, setBoomiHasCustomScripting] = React.useState<boolean>(false);
  const [boomiMappingComplexity, setBoomiMappingComplexity] = React.useState<'Simple' | 'Moderate' | 'Complex' | ''>('');
  const [boomiOnPremDeps, setBoomiOnPremDeps] = React.useState<string>('');

  // Compute active scope for Incture package matching
  const currentScopeCount =
    platformId === 'sap-pipo'
      ? piPoInterfacesCount
      : platformId === 'mulesoft'
        ? muleTotalApis
        : platformId === 'sap-neo'
          ? neoFlowsCount
          : boomiProcessCount;

  const currentAppsCount =
    platformId === 'sap-pipo'
      ? piPoApplicationsCount
      : platformId === 'mulesoft'
        ? muleApplicationsCount
        : platformId === 'sap-neo'
          ? neoApplicationsCount
          : boomiApplicationsCount;

  const currentComplexity =
    (platformId === 'sap-pipo'
      ? piPoComplexity
      : platformId === 'mulesoft'
        ? muleComplexity
        : platformId === 'sap-neo'
          ? neoComplexity
          : boomiMappingComplexity) || 'Simple';

  // Real-time Incture Package Matching (Range / Package-Based Model with Dual-Stack +15% per PDF standard)
  const isDualStack = platformId === 'sap-pipo' && (piPoVersion.toLowerCase().includes('dual') || hasCcBpm);
  const matchedResult = React.useMemo(() => {
    return matchIncturePackage(platformId, currentScopeCount, currentAppsCount, currentComplexity, isDualStack);
  }, [platformId, currentScopeCount, currentAppsCount, currentComplexity, isDualStack]);

  // Synchronize matched package pricing to assessment state
  React.useEffect(() => {
    if (currentScopeCount <= 0) {
      if (assessment.migrationRelatedDetails?.totalMigrationCost !== 0) {
        onUpdateAssessment({
          ...assessment,
          sourceSystem: {
            ...assessment.sourceSystem,
            environmentAssessment: {
              ...(assessment.sourceSystem?.environmentAssessment || {}),
              totalInterfaces: 0,
              simpleInterfaces: 0,
              mediumInterfaces: 0,
              complexInterfaces: 0,
            },
          },
          migrationRelatedDetails: {
            ...assessment.migrationRelatedDetails,
            totalMigrationCost: 0,
            baseMigrationCost: 0,
            developmentCost: 0,
            testingCost: 0,
            architectureCost: 0,
            projectManagementCost: 0,
            contingencyCost: 0,
            trainingCost: 0,
            deploymentCutoverCost: 0,
            documentationCost: 0,
          },
        });
      }
      return;
    }

    const pkg = matchedResult.package;
    if (pkg && pkg.price !== assessment.migrationRelatedDetails?.totalMigrationCost) {
      onUpdateAssessment({
        ...assessment,
        sourceSystem: {
          ...assessment.sourceSystem,
          companyInformation: {
            ...(assessment.sourceSystem?.companyInformation || {}),
            migrationTimeline: `${pkg.timelineMonths} (Incture ${pkg.name})`,
          },
          environmentAssessment: {
            ...(assessment.sourceSystem?.environmentAssessment || {}),
            totalInterfaces: currentScopeCount,
            systemComplexity: currentComplexity,
          },
        },
        migrationRelatedDetails: {
          ...assessment.migrationRelatedDetails,
          totalMigrationCost: pkg.price,
          baseMigrationCost: pkg.price,
          developmentCost: Math.round(pkg.price * 0.60),
          testingCost: Math.round(pkg.price * 0.20),
          architectureCost: Math.round(pkg.price * 0.10),
          projectManagementCost: Math.round(pkg.price * 0.10),
          contingencyCost: 0,
          trainingCost: 0,
          deploymentCutoverCost: 0,
          documentationCost: 0,
        },
      });
    }
  }, [matchedResult, currentScopeCount, currentComplexity]);

  const setPiPoInterfacesCount = (val: number) => {
    setPiPoInterfacesCountState(val);
    // Standard Incture PDF distribution: 60% Simple : 30% Medium : 10% Complex
    const simple = Math.round(val * 0.60);
    const medium = Math.round(val * 0.30);
    const complex = Math.max(0, val - simple - medium);
    let volume = 'Low';
    if (val > 100) volume = 'Medium';
    if (val > 500) volume = 'High';

    onUpdateAssessment({
      ...assessment,
      sourceSystem: {
        ...assessment.sourceSystem,
        environmentAssessment: {
          ...(assessment.sourceSystem?.environmentAssessment || {}),
          totalInterfaces: val,
          integrationVolume: volume,
          simpleInterfaces: simple,
          mediumInterfaces: medium,
          complexInterfaces: complex,
        },
      },
    });
  };
  const toggleArrayItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[12px] sm:text-[13px] font-semibold text-[#0070f2] uppercase tracking-wider">
          STEP 2 OF 7
        </span>
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#1d2d3e] mt-1 tracking-tight">
          {config.step2Title}
        </h2>
        <p className="text-[14px] sm:text-[15px] text-[#556b82] mt-1 font-normal leading-normal">
          {config.step2Description}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. SAP PI/PO LANDSCAPE                                                    */}
      {/* ========================================================================= */}
      {platformId === 'sap-pipo' && (
        <div className="space-y-8">
          {/* Card A: Landscape */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <Layers className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                A. Current PI/PO Landscape
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
              {/* Q1: Version */}
              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  1. PI/PO Version <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={piPoVersion}
                    onChange={(e) => setPiPoVersion(e.target.value)}
                    className="w-full h-12 text-[15px] font-normal text-slate-800 border border-slate-300 rounded-lg px-4 pr-10 appearance-none bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none"
                  >
                    <option value="">Select PI/PO Version</option>
                    <option value="PI 7.0">PI 7.0</option>
                    <option value="PI 7.1">PI 7.1</option>
                    <option value="PI 7.3">PI 7.3</option>
                    <option value="PI 7.4">PI 7.4</option>
                    <option value="PO 7.4">PO 7.4</option>
                    <option value="PO 7.5">PO 7.5</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              {/* Q2: Interface Count */}
              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  2. Number of Interfaces <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    min="0"
                    value={piPoInterfacesCount === 0 ? '' : piPoInterfacesCount}
                    onKeyDown={(e) => {
                      if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                    }}
                    onChange={(e) => setPiPoInterfacesCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    interfaces
                  </div>
                </div>
              </div>

              {/* Q3: Applications Count */}
              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  3. Connected Applications <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    min="0"
                    value={piPoApplicationsCount === 0 ? '' : piPoApplicationsCount}
                    onKeyDown={(e) => {
                      if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                    }}
                    onChange={(e) => setPiPoApplicationsCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    apps
                  </div>
                </div>
              </div>

              {/* Q4: Backend System */}
              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  4. Connected SAP Backend <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={sapBackendSystem}
                    onChange={(e) => setSapBackendSystem(e.target.value)}
                    className="w-full h-12 text-[15px] font-normal text-slate-800 border border-slate-300 rounded-lg px-4 pr-10 appearance-none bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none"
                  >
                    <option value="">Select Connected Backend</option>
                    <option value="SAP ECC">SAP ECC</option>
                    <option value="SAP S/4HANA">SAP S/4HANA</option>
                    <option value="Both ECC and S/4HANA">Both ECC and S/4HANA</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card B: B2B/EDI & Ground-to-ground */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <Share2 className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                B. Integration Characteristics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {/* B2B/EDI */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                    Do you use B2B / EDI integrations in SAP PI/PO? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-6">
                    {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                      <label key={opt} className="flex items-center space-x-2.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="pipoB2b"
                          value={opt}
                          checked={hasB2bIntegrations === opt}
                          onChange={() => setHasB2bIntegrations(opt)}
                          className="w-5 h-5 text-[#0070f2] border-slate-300 focus:ring-[#0070f2]"
                        />
                        <span className="text-[15px] text-slate-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {hasB2bIntegrations === 'Yes' && (
                  <div className="p-[18px] sm:p-[22px] bg-slate-50/80 rounded-xl border border-slate-200 space-y-4 overflow-visible">
                    <span className="text-[15px] sm:text-[16px] font-semibold text-blue-900 block leading-[1.4] break-words">
                      B2B / EDI Standards &amp; Protocols (that apply)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                      {['EDIFACT', 'ANSI X12', 'EANCOM', 'TRADACOMS', 'Odette', 'VDA', 'AS2', 'SFTP', 'Other'].map((std) => (
                        <label key={std} className="flex items-center space-x-2.5 cursor-pointer text-[14px] sm:text-[15px] text-slate-700 min-w-0 select-none">
                          <input
                            type="checkbox"
                            checked={b2bStandards.includes(std)}
                            onChange={() => toggleArrayItem(b2bStandards, setB2bStandards, std)}
                            className="w-5 h-5 rounded text-[#0070f2] border-slate-300 shrink-0"
                          />
                          <span className="break-words">{std}</span>
                        </label>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35]">
                        Approximate B2B Interfaces Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={b2bInterfacesCount === 0 ? '' : b2bInterfacesCount}
                        onKeyDown={(e) => {
                          if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                        }}
                        onChange={(e) => setB2bInterfacesCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full h-12 text-[15px] font-normal border border-slate-300 rounded-lg px-4 bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none placeholder:text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Ground-to-ground */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                    Do you have ground-to-ground (on-prem-to-on-prem) integrations? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-6">
                    {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                      <label key={opt} className="flex items-center space-x-2.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="pipoGround"
                          value={opt}
                          checked={hasGroundToGround === opt}
                          onChange={() => setHasGroundToGround(opt)}
                          className="w-5 h-5 text-[#0070f2] border-slate-300 focus:ring-[#0070f2]"
                        />
                        <span className="text-[15px] text-slate-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {hasGroundToGround === 'Yes' && (
                  <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                    <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-1.5">
                      Approximate Ground-to-Ground Interfaces Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={groundToGroundInterfaces === 0 ? '' : groundToGroundInterfaces}
                      onKeyDown={(e) => {
                        if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                      }}
                      onChange={(e) => setGroundToGroundInterfaces(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-12 text-[15px] font-normal border border-slate-300 rounded-lg px-4 bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none placeholder:text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                    <span className="text-[13px] text-slate-500 block">
                      Will help determine Edge Integration Cell requirements on SAP BTP.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card C: Technical Complexity Drivers */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <Settings className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                C. Technical Complexity Drivers
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  Overall Integration Mapping Complexity <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6">
                  {(['Simple', 'Moderate', 'Complex'] as const).map((lvl) => (
                    <label key={lvl} className="flex items-center space-x-2.5 cursor-pointer text-[15px] font-medium text-slate-700">
                      <input
                        type="radio"
                        name="pipoComp"
                        value={lvl}
                        checked={piPoComplexity === lvl}
                        onChange={() => setPiPoComplexity(lvl)}
                        className="w-5 h-5 text-[#0070f2]"
                      />
                      <span>{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  Custom Development &amp; Artifacts Present (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3 text-[14px] sm:text-[15px] text-slate-700">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input type="checkbox" checked={hasJavaMappings} onChange={(e) => setHasJavaMappings(e.target.checked)} className="w-5 h-5 rounded text-[#0070f2]" />
                    <span>Java Mappings</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input type="checkbox" checked={hasXsltMappings} onChange={(e) => setHasXsltMappings(e.target.checked)} className="w-5 h-5 rounded text-[#0070f2]" />
                    <span>XSLT Mappings</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input type="checkbox" checked={hasUdf} onChange={(e) => setHasUdf(e.target.checked)} className="w-5 h-5 rounded text-[#0070f2]" />
                    <span>User-Defined Functions (UDF)</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input type="checkbox" checked={hasCcBpm} onChange={(e) => setHasCcBpm(e.target.checked)} className="w-5 h-5 rounded text-[#0070f2]" />
                    <span>BPM / ccBPM Workflows</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer col-span-2">
                    <input type="checkbox" checked={hasCustomAdapterModules} onChange={(e) => setHasCustomAdapterModules(e.target.checked)} className="w-5 h-5 rounded text-[#0070f2]" />
                    <span>Custom Adapter Modules (EJB)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MULESOFT LANDSCAPE                                                     */}
      {/* ========================================================================= */}
      {platformId === 'mulesoft' && (
        <div className="space-y-8">
          {/* Card A: Landscape & API Footprint */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <Cpu className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                A. MuleSoft Architecture &amp; API Footprint
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Deployment Model <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={muleDeploymentModel}
                    onChange={(e) => setMuleDeploymentModel(e.target.value)}
                    className="w-full h-12 text-[15px] font-normal text-slate-800 border border-slate-300 rounded-lg px-4 pr-10 appearance-none bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none"
                  >
                    <option value="">Select Deployment Model</option>
                    <option value="CloudHub 1.0">CloudHub 1.0</option>
                    <option value="CloudHub 2.0">CloudHub 2.0</option>
                    <option value="Runtime Fabric (RTF)">Runtime Fabric (RTF)</option>
                    <option value="On-Premise Standalone">On-Premise Standalone</option>
                    <option value="Hybrid">Hybrid CloudHub + RTF</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Total Number of APIs <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    value={muleTotalApis === 0 ? '' : muleTotalApis}
                    onChange={(e) => setMuleTotalApis(parseInt(e.target.value) || 0)}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px]"
                    placeholder="e.g. 95"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    APIs
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Number of Applications <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    value={muleApplicationsCount === 0 ? '' : muleApplicationsCount}
                    onChange={(e) => setMuleApplicationsCount(parseInt(e.target.value) || 0)}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px]"
                    placeholder="e.g. 14"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    apps
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Total Mule Flows <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    value={muleFlowsCount === 0 ? '' : muleFlowsCount}
                    onChange={(e) => setMuleFlowsCount(parseInt(e.target.value) || 0)}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px]"
                    placeholder="e.g. 280"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    flows
                  </div>
                </div>
              </div>
            </div>

            {/* API-led Breakdown */}
            <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
              <span className="text-[14px] sm:text-[15px] font-bold text-blue-700 block">
                API-led Connectivity Classification (System, Process, Experience APIs)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-2">System APIs (Core data)</label>
                  <input
                    type="number"
                    value={muleSystemApis === 0 ? '' : muleSystemApis}
                    onChange={(e) => setMuleSystemApis(parseInt(e.target.value) || 0)}
                    className="w-full h-12 text-[15px] font-normal border border-slate-300 rounded-lg px-4 bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none placeholder:text-[15px]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-2">Process APIs (Business logic)</label>
                  <input
                    type="number"
                    value={muleProcessApis === 0 ? '' : muleProcessApis}
                    onChange={(e) => setMuleProcessApis(parseInt(e.target.value) || 0)}
                    className="w-full h-12 text-[15px] font-normal border border-slate-300 rounded-lg px-4 bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none placeholder:text-[15px]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-2">Experience APIs (Consumers)</label>
                  <input
                    type="number"
                    value={muleExperienceApis === 0 ? '' : muleExperienceApis}
                    onChange={(e) => setMuleExperienceApis(parseInt(e.target.value) || 0)}
                    className="w-full h-12 text-[15px] font-normal border border-slate-300 rounded-lg px-4 bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none placeholder:text-[15px]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Connectivity & Ecosystem */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <Network className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                B. Architecture, B2B &amp; On-Premise Dependencies
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  API-Led Architecture Adoption
                </label>
                <div className="flex space-x-5">
                  {(['Yes', 'Partial', 'No'] as const).map((opt) => (
                    <label key={opt} className="flex items-center space-x-2.5 cursor-pointer text-[15px] text-slate-700 font-medium">
                      <input
                        type="radio"
                        name="muleApiLed"
                        value={opt}
                        checked={muleApiLedUsage === opt}
                        onChange={() => setMuleApiLedUsage(opt)}
                        className="w-5 h-5 text-[#0070f2]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  B2B / EDI Partner Manager Usage
                </label>
                <div className="flex space-x-5">
                  {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                    <label key={opt} className="flex items-center space-x-2.5 cursor-pointer text-[15px] text-slate-700 font-medium">
                      <input
                        type="radio"
                        name="muleB2b"
                        value={opt}
                        checked={muleHasB2b === opt}
                        onChange={() => setMuleHasB2b(opt)}
                        className="w-5 h-5 text-[#0070f2]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  On-Premise Runtime / DLB Dependencies
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer text-[14px] sm:text-[15px] text-slate-700 mt-2">
                  <input
                    type="checkbox"
                    checked={muleHasOnPremDeps}
                    onChange={(e) => setMuleHasOnPremDeps(e.target.checked)}
                    className="w-5 h-5 rounded text-[#0070f2]"
                  />
                  <span>Has dedicated VPCs / DLBs / on-premise targets</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card C: Custom Artifacts & Complexity */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <Settings className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                C. MuleSoft Custom Logic &amp; Complexity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  Custom Connectors &amp; Policies Present
                </label>
                <div className="space-y-3 text-[14px] sm:text-[15px] text-slate-700">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={muleHasCustomConnectors}
                      onChange={(e) => setMuleHasCustomConnectors(e.target.checked)}
                      className="w-5 h-5 rounded text-[#0070f2]"
                    />
                    <span>Custom Java / XML Connectors (Mule SDK)</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={muleHasCustomPolicies}
                      onChange={(e) => setMuleHasCustomPolicies(e.target.checked)}
                      className="w-5 h-5 rounded text-[#0070f2]"
                    />
                    <span>Custom API Manager Gateway Policies</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  Overall Integration Complexity
                </label>
                <div className="flex space-x-6">
                  {(['Simple', 'Moderate', 'Complex'] as const).map((lvl) => (
                    <label key={lvl} className="flex items-center space-x-2.5 cursor-pointer text-[15px] font-medium text-slate-700">
                      <input
                        type="radio"
                        name="muleComp"
                        value={lvl}
                        checked={muleComplexity === lvl}
                        onChange={() => setMuleComplexity(lvl)}
                        className="w-5 h-5 text-[#0070f2]"
                      />
                      <span>{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SAP CPI (NEO) LANDSCAPE                                                */}
      {/* ========================================================================= */}
      {platformId === 'sap-neo' && (
        <div className="space-y-8">
          {/* Card A: Landscape */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <Layers className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                A. Current SAP CPI (Neo) Footprint
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Neo Environment Scope <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={neoScope}
                    onChange={(e) => setNeoScope(e.target.value)}
                    className="w-full h-12 text-[15px] font-normal text-slate-800 border border-slate-300 rounded-lg px-4 pr-10 appearance-none bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none"
                  >
                    <option value="">Select Neo Scope</option>
                    <option value="Single Tenant">Single Tenant</option>
                    <option value="Multi-Tenant">Multi-Tenant</option>
                    <option value="Multiple Global Subaccounts">Multiple Global Subaccounts</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Custom Integration Flows (iFlows) <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    value={neoFlowsCount === 0 ? '' : neoFlowsCount}
                    onChange={(e) => setNeoFlowsCount(parseInt(e.target.value) || 0)}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px]"
                    placeholder="e.g. 140"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    iFlows
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Connected Subaccounts / Apps <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    value={neoApplicationsCount === 0 ? '' : neoApplicationsCount}
                    onChange={(e) => setNeoApplicationsCount(parseInt(e.target.value) || 0)}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px]"
                    placeholder="e.g. 8"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    apps
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Monthly Message Volume <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    value={neoMonthlyMessageVol}
                    onChange={(e) => setNeoMonthlyMessageVol(e.target.value)}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px]"
                    placeholder="e.g. 450000"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    msg/mo
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Custom Scripts & Security Artifacts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <KeyRound className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                B. Scripts, Value Mappings &amp; Security Artifacts
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  Custom Development Level
                </label>
                <div className="flex space-x-6">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <label key={lvl} className="flex items-center space-x-2.5 cursor-pointer text-[15px] text-slate-700 font-medium">
                      <input
                        type="radio"
                        name="neoDev"
                        value={lvl}
                        checked={neoCustomDevLevel === lvl}
                        onChange={() => setNeoCustomDevLevel(lvl)}
                        className="w-5 h-5 text-[#0070f2]"
                      />
                      <span>{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  Artifacts Present for Migration
                </label>
                <div className="space-y-3 text-[14px] sm:text-[15px] text-slate-700">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={neoHasCustomScripts}
                      onChange={(e) => setNeoHasCustomScripts(e.target.checked)}
                      className="w-5 h-5 rounded text-[#0070f2]"
                    />
                    <span>Custom Groovy &amp; Java script collections</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={neoHasMappings}
                      onChange={(e) => setNeoHasMappings(e.target.checked)}
                      className="w-5 h-5 rounded text-[#0070f2]"
                    />
                    <span>Value Mappings &amp; Keystore Credentials</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={neoHasCustomAdapters}
                      onChange={(e) => setNeoHasCustomAdapters(e.target.checked)}
                      className="w-5 h-5 rounded text-[#0070f2]"
                    />
                    <span>Partner / Custom Adapters</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BOOMI LANDSCAPE                                                        */}
      {/* ========================================================================= */}
      {platformId === 'boomi' && (
        <div className="space-y-8">
          {/* Card A: Landscape */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <Workflow className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                A. Boomi AtomSphere Environment &amp; Processes
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Runtime Architecture <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={boomiOnPremDeps}
                    onChange={(e) => setBoomiOnPremDeps(e.target.value)}
                    className="w-full h-12 text-[15px] font-normal text-slate-800 border border-slate-300 rounded-lg px-4 pr-10 appearance-none bg-white focus:ring-2 focus:ring-[#0070f2] focus:outline-none"
                  >
                    <option value="">Select Runtime Architecture</option>
                    <option value="Cloud Atom only">Cloud Atom only</option>
                    <option value="Local On-prem Atoms">Local On-prem Atoms</option>
                    <option value="Molecule Clusters">Molecule Clusters (High-Availability)</option>
                    <option value="Hybrid">Hybrid Cloud &amp; On-prem</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Total Boomi Processes <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    value={boomiProcessCount === 0 ? '' : boomiProcessCount}
                    onChange={(e) => setBoomiProcessCount(parseInt(e.target.value) || 0)}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px]"
                    placeholder="e.g. 110"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    processes
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Connected Applications <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    value={boomiApplicationsCount === 0 ? '' : boomiApplicationsCount}
                    onChange={(e) => setBoomiApplicationsCount(parseInt(e.target.value) || 0)}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px]"
                    placeholder="e.g. 10"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    apps
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[14px] sm:text-[15px] font-semibold text-slate-800 mb-2 leading-[1.35] whitespace-normal">
                  Active Connectors <span className="text-red-500">*</span>
                </label>
                <div className="h-12 flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2] bg-white">
                  <input
                    type="number"
                    value={boomiConnectorsCount === 0 ? '' : boomiConnectorsCount}
                    onChange={(e) => setBoomiConnectorsCount(parseInt(e.target.value) || 0)}
                    className="w-full min-w-0 text-[15px] font-medium px-4 focus:outline-none bg-white text-slate-900 placeholder:text-[15px]"
                    placeholder="e.g. 18"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 sm:px-3.5 flex items-center text-[13px] sm:text-[14px] font-medium text-slate-600 shrink-0">
                    connectors
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Connectors & Custom Scripting */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3.5">
              <Puzzle className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0070f2]" />
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900">
                B. Connectors, B2B &amp; Map Scripting
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  B2B / EDI Trading Partner Management
                </label>
                <div className="flex space-x-5">
                  {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                    <label key={opt} className="flex items-center space-x-2.5 cursor-pointer text-[15px] text-slate-700 font-medium">
                      <input
                        type="radio"
                        name="boomiB2b"
                        value={opt}
                        checked={boomiHasB2b === opt}
                        onChange={() => setBoomiHasB2b(opt)}
                        className="w-5 h-5 text-[#0070f2]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  Custom Scripting (JavaScript / Groovy)
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer text-[14px] sm:text-[15px] text-slate-700 mt-2">
                  <input
                    type="checkbox"
                    checked={boomiHasCustomScripting}
                    onChange={(e) => setBoomiHasCustomScripting(e.target.checked)}
                    className="w-5 h-5 rounded text-[#0070f2]"
                  />
                  <span>Has custom scripts in Map Shapes or Data Process</span>
                </label>
              </div>

              <div>
                <label className="block text-[15px] sm:text-[16px] font-semibold text-slate-800 mb-3 leading-[1.4]">
                  Boomi Custom SDK Connectors
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer text-[14px] sm:text-[15px] text-slate-700 mt-2">
                  <input
                    type="checkbox"
                    checked={boomiCustomConnectorsCount > 0}
                    onChange={(e) => setBoomiCustomConnectorsCount(e.target.checked ? 3 : 0)}
                    className="w-5 h-5 rounded text-[#0070f2]"
                  />
                  <span>Has proprietary custom connectors ({boomiCustomConnectorsCount})</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matched Incture Migration Package Banner (Range / Package-Based Model) */}
      {currentScopeCount <= 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Incture Migration Package Matching
              </span>
              <span className="text-[13px] text-amber-600 font-semibold">Awaiting Scope Input</span>
            </div>
            <h3 className="text-[17px] sm:text-[18px] font-bold text-slate-900">
              Enter interface &amp; application scope above to match an Incture package tier
            </h3>
            <p className="text-[14px] text-slate-600">
              The matching Incture migration package, indicative cost, and timeline will automatically appear here once you enter your scope.
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-[13px] text-slate-600">
            Current Scope: <span className="text-slate-900 font-bold font-mono">0 Interfaces</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-blue-200/80 p-7 sm:p-8 shadow-xs relative overflow-hidden space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-slate-100 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Incture Migration Package Matching
                </span>
                <span className="text-[13px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  Package Range Match
                </span>
              </div>
              <h3 className="text-[19px] sm:text-[20px] font-bold text-slate-900 flex items-center gap-2">
                Applicable Package: <span className="text-blue-700 font-black">{matchedResult.package.name}</span>
              </h3>
              <p className="text-[14px] text-slate-600 max-w-2xl leading-relaxed">
                {matchedResult.suitabilityNote} Indicative pricing &amp; timeline are fixed directly from Incture migration offering data.
              </p>
            </div>

            <div className="flex items-center gap-5 bg-slate-50 px-6 py-3.5 rounded-xl border border-slate-200 shrink-0">
              <div>
                <span className="text-[12px] uppercase font-bold text-slate-500 block">Indicative Cost</span>
                <span className="text-2xl font-black font-mono text-emerald-600">
                  ${matchedResult.package.price.toLocaleString()}
                </span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <span className="text-[12px] uppercase font-bold text-slate-500 block">Indicative Timeline</span>
                <span className="text-2xl font-black font-mono text-slate-900">
                  {matchedResult.package.timelineMonths}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
              <span className="text-blue-700 text-[13px] block font-bold">Delivery Team</span>
              <span className="text-slate-800 font-medium">{matchedResult.package.team}</span>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
              <span className="text-blue-700 text-[13px] block font-bold">Hypercare Support</span>
              <span className="text-slate-800 font-medium">{matchedResult.package.hypercare} included</span>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 flex items-center gap-3">
              <img src="/images/intswitch-logo.png" alt="IntSwitch" className="h-6 w-auto object-contain shrink-0" />
              <div>
                <span className="text-blue-700 text-[13px] block font-bold">IntSwitch Integration</span>
                <span className="text-slate-700 text-[13px] font-medium">Internal Accelerator for migration &amp; test quality</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-[#d9e2ec]">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 h-12 text-[15px] font-semibold text-[#556b82] bg-white border border-[#d9e2ec] rounded-lg hover:bg-slate-50 hover:text-[#1d2d3e] transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#556b82]" fill="none" viewBox="0 0 16 16" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 12.5l-4.5-4.5 4.5-4.5" />
          </svg>
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-8 py-2.5 h-12 text-[15px] font-semibold text-white bg-[#0070f2] hover:bg-[#0057d2] rounded-lg shadow-xs transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
        >
          <span>Continue</span>
          <svg className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 3.5l4.5 4.5-4.5 4.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};
