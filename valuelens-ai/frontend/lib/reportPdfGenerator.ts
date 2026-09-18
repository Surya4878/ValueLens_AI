import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Assessment, RoiCalculationResult } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface GeneratePdfOptions {
  assessment: Assessment | null;
  calculations: RoiCalculationResult | null;
  currentTco: number;
  targetTco: number;
  annualSavings: number;
  savingsPct: number;
  migrationCost: number;
  breakEvenMonths: number;
  fiveYearRoi: number;
  fiveYearNetBenefit: number;
  currency: string;
  sourcePlatform: string;
  packageName: string;
  cleanTimeline: string;
  timelineData: Array<{
    year: number;
    baselineSpend: number;
    btpRunCost: number;
    cumulativeSavings: number;
    migrationCapex: number;
    netBenefit: number;
    roi: number;
  }>;
}

export function generateExecutiveReportPdf(options: GeneratePdfOptions) {
  const {
    currentTco,
    targetTco,
    annualSavings,
    savingsPct,
    migrationCost,
    breakEvenMonths,
    fiveYearRoi,
    fiveYearNetBenefit,
    currency = 'USD',
    sourcePlatform = 'SAP PI/PO',
    packageName = 'Silver Package',
    cleanTimeline = '4 Months',
    timelineData = [],
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryBlue = [0, 112, 242]; // #0070f2
  const darkNavy = [29, 45, 62]; // #1d2d3e
  const textMuted = [85, 107, 130]; // #556b82
  const successGreen = [16, 126, 62]; // #107e3e
  const borderGray = [217, 226, 236]; // #d9e2ec
  const bgLight = [245, 247, 250];

  let y = margin;

  // 1. Top Header Banner
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(margin, y, contentWidth, 68, 8, 8, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, y, contentWidth, 68, 8, 8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('Incture', margin + 18, y + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('|  Business ValueLens AI', margin + 74, y + 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('EXECUTIVE INVESTMENT DOSSIER & ROI ASSESSMENT', margin + 18, y + 50);

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Generated: ${dateStr}`, pageWidth - margin - 18, y + 28, { align: 'right' });
  doc.text('Confidence Level: Audit-Grade', pageWidth - margin - 18, y + 46, { align: 'right' });

  y += 88;

  // 2. Migration Scope Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`Migration: ${sourcePlatform} to SAP BTP Integration Suite`, margin, y);

  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    `Comprehensive economic analysis, TCO transformation model, and 5-year break-even payback projection.`,
    margin,
    y
  );

  y += 24;

  // 3. 6 Key Financial Metrics Cards (3 columns x 2 rows)
  const cardWidth = (contentWidth - 20) / 3;
  const cardHeight = 58;
  const metrics = [
    {
      label: `Current ${sourcePlatform} TCO`,
      value: formatCurrency(currentTco, currency),
      sub: 'Annual baseline spend',
      color: darkNavy,
    },
    {
      label: 'Target BTP TCO',
      value: formatCurrency(targetTco, currency),
      sub: 'Standard Edition run-rate',
      color: primaryBlue,
    },
    {
      label: 'Annual Run-Rate Savings',
      value: `+${formatCurrency(annualSavings, currency)}`,
      sub: `${savingsPct.toFixed(1)}% cost reduction`,
      color: successGreen,
    },
    {
      label: 'Migration Investment',
      value: formatCurrency(migrationCost, currency),
      sub: `Incture ${packageName} (${cleanTimeline})`,
      color: darkNavy,
    },
    {
      label: 'Payback Period',
      value: `${breakEvenMonths.toFixed(1)} Months`,
      sub: breakEvenMonths <= 12 ? '100% payback in Year 1' : 'Multi-year payback',
      color: primaryBlue,
    },
    {
      label: '5-Year Cumulative ROI',
      value: `${fiveYearRoi.toFixed(1)}%`,
      sub: `Net: ${formatCurrency(fiveYearNetBenefit, currency)}`,
      color: [138, 63, 252],
    },
  ];

  metrics.forEach((m, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const cx = margin + col * (cardWidth + 10);
    const cy = y + row * (cardHeight + 10);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.roundedRect(cx, cy, cardWidth, cardHeight, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(m.label.toUpperCase(), cx + 10, cy + 15);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.value, cx + 10, cy + 33);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(m.sub, cx + 10, cy + 47);
  });

  y += (cardHeight + 10) * 2 + 15;

  // 4. Five-Year Financial Projection Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('5-Year Cash Flow & Value Realization Projection', margin, y);

  const tableBody = timelineData.map((row) => [
    `Year ${row.year}`,
    formatCurrency(row.baselineSpend, currency),
    formatCurrency(row.btpRunCost, currency),
    `+${formatCurrency(row.baselineSpend - row.btpRunCost, currency)}`,
    row.migrationCapex > 0 ? formatCurrency(row.migrationCapex, currency) : '$0',
    formatCurrency(row.netBenefit, currency),
    `${row.roi.toFixed(1)}%`,
  ]);

  autoTable(doc, {
    startY: y + 8,
    margin: { left: margin, right: margin },
    head: [
      [
        'Timeline',
        'Current Baseline',
        'BTP Run Cost',
        'Gross Savings',
        'Migration Capex',
        'Cumulative Net Benefit',
        'ROI %',
      ],
    ],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 112, 242],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [29, 45, 62],
      halign: 'right',
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold' },
      5: { fontStyle: 'bold', textColor: [16, 126, 62] },
      6: { fontStyle: 'bold', textColor: [0, 112, 242] },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || y + 160;
  y = finalY + 20;

  // 5. Implementation Scope & IntSwitch Automation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Migration Scope & Incture Packaged Delivery', margin, y);

  y += 10;

  const scopeColumns = [
    {
      title: 'Development & Conversion (60%)',
      desc: 'Interface mapping, Groovy script conversion, and standard API connectivity.',
      cost: formatCurrency(migrationCost * 0.6, currency),
    },
    {
      title: 'QA & Automated Testing (20%)',
      desc: 'Functional validation, payload comparison, and cutover regression testing.',
      cost: formatCurrency(migrationCost * 0.2, currency),
    },
    {
      title: 'Architecture & Basis (10%)',
      desc: 'Cloud Connector configuration, CTMS routes, and security role setup.',
      cost: formatCurrency(migrationCost * 0.1, currency),
    },
    {
      title: 'PM & Hypercare (10%)',
      desc: 'Cutover governance, stakeholder sign-offs, and 30-day post-go-live support.',
      cost: formatCurrency(migrationCost * 0.1, currency),
    },
  ];

  const scopeWidth = (contentWidth - 15) / 2;
  const scopeHeight = 52;

  scopeColumns.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const sx = margin + col * (scopeWidth + 15);
    const sy = y + row * (scopeHeight + 8);

    doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.roundedRect(sx, sy, scopeWidth, scopeHeight, 5, 5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(item.title, sx + 8, sy + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.text(item.cost, sx + scopeWidth - 8, sy + 14, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(item.desc, sx + 8, sy + 28, { maxWidth: scopeWidth - 16 });
  });

  y += (scopeHeight + 8) * 2 + 15;

  // 6. Strategic Executive Recommendation Callout
  doc.setFillColor(238, 245, 252);
  doc.setDrawColor(187, 222, 251);
  doc.roundedRect(margin, y, contentWidth, 54, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('EXECUTIVE DECISION RECOMMENDATION:', margin + 12, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const recText =
    currentTco > 0
      ? `The business case demonstrates a strong payback horizon of ${breakEvenMonths.toFixed(
          1
        )} months, reducing annual operating costs from ${formatCurrency(
          currentTco,
          currency
        )} to ${formatCurrency(targetTco, currency)}. Total 5-year net economic value delivered is projected at ${formatCurrency(
          fiveYearNetBenefit,
          currency
        )}. Immediate migration wave planning is recommended.`
      : 'Assessment parameters have been initialized. Complete the 7-step ValueLens questionnaire to unlock verified architectural sizing, vendor negotiations, and board investment dossier.';

  doc.text(recText, margin + 12, y + 30, { maxWidth: contentWidth - 24 });

  // 7. Footer on Page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      'Incture Technologies • Business ValueLens AI • Powered by IntSwitch Migration Accelerator',
      margin,
      pageHeight - 20
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  }

  // Download directly
  const safeId = options.assessment?.id || 'assessment';
  doc.save(`ValueLens_AI_Executive_ROI_Report_${safeId}.pdf`);
}
