import { NextResponse } from 'next/server';

// Versão de release da aplicação.
// A cada build ou deploy, o timestamp/commit garante a detecção de uma nova versão.
const APP_VERSION = process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_APP_VERSION || '1.1.0-' + Date.now();
const BUILD_TIME = new Date().toISOString();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(
    {
      version: APP_VERSION,
      buildTime: BUILD_TIME,
      timestamp: Date.now(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}
