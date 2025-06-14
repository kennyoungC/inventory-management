import { checkConnection } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const isConnected = await checkConnection();
    return NextResponse.json({
        database: isConnected ? 'Connected ✅' : 'Disconnected ❌',
        status: isConnected ? 200 : 500,
    });
}
