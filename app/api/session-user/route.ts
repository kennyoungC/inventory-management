import { getCurrentSessionUser } from '@/app/lib/actions/current-session-user.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request) {
    const user = await getCurrentSessionUser(request as NextRequest);
    return NextResponse.json({ user });
}
