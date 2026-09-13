import { DecisionType, PriorityLevel, RiskSeverity, ValueOrigin } from '@/types';

export const designTokens = {
  origins: {
    USER_PROVIDED: {
      label: 'User Provided',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
    },
    CALCULATED: {
      label: 'Deterministic Fact',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    DERIVED: {
      label: 'Derived Metric',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    ESTIMATED: {
      label: 'Estimate',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    CATALOG: {
      label: 'Catalog Price',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
    },
    AI_INTERPRETED: {
      label: 'AI Advisory',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
  },

  decisions: {
    STRONGLY_FAVORABLE: {
      label: 'Highly Recommended',
      bg: 'bg-emerald-600',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-white',
      lightText: 'text-emerald-800',
      description: 'Exceptional financial payback with low execution risk profile.',
    },
    FAVORABLE: {
      label: 'Recommended',
      bg: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-white',
      lightText: 'text-emerald-800',
      description: 'The business case is financially attractive and investment is recovered swiftly.',
    },
    CONDITIONALLY_FAVORABLE: {
      label: 'Conditional Fit',
      bg: 'bg-blue-600',
      lightBg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-white',
      lightText: 'text-blue-800',
      description: 'Viable business case dependent on validation of key consumption and development assumptions.',
    },
    NEUTRAL: {
      label: 'Neutral',
      bg: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-white',
      lightText: 'text-amber-800',
      description: 'Savings closely balance migration investment with prolonged payback horizon.',
    },
    UNFAVORABLE: {
      label: 'Unfavorable',
      bg: 'bg-red-600',
      lightBg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-white',
      lightText: 'text-red-800',
      description: 'Negative economic trajectory or prolonged payback under current assumptions.',
    },
    INSUFFICIENT_DATA: {
      label: 'Insufficient Data',
      bg: 'bg-slate-500',
      lightBg: 'bg-slate-50',
      border: 'border-slate-300',
      text: 'text-white',
      lightText: 'text-slate-800',
      description: 'Key cost categories require completion before authoritative recommendation.',
    },
  },

  risks: {
    CRITICAL: {
      badge: 'bg-red-100 text-red-800 border-red-200',
      iconColor: 'text-red-600',
    },
    HIGH: {
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      iconColor: 'text-orange-600',
    },
    MEDIUM: {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      iconColor: 'text-amber-600',
    },
    LOW: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconColor: 'text-emerald-600',
    },
  },

  priorities: {
    HIGH: 'bg-red-50 text-red-700 border-red-200 font-semibold',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
    LOW: 'bg-slate-50 text-slate-700 border-slate-200',
  }
};
