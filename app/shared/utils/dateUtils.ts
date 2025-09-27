export const formatDate = (dateString: string | Date, addTime: boolean = false) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: addTime ? '2-digit' : undefined,
        minute: addTime ? '2-digit' : undefined,
    });
};

export const formatDateToRelative = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) {
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        }
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
        });
    }
};

export const getOneWeekFromToday = (): string => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().split('T')[0];
};

export const shouldSendExpiry = (expirationDate?: Date | null) => {
    if (!expirationDate) return null;
    const now = Date.now();
    const daysUntil = Math.ceil((expirationDate.getTime() - now) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 2 ? daysUntil : null;
};
