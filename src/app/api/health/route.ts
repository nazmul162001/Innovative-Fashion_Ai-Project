import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Live health check via Next.js Route Handler (no Express mount required). */
export async function GET() {
  return NextResponse.json({
    ok: true,
    runtime: 'next',
    service: 'inovative-web',
    ts: new Date().toISOString(),
  });
}
