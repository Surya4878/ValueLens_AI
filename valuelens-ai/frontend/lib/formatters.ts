export function formatCurrency(value: number | undefined | null, currency: string = 'USD'): string {
  if (value === undefined || value === null) return '$0.00';
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';
  return `${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatCompactCurrency(value: number | undefined | null, currency: string = 'USD'): string {
  if (value === undefined || value === null) return '$0';
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';
  
  if (Math.abs(value) >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(0)}K`;
  }
  return `${symbol}${value.toFixed(0)}`;
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null) return '0.00%';
  return `${value.toFixed(2)}%`;
}

export function formatMonths(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'Not reached';
  return `${value.toFixed(1)} months`;
}
