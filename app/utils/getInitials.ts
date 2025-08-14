export function getInitials(input: string): string {
    if (!input) return '';

    const words = input.trim().split(/\s+|&/).filter(Boolean);

    if (words.length === 1) {
        const word = words[0];
        return word.slice(0, 2).toUpperCase();
    }

    if (words.length > 2) {
        const first = words[0].charAt(0).toUpperCase();
        const last = words[words.length - 1].charAt(0).toUpperCase();
        return `${first}${last}`;
    }

    return words.map(word => word.charAt(0).toUpperCase()).join('');
}
