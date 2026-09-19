import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileName = (formData.get('fileName') as string) || 'ValueLens_Executive_ROI_Report.pdf';
    const pdfBase64 = formData.get('pdfBase64') as string;

    if (!pdfBase64) {
      return new NextResponse('Missing PDF data', { status: 400 });
    }

    // Strip data URI scheme prefix if present
    let cleanBase64 = pdfBase64;
    const base64Marker = ';base64,';
    const markerIndex = cleanBase64.indexOf(base64Marker);
    if (markerIndex !== -1) {
      cleanBase64 = cleanBase64.substring(markerIndex + base64Marker.length);
    } else if (cleanBase64.startsWith('data:application/pdf,')) {
      cleanBase64 = cleanBase64.substring('data:application/pdf,'.length);
    }
    cleanBase64 = cleanBase64.replace(/\s/g, '');

    const buffer = Buffer.from(cleanBase64, 'base64');

    // Return with native Content-Disposition header so Chrome/Edge download engine
    // ALWAYS preserves the .pdf extension and proper filename without blob UUID fallback
    return new NextResponse(new Uint8Array(buffer) as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (err: any) {
    console.error('Error serving PDF download:', err);
    return new NextResponse(err?.message || 'Download error', { status: 500 });
  }
}
