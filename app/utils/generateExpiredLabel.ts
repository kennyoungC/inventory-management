import { LabelStatus } from '@/types/index';

export function generateExpiredLabel(expirationDate: Date): LabelStatus | undefined {
    let status: LabelStatus | undefined;
    if (expirationDate) {
        const today = new Date();
        const expDate = new Date(expirationDate);

        if (expDate < today) {
            status = 'Expired';
        } else {
            const diffInDays = Math.ceil(
                (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            );
            if (diffInDays <= 3) status = 'Expiring soon';
            else status = 'Valid';
        }
    }
    return status;
}
