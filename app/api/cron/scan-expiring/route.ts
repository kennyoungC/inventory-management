import { scanExpiringBatchesAndNotify } from 'app/cronjob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization') || '';
    const token = process.env.CRON_SECRET;
    if (!token || authHeader !== `Bearer ${token}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await scanExpiringBatchesAndNotify(2);
    return NextResponse.json(result);
}
