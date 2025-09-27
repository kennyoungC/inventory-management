import Staff from '../../lib/models/staffs';

export async function generateUniqueCode(): Promise<number> {
    const MIN = 100000;
    const MAX = 999999;
    const MAX_ATTEMPTS = 10;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const code = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
        const exists = await Staff.exists({ access_code: code, is_active: false });
        if (!exists) return code;
    }

    throw new Error('Unable to generate a unique code after several attempts.');
}

export const generateEntryId = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = Math.floor(Math.random() * 900) + 100;
    return `SE-${dateStr}-${suffix}`;
};
