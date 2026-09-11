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
import { PlatformId, PlatformConfig } from '@/data/platformAssessmentConfig';

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
  // PI/PO state
  const [piPoVersion, setPiPoVersion] = React.useState<string>('PO 7.5');
  const [piPoInterfacesCount, setPiPoInterfacesCountState] = React.useState<number>(
    assessment.sourceSystem.environmentAssessment.totalInterfaces || 1250
  );
  const [piPoApplicationsCount, setPiPoApplicationsCount] = React.useState<number>(15);
  const [sapBackendSystem, setSapBackendSystem] = React.useState<string>('SAP ECC');
  const [hasB2bIntegrations, setHasB2bIntegrations] = React.useState<'Yes' | 'No' | 'Not sure'>('Yes');
  const [b2bStandards, setB2bStandards] = React.useState<string[]>([
    'EDIFACT',
    'ANSI X12',
    'XML / cXML',
  ]);
  const [b2bProtocols, setB2bProtocols] = React.useState<string[]>([
    'AS2',
    'SFTP',
    'HTTPS / REST',
  ]);
  const [ediDocumentTypes, setEdiDocumentTypes] = React.useState<string[]>([
    'ORDERS — Purchase Order',
    'INVOIC — Invoice',
    'ORDRSP — Order Response',
  ]);
  const [b2bInterfacesCount, setB2bInterfacesCount] = React.useState<number>(
    assessment.sourceSystem.volumetrics.b2bInterfaces || 85
  );
  const [hasGroundToGround, setHasGroundToGround] = React.useState<'Yes' | 'No' | 'Not sure'>('Yes');
  const [groundToGroundInterfaces, setGroundToGroundInterfaces] = React.useState<number>(310);
  const [piPoComplexity, setPiPoComplexity] = React.useState<'Simple' | 'Moderate' | 'Complex'>('Moderate');
  const [hasJavaMappings, setHasJavaMappings] = React.useState<boolean>(true);
  const [hasXsltMappings, setHasXsltMappings] = React.useState<boolean>(true);
  const [hasUdf, setHasUdf] = React.useState<boolean>(true);
  const [hasCcBpm, setHasCcBpm] = React.useState<boolean>(false);
  const [hasCustomAdapterModules, setHasCustomAdapterModules] = React.useState<boolean>(true);

  // MuleSoft state
  const [muleDeploymentModel, setMuleDeploymentModel] = React.useState<string>('CloudHub 2.0');
  const [muleTotalApis, setMuleTotalApis] = React.useState<number>(45);
  const [muleSystemApis, setMuleSystemApis] = React.useState<number>(20);
  const [muleProcessApis, setMuleProcessApis] = React.useState<number>(15);
  const [muleExperienceApis, setMuleExperienceApis] = React.useState<number>(10);
  const [muleApplicationsCount, setMuleApplicationsCount] = React.useState<number>(12);
  const [muleFlowsCount, setMuleFlowsCount] = React.useState<number>(180);
  const [muleApiLedUsage, setMuleApiLedUsage] = React.useState<'Yes' | 'Partial' | 'No'>('Yes');
  const [muleHasB2b, setMuleHasB2b] = React.useState<'Yes' | 'No' | 'Not sure'>('Yes');
  const [muleTradingPartnersCount, setMuleTradingPartnersCount] = React.useState<number>(25);
  const [muleHasCustomConnectors, setMuleHasCustomConnectors] = React.useState<boolean>(true);
  const [muleHasCustomPolicies, setMuleHasCustomPolicies] = React.useState<boolean>(true);
  const [muleHasOnPremDeps, setMuleHasOnPremDeps] = React.useState<boolean>(true);
  const [muleComplexity, setMuleComplexity] = React.useState<'Simple' | 'Moderate' | 'Complex'>('Moderate');

  // SAP CPI (Neo) state
  const [neoFlowsCount, setNeoFlowsCount] = React.useState<number>(65);
  const [neoApplicationsCount, setNeoApplicationsCount] = React.useState<number>(8);
  const [neoMonthlyMessageVol, setNeoMonthlyMessageVol] = React.useState<string>('250000');
  const [neoComplexity, setNeoComplexity] = React.useState<'Simple' | 'Moderate' | 'Complex'>('Moderate');
  const [neoHasCustomScripts, setNeoHasCustomScripts] = React.useState<boolean>(true);
  const [neoHasMappings, setNeoHasMappings] = React.useState<boolean>(true);
  const [neoHasCustomAdapters, setNeoHasCustomAdapters] = React.useState<boolean>(false);
  const [neoHasB2b, setNeoHasB2b] = React.useState<'Yes' | 'No' | 'Not sure'>('No');
  const [neoCustomDevLevel, setNeoCustomDevLevel] = React.useState<'Low' | 'Medium' | 'High'>('Medium');
  const [neoScope, setNeoScope] = React.useState<string>('Single Tenant Multi-Package');

  // Boomi state
  const [boomiProcessCount, setBoomiProcessCount] = React.useState<number>(110);
  const [boomiApplicationsCount, setBoomiApplicationsCount] = React.useState<number>(10);
  const [boomiConnectorsCount, setBoomiConnectorsCount] = React.useState<number>(35);
  const [boomiCustomConnectorsCount, setBoomiCustomConnectorsCount] = React.useState<number>(4);
  const [boomiHasB2b, setBoomiHasB2b] = React.useState<'Yes' | 'No' | 'Not sure'>('Yes');
  const [boomiTradingPartnersCount, setBoomiTradingPartnersCount] = React.useState<number>(18);
  const [boomiHasCustomLogic, setBoomiHasCustomLogic] = React.useState<boolean>(true);
  const [boomiHasCustomScripting, setBoomiHasCustomScripting] = React.useState<boolean>(true);
  const [boomiMappingComplexity, setBoomiMappingComplexity] = React.useState<'Simple' | 'Moderate' | 'Complex'>('Moderate');
  const [boomiOnPremDeps, setBoomiOnPremDeps] = React.useState<string>('Local Atom Runtime');

  const setPiPoInterfacesCount = (val: number) => {
    setPiPoInterfacesCountState(val);
    const simple = Math.round(val * 0.76);
    const medium = Math.round(val * 0.19);
    const complex = Math.max(0, val - simple - medium);
    let volume = 'Medium';
    if (val < 200) volume = 'Low';
    else if (val > 1000) volume = 'High';

    onUpdateAssessment({
      ...assessment,
      sourceSystem: {
        ...assessment.sourceSystem,
        environmentAssessment: {
          ...assessment.sourceSystem.environmentAssessment,
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
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          STEP 2 OF 7
        </span>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          {config.step2Title}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {config.step2Description}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. SAP PI/PO LANDSCAPE                                                    */}
      {/* ========================================================================= */}
      {platformId === 'sap-pipo' && (
        <div className="space-y-6">
          {/* Card A: Landscape */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                A. Current PI/PO Landscape
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Q1: Version */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  1. PI/PO Version <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={piPoVersion}
                    onChange={(e) => setPiPoVersion(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="PI 7.0">PI 7.0</option>
                    <option value="PI 7.1">PI 7.1</option>
                    <option value="PI 7.3">PI 7.3</option>
                    <option value="PI 7.4">PI 7.4</option>
                    <option value="PO 7.4">PO 7.4</option>
                    <option value="PO 7.5">PO 7.5</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Q2: Interface Count */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  2. Number of Interfaces <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={piPoInterfacesCount}
                    onChange={(e) => setPiPoInterfacesCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="1250"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    interfaces
                  </div>
                </div>
              </div>

              {/* Q3: Applications Count */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  3. Connected Applications <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={piPoApplicationsCount}
                    onChange={(e) => setPiPoApplicationsCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="12"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    apps
                  </div>
                </div>
              </div>

              {/* Q4: Backend System */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  4. Connected SAP Backend <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={sapBackendSystem}
                    onChange={(e) => setSapBackendSystem(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="SAP ECC">SAP ECC</option>
                    <option value="SAP S/4HANA">SAP S/4HANA</option>
                    <option value="Both ECC and S/4HANA">Both ECC and S/4HANA</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card B: B2B/EDI & Ground-to-ground */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <Share2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                B. Integration Characteristics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* B2B/EDI */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-2">
                    Do you use B2B / EDI integrations in SAP PI/PO? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-5">
                    {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="pipoB2b"
                          value={opt}
                          checked={hasB2bIntegrations === opt}
                          onChange={() => setHasB2bIntegrations(opt)}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs text-slate-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {hasB2bIntegrations === 'Yes' && (
                  <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3">
                    <span className="text-xs font-bold text-blue-700 block">
                      B2B / EDI Standards &amp; Protocols (Select all that apply)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['EDIFACT', 'ANSI X12', 'EANCOM', 'TRADACOMS', 'Odette', 'VDA', 'AS2', 'SFTP', 'Other'].map((std) => (
                        <label key={std} className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700">
                          <input
                            type="checkbox"
                            checked={b2bStandards.includes(std)}
                            onChange={() => toggleArrayItem(b2bStandards, setB2bStandards, std)}
                            className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300"
                          />
                          <span>{std}</span>
                        </label>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Approximate B2B Interfaces Count
                      </label>
                      <input
                        type="number"
                        value={b2bInterfacesCount}
                        onChange={(e) => setB2bInterfacesCount(parseInt(e.target.value) || 0)}
                        className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                        placeholder="85"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Ground-to-ground */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-2">
                    Do you have ground-to-ground (on-prem-to-on-prem) integrations? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-5">
                    {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="pipoGround"
                          value={opt}
                          checked={hasGroundToGround === opt}
                          onChange={() => setHasGroundToGround(opt)}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs text-slate-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {hasGroundToGround === 'Yes' && (
                  <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Approximate Ground-to-Ground Interfaces Count
                    </label>
                    <input
                      type="number"
                      value={groundToGroundInterfaces}
                      onChange={(e) => setGroundToGroundInterfaces(parseInt(e.target.value) || 0)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                      placeholder="310"
                    />
                    <span className="text-[11px] text-slate-500 block">
                      Will help determine Edge Integration Cell requirements on SAP BTP.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card C: Technical Complexity Drivers */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                C. Technical Complexity Drivers
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Overall Integration Mapping Complexity <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  {(['Simple', 'Moderate', 'Complex'] as const).map((lvl) => (
                    <label key={lvl} className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="radio"
                        name="pipoComp"
                        value={lvl}
                        checked={piPoComplexity === lvl}
                        onChange={() => setPiPoComplexity(lvl)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Custom Development &amp; Artifacts Present (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={hasJavaMappings} onChange={(e) => setHasJavaMappings(e.target.checked)} className="rounded text-blue-600" />
                    <span>Java Mappings</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={hasXsltMappings} onChange={(e) => setHasXsltMappings(e.target.checked)} className="rounded text-blue-600" />
                    <span>XSLT Mappings</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={hasUdf} onChange={(e) => setHasUdf(e.target.checked)} className="rounded text-blue-600" />
                    <span>User-Defined Functions (UDF)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={hasCcBpm} onChange={(e) => setHasCcBpm(e.target.checked)} className="rounded text-blue-600" />
                    <span>BPM / ccBPM Workflows</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer col-span-2">
                    <input type="checkbox" checked={hasCustomAdapterModules} onChange={(e) => setHasCustomAdapterModules(e.target.checked)} className="rounded text-blue-600" />
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
        <div className="space-y-6">
          {/* Card A: Landscape & API Footprint */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <Cpu className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                A. MuleSoft Architecture &amp; API Footprint
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Deployment Model <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={muleDeploymentModel}
                    onChange={(e) => setMuleDeploymentModel(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="CloudHub 1.0">CloudHub 1.0</option>
                    <option value="CloudHub 2.0">CloudHub 2.0</option>
                    <option value="Runtime Fabric (RTF)">Runtime Fabric (RTF)</option>
                    <option value="On-Premise Standalone">On-Premise Standalone</option>
                    <option value="Hybrid">Hybrid CloudHub + RTF</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Total Number of APIs <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={muleTotalApis}
                    onChange={(e) => setMuleTotalApis(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="95"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    APIs
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Number of Applications <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={muleApplicationsCount}
                    onChange={(e) => setMuleApplicationsCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="14"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    apps
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Total Mule Flows <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={muleFlowsCount}
                    onChange={(e) => setMuleFlowsCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="280"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    flows
                  </div>
                </div>
              </div>
            </div>

            {/* API-led Breakdown */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-blue-700 block">
                API-led Connectivity Classification (System, Process, Experience APIs)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">System APIs (Core data)</label>
                  <input
                    type="number"
                    value={muleSystemApis}
                    onChange={(e) => setMuleSystemApis(parseInt(e.target.value) || 0)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Process APIs (Business logic)</label>
                  <input
                    type="number"
                    value={muleProcessApis}
                    onChange={(e) => setMuleProcessApis(parseInt(e.target.value) || 0)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Experience APIs (Consumers)</label>
                  <input
                    type="number"
                    value={muleExperienceApis}
                    onChange={(e) => setMuleExperienceApis(parseInt(e.target.value) || 0)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Connectivity & Ecosystem */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <Network className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                B. Architecture, B2B &amp; On-Premise Dependencies
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  API-Led Architecture Adoption
                </label>
                <div className="flex space-x-4">
                  {(['Yes', 'Partial', 'No'] as const).map((opt) => (
                    <label key={opt} className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="radio"
                        name="muleApiLed"
                        value={opt}
                        checked={muleApiLedUsage === opt}
                        onChange={() => setMuleApiLedUsage(opt)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  B2B / EDI Partner Manager Usage
                </label>
                <div className="flex space-x-4">
                  {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                    <label key={opt} className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="radio"
                        name="muleB2b"
                        value={opt}
                        checked={muleHasB2b === opt}
                        onChange={() => setMuleHasB2b(opt)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  On-Premise Runtime / DLB Dependencies
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700 mt-2">
                  <input
                    type="checkbox"
                    checked={muleHasOnPremDeps}
                    onChange={(e) => setMuleHasOnPremDeps(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Has dedicated VPCs / DLBs / on-premise targets</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card C: Custom Artifacts & Complexity */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                C. MuleSoft Custom Logic &amp; Complexity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Custom Connectors &amp; Policies Present
                </label>
                <div className="space-y-2 text-xs text-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={muleHasCustomConnectors}
                      onChange={(e) => setMuleHasCustomConnectors(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Custom Java / XML Connectors (Mule SDK)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={muleHasCustomPolicies}
                      onChange={(e) => setMuleHasCustomPolicies(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Custom API Manager Gateway Policies</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Overall Integration Complexity
                </label>
                <div className="flex space-x-4">
                  {(['Simple', 'Moderate', 'Complex'] as const).map((lvl) => (
                    <label key={lvl} className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="radio"
                        name="muleComp"
                        value={lvl}
                        checked={muleComplexity === lvl}
                        onChange={() => setMuleComplexity(lvl)}
                        className="w-4 h-4 text-blue-600"
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
        <div className="space-y-6">
          {/* Card A: Landscape */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                A. Current SAP CPI (Neo) Footprint
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Neo Environment Scope <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={neoScope}
                    onChange={(e) => setNeoScope(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Single Tenant">Single Tenant</option>
                    <option value="Multi-Tenant">Multi-Tenant</option>
                    <option value="Multiple Global Subaccounts">Multiple Global Subaccounts</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Custom Integration Flows (iFlows) <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={neoFlowsCount}
                    onChange={(e) => setNeoFlowsCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="140"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    iFlows
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Connected Subaccounts / Apps <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={neoApplicationsCount}
                    onChange={(e) => setNeoApplicationsCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="8"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    apps
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Monthly Message Volume <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={neoMonthlyMessageVol}
                    onChange={(e) => setNeoMonthlyMessageVol(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="450000"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    msg/mo
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Custom Scripts & Security Artifacts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                B. Scripts, Value Mappings &amp; Security Artifacts
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Custom Development Level
                </label>
                <div className="flex space-x-4">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <label key={lvl} className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="radio"
                        name="neoDev"
                        value={lvl}
                        checked={neoCustomDevLevel === lvl}
                        onChange={() => setNeoCustomDevLevel(lvl)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Artifacts Present for Migration
                </label>
                <div className="space-y-2 text-xs text-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={neoHasCustomScripts}
                      onChange={(e) => setNeoHasCustomScripts(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Custom Groovy &amp; Java script collections</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={neoHasMappings}
                      onChange={(e) => setNeoHasMappings(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Value Mappings &amp; Keystore Credentials</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={neoHasCustomAdapters}
                      onChange={(e) => setNeoHasCustomAdapters(e.target.checked)}
                      className="rounded text-blue-600"
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
        <div className="space-y-6">
          {/* Card A: Landscape */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <Workflow className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                A. Boomi AtomSphere Environment &amp; Processes
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Runtime Architecture <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={boomiOnPremDeps}
                    onChange={(e) => setBoomiOnPremDeps(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Cloud Atom only">Cloud Atom only</option>
                    <option value="Local On-prem Atoms">Local On-prem Atoms</option>
                    <option value="Molecule Clusters">Molecule Clusters (High-Availability)</option>
                    <option value="Hybrid">Hybrid Cloud &amp; On-prem</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Total Boomi Processes <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={boomiProcessCount}
                    onChange={(e) => setBoomiProcessCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="110"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    processes
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Connected Applications <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={boomiApplicationsCount}
                    onChange={(e) => setBoomiApplicationsCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="10"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    apps
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Active Connectors <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="number"
                    value={boomiConnectorsCount}
                    onChange={(e) => setBoomiConnectorsCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3 py-2.5 focus:outline-none bg-white text-slate-900"
                    placeholder="18"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-3 flex items-center text-xs text-slate-500">
                    connectors
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Connectors & Custom Scripting */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <Puzzle className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                B. Connectors, B2B &amp; Map Scripting
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  B2B / EDI Trading Partner Management
                </label>
                <div className="flex space-x-4">
                  {(['Yes', 'No', 'Not sure'] as const).map((opt) => (
                    <label key={opt} className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="radio"
                        name="boomiB2b"
                        value={opt}
                        checked={boomiHasB2b === opt}
                        onChange={() => setBoomiHasB2b(opt)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Custom Scripting (JavaScript / Groovy)
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700 mt-2">
                  <input
                    type="checkbox"
                    checked={boomiHasCustomScripting}
                    onChange={(e) => setBoomiHasCustomScripting(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Has custom scripts in Map Shapes or Data Process</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Boomi Custom SDK Connectors
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700 mt-2">
                  <input
                    type="checkbox"
                    checked={boomiCustomConnectorsCount > 0}
                    onChange={(e) => setBoomiCustomConnectorsCount(e.target.checked ? 3 : 0)}
                    className="rounded text-blue-600"
                  />
                  <span>Has proprietary custom connectors ({boomiCustomConnectorsCount})</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <span>← Back</span>
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5"
        >
          <span>Continue →</span>
        </button>
      </div>
    </div>
  );
};
