import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Future Express mount point: /api/v1/*
 *
 * When ready (Vercel / serverless):
 *
 *   import { createServer } from '@/server/app';
 *   import serverless from 'serverless-http';
 *   const handler = serverless(createServer(), { basePath: '/api/v1' });
 *   export const GET = handler as never;
 *   export const POST = handler as never;
 *   // …other methods
 */
async function notWired() {
  return NextResponse.json(
    {
      error: 'not_implemented',
      message: 'Express API is scaffolded under src/server — mount with serverless-http when ready.',
    },
    { status: 501 },
  );
}

export const GET = notWired;
export const POST = notWired;
export const PUT = notWired;
export const PATCH = notWired;
export const DELETE = notWired;
