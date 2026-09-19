import { NextRequest, NextResponse } from 'next/server';

// Global cache for short-lived PDF download tokens (2 minutes TTL)
declare global {
  var __valuelensPdfCache: Map<string, { buffer: Buffer; filename: string; timestamp: number }> | undefined;
}

if (!globalThis.__valuelensPdfCache) {
  globalThis.__valuelensPdfCache = new Map();
}
const pdfCache = globalThis.__valuelensPdfCache;

// Periodic cleanup of expired tokens
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, item] of pdfCache.entries()) {
      if (now - item.timestamp > 120000) {
        pdfCache.delete(key);
      }
    }
  }, 60000);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const body = await req.json();
    const pdfBase64 = body.pdfBase64;
    if (!pdfBase64) {
      return NextResponse.json({ error: 'Missing pdfBase64' }, { status: 400 });
    }

    const base64Marker = ';base64,';
    const markerIndex = pdfBase64.indexOf(base64Marker);
    const rawBase64 = markerIndex !== -1 ? pdfBase64.substring(markerIndex + base64Marker.length) : pdfBase64;
    const cleanBase64 = rawBase64.replace(/\s/g, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const token = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const filename = decodeURIComponent(params.filename || 'ValueLens_Report.pdf');

    pdfCache.set(token, {
      buffer,
      filename,
      timestamp: Date.now(),
    });

    const downloadUrl = `/api/download/${encodeURIComponent(filename)}?token=${token}`;

    return NextResponse.json({
      success: true,
      token,
      downloadUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to stage PDF' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token || !pdfCache.has(token)) {
      return new NextResponse('Download link expired or invalid. Please click Download PDF again.', { status: 404 });
    }

    const cached = pdfCache.get(token)!;
    // Remove token after consumption to prevent replay
    pdfCache.delete(token);

    const filename = decodeURIComponent(params.filename || cached.filename || 'ValueLens_Report.pdf');

    return new NextResponse(cached.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': cached.buffer.byteLength.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (err: any) {
    return new NextResponse(err?.message || 'Download error', { status: 500 });
  }
}
